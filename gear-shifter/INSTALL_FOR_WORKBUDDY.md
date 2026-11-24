# 给 WorkBuddy 的安装指南 (Antigravity 流体挡位插件)

本压缩包为 **Antigravity 反重力流体挡位调节插件** 完整安装包。

## 为什么之前找不到 `workbench.html`？
当前机器上的 Antigravity 客户端是 Electron 打包版本，前端入口位于：
`C:\Users\glb\AppData\Local\Programs\antigravity\resources\app.asar` 内的 **`dist/preload.js`**（通过 `electron.webFrame.executeJavaScript` 注入页面）。

## WorkBuddy 一键安装步骤（二选一，零外部依赖）

### 方式一：运行 PowerShell 一键安装脚本
```powershell
powershell -ExecutionPolicy Bypass -File ".\install.ps1"
```

### 方式二：直接用 Node.js 注入 `app.asar`
```bash
node patch-asar.mjs install "C:\Users\glb\AppData\Local\Programs\antigravity\resources\app.asar"
```

> **注意**：如果提示 `app.asar` 被占用（EBUSY），请先**完全退出 Antigravity 进程**（托盘也退出），再执行上述命令，然后重新启动 Antigravity 即可生效。

## 卸载 / 恢复原样
```powershell
powershell -ExecutionPolicy Bypass -File ".\uninstall.ps1"
```
（会自动用安装时创建的 `app.asar.gear-bak` 还原或剥离注入块。）
