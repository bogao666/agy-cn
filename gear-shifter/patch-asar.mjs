/**
 * 零依赖 Antigravity app.asar 自动注入器 (Node.js)
 * 用法：
 *   node patch-asar.mjs install [app.asar路径]
 *   node patch-asar.mjs uninstall [app.asar路径]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GEAR_JS_PATH = path.join(__dirname, 'src', 'antigravity-gear-shifter.js');
const MARKER_START = '/* ==== ag-fluid-gear-shifter inject START ==== */';
const MARKER_END = '/* ==== ag-fluid-gear-shifter inject END ==== */';

function findDefaultAsar() {
  const candidates = [
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'antigravity', 'resources', 'app.asar'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Antigravity', 'resources', 'app.asar'),
    path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Antigravity', 'resources', 'app.asar'),
    path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Antigravity', 'resources', 'app.asar')
  ];
  return candidates.find((p) => p && fs.existsSync(p)) || null;
}

function readAsar(asarPath) {
  const buf = fs.readFileSync(asarPath);
  const headerPickleSize = buf.readUInt32LE(4);
  const dataOffset = 8 + headerPickleSize;
  const jsonLen = buf.readUInt32LE(12);
  const header = JSON.parse(buf.subarray(16, 16 + jsonLen).toString('utf8'));
  return { buf, dataOffset, header };
}

function writeAsar(asarPath, header, fileBuffers) {
  const jsonBuf = Buffer.from(JSON.stringify(header), 'utf8');
  const alignedJsonLen = (jsonBuf.length + 3) & ~3;
  const padLen = alignedJsonLen - jsonBuf.length;

  const prefix = Buffer.alloc(16);
  prefix.writeUInt32LE(4, 0);
  prefix.writeUInt32LE(alignedJsonLen + 8, 4);
  prefix.writeUInt32LE(alignedJsonLen + 4, 8);
  prefix.writeUInt32LE(jsonBuf.length, 12);

  const padding = padLen > 0 ? Buffer.alloc(padLen, 0) : Buffer.alloc(0);
  const outBuf = Buffer.concat([prefix, jsonBuf, padding, ...fileBuffers]);
  fs.writeFileSync(asarPath, outBuf);
}

function repackAsarWithModifiedPreload(asarPath, transformPreloadFn) {
  const { buf, dataOffset, header } = readAsar(asarPath);
  const preloadEntry = header?.files?.dist?.files?.['preload.js'];
  if (!preloadEntry || preloadEntry.unpacked) {
    throw new Error('未在 app.asar 中找到可修改的 dist/preload.js');
  }

  const oldPreloadStart = dataOffset + Number(preloadEntry.offset);
  const oldPreloadText = buf.subarray(oldPreloadStart, oldPreloadStart + preloadEntry.size).toString('utf8');
  const newPreloadText = transformPreloadFn(oldPreloadText);
  const newPreloadBuf = Buffer.from(newPreloadText, 'utf8');

  // 收集所有非 unpacked 文件并按原 offset 顺序重排
  const entries = [];
  function walk(node, keyPath) {
    if (node.files) {
      for (const [k, v] of Object.entries(node.files)) {
        walk(v, keyPath ? `${keyPath}/${k}` : k);
      }
    } else if (!node.unpacked && node.offset !== undefined) {
      entries.push({ keyPath, node, oldOffset: Number(node.offset), oldSize: node.size });
    }
  }
  walk(header, '');
  entries.sort((a, b) => a.oldOffset - b.oldOffset);

  const fileBuffers = [];
  let cursor = 0;
  for (const item of entries) {
    const fileBuf =
      item.keyPath === 'dist/preload.js'
        ? newPreloadBuf
        : buf.subarray(dataOffset + item.oldOffset, dataOffset + item.oldOffset + item.oldSize);

    item.node.offset = String(cursor);
    item.node.size = fileBuf.length;
    // 移除可能失效的旧完整性哈希（若存在）
    if (item.keyPath === 'dist/preload.js' && item.node.integrity) {
      delete item.node.integrity;
    }
    fileBuffers.push(fileBuf);
    cursor += fileBuf.length;
  }

  writeAsar(asarPath, header, fileBuffers);
}

function buildPreloadSnippet(gearScriptSource) {
  return `\n${MARKER_START}
;(function () {
  try {
    var electron = require('electron');
    var wf = electron && electron.webFrame;
    if (!wf || typeof wf.executeJavaScript !== 'function') return;
    var code = ${JSON.stringify(gearScriptSource)};
    var run = function () {
      try {
        var p = wf.executeJavaScript(code);
        if (p && p.catch) p.catch(function (e) { console.warn('[ag-gear-shifter]', e && e.message); });
      } catch (e) {}
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
      run();
    }
  } catch (err) {
    console.warn('[ag-gear-shifter] preload inject error:', err && err.message);
  }
})();
${MARKER_END}\n`;
}

function stripInjectedBlock(text) {
  const re = new RegExp(
    `\\n?${MARKER_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n?`,
    'g'
  );
  return text.replace(re, '\n');
}

const cmd = (process.argv[2] || 'install').toLowerCase();
const targetAsar = process.argv[3] || findDefaultAsar();

if (!targetAsar || !fs.existsSync(targetAsar)) {
  console.error('[错误] 未找到 Antigravity 的 app.asar，请传入路径：node patch-asar.mjs install "C:\\...\\resources\\app.asar"');
  process.exit(1);
}

const backupPath = `${targetAsar}.gear-bak`;

if (cmd === 'install') {
  if (!fs.existsSync(GEAR_JS_PATH)) {
    console.error(`[错误] 缺少插件源码: ${GEAR_JS_PATH}`);
    process.exit(1);
  }
  const gearSource = fs.readFileSync(GEAR_JS_PATH, 'utf8');
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(targetAsar, backupPath);
    console.log(`[备份] 已创建原始备份 -> ${backupPath}`);
  }
  repackAsarWithModifiedPreload(targetAsar, (oldText) => {
    const cleaned = stripInjectedBlock(oldText);
    return cleaned + buildPreloadSnippet(gearSource);
  });
  console.log(`[成功] 已将反重力流体挡位插件注入 app.asar -> ${targetAsar}`);
  console.log('[提示] 完全退出并重新打开 Antigravity 即可生效！');
} else if (cmd === 'uninstall') {
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, targetAsar);
    fs.unlinkSync(backupPath);
    console.log(`[已还原] 已从备份恢复原始 app.asar -> ${targetAsar}`);
  } else {
    repackAsarWithModifiedPreload(targetAsar, (oldText) => stripInjectedBlock(oldText));
    console.log(`[已移除] 已从 app.asar 剥离注入代码 -> ${targetAsar}`);
  }
} else {
  console.error(`未知命令: ${cmd}（请使用 install 或 uninstall）`);
  process.exit(1);
}
