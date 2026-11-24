/**
 * Antigravity Fluid Gear Shifter Plugin (反重力流体挡位调节器 — 字母外置 + 对话框增高 + 右键换色版)
 *
 * 核心特性：
 * 1. 打开反重力即自动运行，挂载在底部【模型选择 (Model Selection)】按钮右侧。
 * 2. 自动增高 Antigravity 对话输入框（Composer）与底部工具栏高度，为外置档位字母留出宽敞舒适空间。
 * 3. 自动剥离模型选择按钮上原有的档位字母后缀（如 "(Low)" / "(Med)" / "(High)" / "(XHigh)" / "(Extra)"）。
 * 4. 滑轨内部 100% 纯净无遮挡的 WebGL2 高密微粒子流体，LOW / MED / HIGH / EXTRA 字母清晰排布在滑轨外部正下方。
 * 5. 右键档位选择器弹出配色菜单，可随时切换最高档流体配色：
 *    - 红色（默认）/ 黑色（液态磁流体墨黑）/ 紫色 / 蓝色 / 绿色（均严格遵循左侧浅色 -> 中间渐变 -> 最右侧最浓深）。
 * 6. 2.4px 超高密微粒子矩阵 + 舒缓从左流到右 + 8路曼哈顿波前 + 5阶晶莹爆闪 + Stiffness=520/Damping=38 弹簧物理。
 */

(function () {
  'use strict';

  if (window.__ANTIGRAVITY_GEAR_SHIFTER_LOADED__) return;
  window.__ANTIGRAVITY_GEAR_SHIFTER_LOADED__ = true;

  const STORAGE_KEY = 'ag_fluid_gear_level_v1';
  const COLOR_STORAGE_KEY = 'ag_fluid_gear_colors_v2';

  const DEFAULT_GEAR_COLORS = {
    low: 'white',
    med: 'black',
    high: 'purple',
    extra: 'red'
  };

  const COLOR_THEMES = {
    white: {
      id: 'white',
      name: '白色',
      swatch: '#f8fafc',
      border: 'rgba(255, 255, 255, 0.42)',
      glow: 'rgba(255, 255, 255, 0.22)',
      thumbBg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.10) 100%)',
      thumbBorder: 'rgba(255, 255, 255, 0.48)',
      thumbCore: 'rgba(255, 255, 255, 0.92)',
      thumbShadow: '0 0 8px rgba(255, 255, 255, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
      labels: ['#ffffff', '#e5e7eb', '#d1d5db', '#9ca3af'],
      colLeft: [0.80, 0.84, 0.92],
      colMid: [0.94, 0.96, 1.0],
      colRight: [1.0, 1.0, 1.0],
      crestLeft: [1.0, 1.0, 1.0],
      crestRight: [1.0, 1.0, 1.0],
      isDarkInk: 0.0,
      isWhiteMode: 1.0,
      isCosmos: 0.0
    },
    red: {
      id: 'red',
      name: '红色',
      swatch: '#ff243c',
      border: 'rgba(255, 48, 66, 0.85)',
      glow: 'rgba(240, 20, 42, 0.42)',
      thumbBg: 'linear-gradient(180deg, rgba(255, 190, 198, 0.26) 0%, rgba(255, 48, 68, 0.14) 100%)',
      thumbBorder: 'rgba(255, 150, 162, 0.58)',
      thumbCore: 'rgba(255, 215, 220, 0.92)',
      thumbShadow: '0 0 10px rgba(255, 32, 54, 0.55), inset 0 1px 0 rgba(255, 210, 218, 0.45)',
      labels: ['#ffa6b0', '#ff7080', '#ff3b52', '#ff1e38'],
      colLeft: [1.0, 0.65, 0.70],
      colMid: [1.0, 0.28, 0.36],
      colRight: [0.90, 0.01, 0.10],
      crestLeft: [1.0, 0.88, 0.90],
      crestRight: [1.0, 0.14, 0.24],
      isDarkInk: 0.0,
      isWhiteMode: 0.0,
      isCosmos: 0.0
    },
    black: {
      id: 'black',
      name: '黑色',
      swatch: '#06070a',
      border: 'rgba(165, 174, 188, 0.52)',
      glow: 'rgba(0, 0, 0, 0.72)',
      thumbBg: 'linear-gradient(180deg, rgba(22, 24, 30, 0.56) 0%, rgba(4, 5, 7, 0.50) 100%)',
      thumbBorder: 'rgba(220, 226, 236, 0.38)',
      thumbCore: 'rgba(235, 240, 248, 0.82)',
      thumbShadow: '0 0 8px rgba(0, 0, 0, 0.78), inset 0 1px 0 rgba(255, 255, 255, 0.28)',
      labels: ['#9ca3af', '#6b7280', '#3f4450', '#e5e7eb'],
      colLeft: [0.44, 0.47, 0.53],
      colMid: [0.10, 0.11, 0.14],
      colRight: [0.005, 0.005, 0.008],
      crestLeft: [0.60, 0.64, 0.70],
      crestRight: [0.05, 0.055, 0.07],
      isDarkInk: 1.0,
      isWhiteMode: 0.0,
      isCosmos: 0.0
    },
    purple: {
      id: 'purple',
      name: '紫色',
      swatch: '#7e22ce',
      border: 'rgba(168, 85, 247, 0.86)',
      glow: 'rgba(126, 34, 206, 0.48)',
      thumbBg: 'linear-gradient(180deg, rgba(224, 190, 255, 0.24) 0%, rgba(126, 34, 206, 0.16) 100%)',
      thumbBorder: 'rgba(216, 180, 254, 0.58)',
      thumbCore: 'rgba(242, 224, 255, 0.92)',
      thumbShadow: '0 0 10px rgba(147, 51, 234, 0.62), inset 0 1px 0 rgba(236, 214, 255, 0.45)',
      labels: ['#f7e0ff', '#d094ff', '#9333ea', '#581c87'],
      colLeft: [0.97, 0.88, 1.0],
      colMid: [0.64, 0.24, 0.98],
      colRight: [0.24, 0.01, 0.58],
      crestLeft: [1.0, 0.96, 1.0],
      crestRight: [0.46, 0.08, 0.86],
      isDarkInk: 0.0,
      isWhiteMode: 0.0,
      isCosmos: 0.0
    },
    blue: {
      id: 'blue',
      name: '蓝色',
      swatch: '#2563eb',
      border: 'rgba(59, 130, 246, 0.86)',
      glow: 'rgba(37, 99, 235, 0.44)',
      thumbBg: 'linear-gradient(180deg, rgba(186, 224, 255, 0.26) 0%, rgba(37, 99, 235, 0.14) 100%)',
      thumbBorder: 'rgba(147, 197, 253, 0.58)',
      thumbCore: 'rgba(220, 240, 255, 0.92)',
      thumbShadow: '0 0 10px rgba(59, 130, 246, 0.58), inset 0 1px 0 rgba(205, 232, 255, 0.45)',
      labels: ['#a8dcff', '#62b4ff', '#2b82ff', '#0b52ff'],
      colLeft: [0.64, 0.86, 1.0],
      colMid: [0.18, 0.56, 1.0],
      colRight: [0.01, 0.22, 0.94],
      crestLeft: [0.88, 0.96, 1.0],
      crestRight: [0.20, 0.52, 1.0],
      isDarkInk: 0.0,
      isWhiteMode: 0.0,
      isCosmos: 0.0
    },
    green: {
      id: 'green',
      name: '绿色',
      swatch: '#10b981',
      border: 'rgba(16, 185, 129, 0.86)',
      glow: 'rgba(16, 185, 129, 0.42)',
      thumbBg: 'linear-gradient(180deg, rgba(167, 243, 208, 0.26) 0%, rgba(16, 185, 129, 0.14) 100%)',
      thumbBorder: 'rgba(110, 231, 183, 0.58)',
      thumbCore: 'rgba(220, 252, 238, 0.92)',
      thumbShadow: '0 0 10px rgba(16, 185, 129, 0.56), inset 0 1px 0 rgba(196, 250, 225, 0.45)',
      labels: ['#a6ffcf', '#5ceba4', '#1ad478', '#00a852'],
      colLeft: [0.65, 1.0, 0.80],
      colMid: [0.12, 0.85, 0.48],
      colRight: [0.0, 0.58, 0.22],
      crestLeft: [0.88, 1.0, 0.94],
      crestRight: [0.14, 0.88, 0.45],
      isDarkInk: 0.0,
      isWhiteMode: 0.0,
      isCosmos: 0.0
    },
    cosmos: {
      id: 'cosmos',
      name: '宇宙色',
      swatch: 'radial-gradient(circle at 30% 30%, #67e8f9 0%, #6366f1 42%, #a855f7 68%, #070918 100%)',
      border: 'rgba(139, 92, 246, 0.82)',
      glow: 'rgba(99, 102, 241, 0.52)',
      thumbBg: 'linear-gradient(180deg, rgba(165, 243, 252, 0.24) 0%, rgba(124, 58, 237, 0.20) 100%)',
      thumbBorder: 'rgba(165, 243, 252, 0.65)',
      thumbCore: 'rgba(224, 242, 254, 0.95)',
      thumbShadow: '0 0 12px rgba(99, 102, 241, 0.72), 0 0 5px rgba(56, 189, 248, 0.65), inset 0 1px 0 rgba(224, 242, 254, 0.55)',
      labels: ['#7dd3fc', '#818cf8', '#c084fc', '#f0abfc'],
      colLeft: [0.06, 0.14, 0.34],
      colMid: [0.18, 0.08, 0.36],
      colRight: [0.04, 0.03, 0.14],
      crestLeft: [0.42, 0.90, 1.0],
      crestRight: [0.92, 0.55, 1.0],
      isDarkInk: 0.0,
      isWhiteMode: 0.0,
      isCosmos: 1.0
    }
  };
  const COLOR_ORDER = ['red', 'black', 'purple', 'blue', 'green', 'cosmos', 'white'];

  const GEARS = [
    {
      id: 'low',
      label: 'LOW',
      fullName: 'Low',
      index: 0,
      norm: 0.0,
      isTop: false,
      flowSpeed: 0.48,
      density: 0.72,
      promptTag: '[Effort: Low]',
      desc: '极速轻量推理 · 高密白色粒子流体'
    },
    {
      id: 'med',
      label: 'MED',
      fullName: 'Medium',
      index: 1,
      norm: 1 / 3,
      isTop: false,
      flowSpeed: 0.68,
      density: 0.82,
      promptTag: '[Effort: Medium]',
      desc: '均衡标准推理 · 高密白色粒子流体'
    },
    {
      id: 'high',
      label: 'HIGH',
      fullName: 'High',
      index: 2,
      norm: 2 / 3,
      isTop: false,
      flowSpeed: 0.92,
      density: 0.90,
      promptTag: '[Effort: High]',
      desc: '深度架构推理 · 高密白色粒子流体'
    },
    {
      id: 'extra',
      label: 'EXTRA',
      fullName: 'XHigh',
      aliases: ['extra', 'xhigh', 'max', 'extra high'],
      index: 3,
      norm: 1.0,
      isTop: true,
      flowSpeed: 1.18,
      density: 0.98,
      promptTag: '[Effort: Extra]',
      desc: '最高档 · 左侧浅色至最右侧深色渐变高密粒子流体（右键可换色）'
    }
  ];

  const GEAR_SUFFIX_REGEX =
    /\s*(?:\((?:Low|Med|Medium|High|XHigh|Extra|Extra\s*High|Max|极速|标准|高|最高)\)|\[(?:Low|Med|Medium|High|XHigh|Extra|Max)\]|-(?:\s*(?:Low|Med|Medium|High|XHigh|Extra|Max)))\s*$/i;

  function injectStyles() {
    if (document.getElementById('ag-fluid-gear-styles')) return;
    const style = document.createElement('style');
    style.id = 'ag-fluid-gear-styles';
    style.textContent = `
      [data-ag-expanded-composer="true"] {
        display: flex !important;
        flex-direction: column !important;
        min-height: 96px !important;
        padding-bottom: 13px !important;
      }

      [data-ag-expanded-editor="true"] {
        min-height: 28px !important;
      }

      /* 将整条底部工具栏（+ / 模型名 / 流体条 / Turbo / 麦克风 / 发送）统一沉底贴齐输入框最下方 */
      [data-ag-bottom-bar="true"] {
        margin-top: auto !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
        overflow: visible !important;
      }

      /* 强制模型选择按钮与其右侧流体滑轨在同一水平行内并排对齐（即使展开下拉菜单也绝不掉到下方） */
      [data-ag-gear-row="true"] {
        display: inline-flex !important;
        flex-direction: row !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        gap: 8px !important;
        width: auto !important;
        max-width: none !important;
        overflow: visible !important;
      }

      [data-ag-gear-row-flex="true"] {
        flex-direction: row !important;
        align-items: center !important;
        overflow: visible !important;
      }

      [data-ag-gear-row-flex="true"] > .ag-gear-shifter-host {
        margin-left: 6px !important;
      }

      [data-ag-model-btn="true"] {
        flex-shrink: 0 !important;
        width: auto !important;
        white-space: nowrap !important;
      }

      /* 绝不对单个局部包装盒加 padding-bottom，保持与左侧 + 号、右侧 Turbo/发送按钮处于同一水平线 */
      [data-ag-expanded-toolbar="true"] {
        align-items: center !important;
        overflow: visible !important;
      }

      /* 静默切换真实原生下拉菜单时短暂隐藏菜单闪屏 */
      html.ag-gear-stealth-switching [role="menu"],
      html.ag-gear-stealth-switching [role="listbox"],
      html.ag-gear-stealth-switching [role="dialog"][data-state="open"],
      html.ag-gear-stealth-switching [data-radix-popper-content-wrapper],
      html.ag-gear-stealth-switching [data-floating-ui-portal],
      html.ag-gear-stealth-switching [data-ag-stealth-popover="true"] {
        opacity: 0 !important;
        transition: none !important;
        animation: none !important;
      }

      /* 容器高度严格等于滑轨本身高度 (22px)，保证滑轨与左侧模型选择按钮水平居中对齐，文字绝对定位在更下方 */
      .ag-gear-shifter-host {
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        flex-shrink: 0;
        height: 22px;
        user-select: none;
        -webkit-user-select: none;
        position: relative;
        z-index: 20;
        font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
      }

      /* 流体条：精致黄金比例（长度 176px，高度 22px） */
      .ag-gear-capsule {
        position: relative;
        width: 176px;
        height: 22px;
        border-radius: 6px;
        background: #151515;
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow:
          inset 0 1px 2px rgba(0, 0, 0, 0.88),
          0 1px 3px rgba(0, 0, 0, 0.28);
        overflow: hidden;
        cursor: grab;
        touch-action: none;
        transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
      }

      .ag-gear-capsule:active {
        cursor: grabbing;
      }

      .ag-gear-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }

      .ag-gear-stops {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
      }

      .ag-gear-stop-dot {
        position: absolute;
        top: 50%;
        width: 3px;
        height: 3px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.30);
        transform: translate(-50%, -50%);
        transition: opacity 0.18s ease;
      }

      .ag-gear-stop-dot.is-covered {
        opacity: 0;
      }

      /* 半透明液态玻璃光学光刃游标（与流体融为一体，粒子可穿透棱镜流淌，彻底消除突兀死白块） */
      .ag-gear-thumb-pill {
        position: absolute;
        top: 2px;
        bottom: 2px;
        width: 9px;
        border-radius: 4px;
        pointer-events: none;
        z-index: 3;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.24) 0%,
          rgba(255, 255, 255, 0.10) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.44);
        backdrop-filter: blur(2.5px);
        -webkit-backdrop-filter: blur(2.5px);
        box-shadow:
          0 0 8px rgba(255, 255, 255, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.45);
        transform: translateX(0px);
        transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
      }

      /* 内部竖向微光灯丝（精密光学刻度质感） */
      .ag-gear-thumb-pill::after {
        content: '';
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 50%;
        width: 1.5px;
        transform: translateX(-50%);
        border-radius: 999px;
        background: var(--ag-thumb-core, rgba(255, 255, 255, 0.86));
        box-shadow: 0 0 5px var(--ag-thumb-core, rgba(255, 255, 255, 0.7));
        transition: background 0.18s ease, box-shadow 0.18s ease, top 0.15s ease, bottom 0.15s ease;
      }

      .ag-gear-capsule:hover .ag-gear-thumb-pill::after,
      .ag-gear-capsule.is-dragging .ag-gear-thumb-pill::after {
        top: 2.5px;
        bottom: 2.5px;
      }

      /* 档位字母位于流体条正下方 (top: calc(100% + 3px))，不影响流体条与 + 号 / 模型选择器的水平居中对齐 */
      .ag-gear-external-labels {
        position: absolute;
        top: calc(100% + 3px);
        left: 0;
        right: 0;
        height: 12px;
        display: flex;
        align-items: center;
      }

      .ag-gear-ext-label {
        position: absolute;
        top: 0;
        transform: translateX(-50%);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
        line-height: 12px;
        color: rgba(160, 166, 178, 0.72);
        cursor: pointer;
        padding: 0 2px;
        border-radius: 3px;
        transition: color 0.16s ease, transform 0.16s ease, text-shadow 0.16s ease;
      }

      .ag-gear-ext-label:hover {
        color: rgba(255, 255, 255, 0.92);
      }

      .ag-gear-ext-label.is-passed {
        color: rgba(235, 240, 248, 0.78);
      }

      .ag-gear-ext-label.is-active {
        color: #ffffff;
        transform: translateX(-50%) scale(1.06);
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.55);
      }

      .ag-gear-ext-label[data-idx="0"] { left: 1px; transform: translateX(0); }
      .ag-gear-ext-label[data-idx="0"].is-active { transform: translateX(0) scale(1.05); }
      .ag-gear-ext-label[data-idx="1"] { left: 33%; }
      .ag-gear-ext-label[data-idx="2"] { left: 61%; }
      .ag-gear-ext-label[data-idx="3"] { left: auto; right: 1px; transform: translateX(0); }
      .ag-gear-ext-label[data-idx="3"].is-active { transform: translateX(0) scale(1.05); }

      /* ===== 右键配色切换菜单 ===== */
      .ag-gear-ctx-menu {
        position: fixed;
        z-index: 999999;
        min-width: 148px;
        padding: 5px;
        border-radius: 10px;
        background: rgba(22, 24, 30, 0.96);
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #f3f4f6;
        user-select: none;
      }

      .ag-gear-ctx-title {
        padding: 4px 8px 5px;
        font-size: 10.5px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.48);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        margin-bottom: 4px;
      }

      .ag-gear-ctx-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        padding: 6px 8px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: #e5e7eb;
        font-size: 12px;
        cursor: pointer;
        text-align: left;
        transition: background 0.14s ease, color 0.14s ease;
      }

      .ag-gear-ctx-item:hover {
        background: rgba(255, 255, 255, 0.10);
        color: #ffffff;
      }

      .ag-gear-ctx-item.is-selected {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        font-weight: 600;
      }

      .ag-gear-ctx-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ag-gear-ctx-swatch {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.35);
        flex-shrink: 0;
      }

      .ag-gear-ctx-check {
        font-size: 11px;
        opacity: 0.9;
      }

      [data-ag-hidden-gear-badge="true"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  const GRID_VS = `#version 300 es
    in vec2 a_pos;
    out vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const GRID_FS = `#version 300 es
    precision highp float;

    in vec2 v_uv;
    out vec4 fragColor;

    uniform vec2  u_res;
    uniform float u_phase;      // 严格单调递增的积分相位 (永不倒流!)
    uniform float u_time;       // 柔和闪烁用的独立时间
    uniform float u_fill;
    uniform float u_whiteBlend; // 1.0 = 纯白珠光流体, 0.0 = 彩色/玄黑左浅右深流体
    uniform float u_density;
    uniform float u_ignite;
    uniform vec3  u_colLeft;
    uniform vec3  u_colMid;
    uniform vec3  u_colRight;
    uniform vec3  u_crestLeft;
    uniform vec3  u_crestRight;
    uniform float u_isDarkInk;
    uniform float u_isCosmos;

    vec2 hash22(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.xx + p3.yz) * p3.zy);
    }

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    // 丝滑 2D 梯度/价值连续噪声
    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); // 五次平滑曲线，无折痕
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // 连贯柔顺的分形布朗流体场 (fBM)
    float fbm(vec2 p) {
      float v = 0.0;
      float amp = 0.52;
      for (int i = 0; i < 4; i++) {
        v += amp * smoothNoise(p);
        p = p * 2.02 + vec2(13.7, 7.3);
        amp *= 0.48;
      }
      return v;
    }

    vec3 hash32(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
      p3 += dot(p3, p3.yxz + 33.33);
      return fract((p3.xxy + p3.yzz) * p3.zyx);
    }

    // 高度随机排布 + 黄金比例行错位 + 非周期有机闪烁的向右滑行星尘层
    // 返回 vec2(柔和微粒体, 随机钻石星芒)
    vec2 sparkleParticleLayer(vec2 px, float tileSize, float speedMult, float radiusPx, float seedOffset, float starStrength, float spawnProb) {
      // 有机流体纵向轻柔扰动（无周期性规则斜纹）
      float organicY = (smoothNoise(vec2(px.x * 0.025 - u_phase * 0.5, seedOffset * 3.1)) - 0.5) * 3.2;
      vec2 p = vec2(px.x - u_phase * speedMult, px.y + organicY);

      float rowIdx = floor(p.y / tileSize);
      // 黄金比例行错位 + 每行独立微速差，彻底打破任何网格阵列感
      float rowHash = hash21(vec2(rowIdx, seedOffset * 13.7));
      float rowExtraShift = fract(rowIdx * 0.61803398 + rowHash) * tileSize + u_phase * (rowHash - 0.5) * speedMult * 0.28;
      p.x -= rowExtraShift;

      vec2 cell = floor(p / tileSize);
      vec2 local = fract(p / tileSize);
      float bodyAcc = 0.0;
      float starAcc = 0.0;

      for (int oy = -1; oy <= 1; oy++) {
        for (int ox = -1; ox <= 1; ox++) {
          vec2 nCell = cell + vec2(float(ox), float(oy));
          vec3 rndA = hash32(nCell + vec2(seedOffset * 23.17, seedOffset * 11.41));
          vec3 rndB = hash32(nCell * 1.73 + vec2(seedOffset * 7.13, 31.9));

          // 随机稀疏抽样：不是每个格子都有粒子，打破均匀间距，形成自然随机星团感
          if (rndA.z > spawnProb) continue;

          // 满格宽范围随机抖动中心
          vec2 center = vec2(float(ox), float(oy)) + 0.06 + rndA.xy * 0.88;
          vec2 diffPx = (local - center) * tileSize;

          float dist = length(vec2(diffPx.x * 0.80, diffPx.y));

          // 非周期双频调制闪烁：每颗粒子在完全不可预测的随机时刻忽明忽暗
          float tPhase = rndB.x * 6.28318;
          float freq1 = 2.4 + rndB.y * 5.8;
          float freq2 = 1.1 + rndB.z * 3.7;
          float rawBlink = 0.5 + 0.5 * sin(u_time * freq1 + tPhase + 1.6 * sin(u_time * freq2 + rndA.x * 6.28318));
          float glintPeak = pow(rawBlink, 4.2);

          // 大小差异拉开：极细微星尘到璀璨主星随机混合
          float sizeBias = pow(rndB.y, 1.35);
          float r = radiusPx * (0.45 + 0.95 * sizeBias);

          float core = smoothstep(r, r * 0.08, dist);
          float halo = smoothstep(r * 2.9, 0.0, dist) * 0.40;
          bodyAcc += (core + halo) * (0.35 + 0.65 * rawBlink);

          // 随机角度的钻石星芒（部分正十字，部分随机微倾旋转，闪亮排布彻底自然随机）
          if (starStrength > 0.01 && rndB.z > 0.30) {
            float ang = (rndA.x - 0.5) * 1.1;
            float ca = cos(ang);
            float sa = sin(ang);
            vec2 rotP = vec2(diffPx.x * ca - diffPx.y * sa, diffPx.x * sa + diffPx.y * ca);

            float starLen = r * (2.4 + 3.4 * glintPeak) * (0.7 + 0.6 * rndB.y);
            float hRay = exp(-abs(rotP.y) * 2.8) * smoothstep(starLen, 0.0, abs(rotP.x));
            float vRay = exp(-abs(rotP.x) * 2.8) * smoothstep(starLen * (0.65 + 0.35 * rndA.y), 0.0, abs(rotP.y));
            float pinCore = smoothstep(r * 1.1, 0.0, length(diffPx));
            starAcc += (pinCore * 1.25 + (hRay + vRay) * 0.78) * glintPeak * starStrength;
          }
        }
      }
      return vec2(min(1.5, bodyAcc), min(2.0, starAcc));
    }

    void main() {
      vec2 px = vec2(v_uv.x * u_res.x, (1.0 - v_uv.y) * u_res.y);

      // 1. 流畅液态前沿遮罩
      float fillEndPx = u_fill * u_res.x;
      float meniscus = sin(px.y * 0.28 - u_phase * 1.6) * 2.0
                     + cos(px.y * 0.16 - u_phase * 1.1) * 1.0;
      float effectiveEnd = fillEndPx + (u_fill > 0.96 ? 4.0 : meniscus);
      float inFillMask = smoothstep(effectiveEnd + 4.0, effectiveEnd - 2.5, px.x);
      if (inFillMask <= 0.002) {
        fragColor = vec4(0.0);
        return;
      }

      // 2. 域扭曲丝滑液态流体主体 —— 严格单向从左向右平流 (+X)
      vec2 uvFluid = vec2(px.x * 0.022 - u_phase * 0.42, px.y * 0.065);
      vec2 warp = vec2(
        fbm(uvFluid + vec2(0.0, 1.4)),
        fbm(uvFluid * 1.25 + vec2(-u_phase * 0.18, 4.2))
      );
      float silkFluid = fbm(uvFluid + (warp - 0.5) * 1.35);
      float ribbonCrest = smoothstep(0.34, 0.76, silkFluid);

      // 有机不规则液态流光斑（由 fBM 调制，不再是死板的周期斜条纹）
      float organicSheen = smoothstep(0.56, 0.86, fbm(vec2(px.x * 0.035 - u_phase * 0.95, px.y * 0.07 + 3.1)));
      float topGlassGloss = smoothstep(u_res.y * 0.40, 0.0, px.y) * 0.16;

      // 3. 四层无理数尺寸随机视差星尘微粒流（彻底消除规律排布，全部严格向右平流）
      vec2 L1 = sparkleParticleLayer(px, 4.3,  11.5, 0.72, 1.3, 0.65, 0.58);
      vec2 L2 = sparkleParticleLayer(px, 6.9,  17.8, 0.98, 2.9, 1.05, 0.52);
      vec2 L3 = sparkleParticleLayer(px, 10.7, 24.5, 1.25, 5.1, 1.45, 0.46);
      vec2 L4 = sparkleParticleLayer(px, 15.3, 31.0, 1.48, 8.7, 1.75, 0.36);

      float particleBody = (L1.x * 0.45 + L2.x * 0.52 + L3.x * 0.48 + L4.x * 0.36) * (0.58 + 0.60 * ribbonCrest);
      float diamondStar  = (L1.y * 0.55 + L2.y * 0.78 + L3.y * 0.95 + L4.y * 1.05) * (0.68 + 0.52 * ribbonCrest);
      float frontBoost   = smoothstep(16.0, 0.0, abs(px.x - fillEndPx)) * (0.14 + 0.22 * u_ignite);

      // 4. 颜色与璀璨闪亮合成
      vec3 whiteBase = mix(vec3(0.74, 0.79, 0.88), vec3(0.98, 0.99, 1.0), ribbonCrest);
      vec3 whiteColor = whiteBase
                      + vec3(0.28, 0.30, 0.34) * min(1.0, particleBody)
                      + vec3(1.0, 1.0, 1.0) * (diamondStar * 1.02 + organicSheen * 0.22 + topGlassGloss + frontBoost * 0.35);
      float whiteAlpha = clamp((0.38 + 0.36 * silkFluid + 0.48 * particleBody + 0.72 * diamondStar) * inFillMask, 0.0, 0.98);

      // 按当前已填充长度归一化左浅右深渐变，保证 MED 黑色、HIGH 紫色、EXTRA 红色都在各自右端达到最深纯色
      float xGrad = clamp(px.x / max(1.0, fillEndPx), 0.0, 1.0);
      vec3 gradColor = mix(u_colLeft, u_colMid, smoothstep(0.0, 0.46, xGrad));
      gradColor = mix(gradColor, u_colRight, smoothstep(0.42, 0.95, xGrad));

      vec3 coloredFluid;
      float coloredAlpha;
      if (u_isDarkInk > 0.5) {
        vec3 inkBase = mix(gradColor * 1.15, gradColor * 0.52, smoothstep(0.25, 0.85, silkFluid));
        vec3 dustTint = mix(vec3(0.84, 0.88, 0.96), vec3(0.24, 0.27, 0.34), smoothstep(0.0, 0.92, xGrad));
        vec3 starSilver = mix(vec3(0.98, 0.99, 1.0), vec3(0.80, 0.86, 0.96), xGrad);
        coloredFluid = mix(inkBase, dustTint, clamp(particleBody * (0.42 - 0.24 * xGrad), 0.0, 0.55));
        coloredFluid += starSilver * (diamondStar * (0.95 - 0.20 * xGrad) + organicSheen * (0.18 - 0.06 * xGrad) + topGlassGloss * 0.55);
        coloredAlpha = clamp((0.94 + 0.06 * silkFluid) * inFillMask, 0.0, 0.99);
      } else {
        vec3 deepLiquid = gradColor * (0.66 - 0.16 * xGrad);
        vec3 midLiquid  = gradColor * (1.04 + 0.12 * ribbonCrest);
        vec3 sparkTint  = mix(u_crestLeft, u_crestRight, smoothstep(0.08, 0.92, xGrad));
        vec3 starJewel  = mix(vec3(1.0, 0.98, 0.99), mix(sparkTint, vec3(1.0), 0.62), xGrad);

        coloredFluid = mix(deepLiquid, midLiquid, smoothstep(0.24, 0.76, silkFluid));
        coloredFluid = mix(coloredFluid, sparkTint, clamp(particleBody * 0.45, 0.0, 0.72));
        coloredFluid += starJewel * (diamondStar * 1.02 + organicSheen * 0.20 + topGlassGloss * 0.70 + frontBoost * 0.28);
        coloredAlpha = clamp((0.72 + 0.20 * silkFluid + 0.35 * particleBody + 0.62 * diamondStar) * inFillMask, 0.0, 0.99);
      }

      // 宇宙色专属渲染：深邃暗夜虚空 + 双层流动星云（青蓝星河 + 紫粉星云 + 暖金星核） + 浩瀚多彩繁星海
      vec3 cosmosColor = vec3(0.0);
      if (u_isCosmos > 0.005) {
        vec2 uvNeb1 = vec2(px.x * 0.018 - u_phase * 0.30, px.y * 0.055);
        vec2 uvNeb2 = vec2(px.x * 0.026 - u_phase * 0.44 + 7.3, px.y * 0.068 - 2.4);
        float nebCyan   = smoothstep(0.32, 0.82, fbm(uvNeb1 + (warp - 0.5) * 1.45));
        float nebViolet = smoothstep(0.36, 0.84, fbm(uvNeb2 - (warp - 0.5) * 1.25));
        float nebGold   = smoothstep(0.62, 0.90, silkFluid * nebViolet);

        // 深邃宇宙夜空基底
        vec3 deepSpace = mix(vec3(0.015, 0.022, 0.065), vec3(0.032, 0.016, 0.085), xGrad);
        // 浩瀚多色星云叠加
        vec3 nebula = deepSpace
                    + vec3(0.06, 0.44, 0.88) * nebCyan * 0.62
                    + vec3(0.56, 0.14, 0.86) * nebViolet * 0.64
                    + vec3(0.92, 0.24, 0.58) * (nebViolet * nebCyan) * 0.45
                    + vec3(1.00, 0.78, 0.42) * nebGold * 0.42;

        // 额外微距深空细密微尘繁星层
        vec2 farStars = sparkleParticleLayer(px, 3.1, 6.5, 0.48, 12.7, 0.35, 0.68);
        // 繁星自然光谱色（冷青蓝巨星 / 钻白主序星 / 暖金恒星 / 星云粉紫星）
        float starSpec = hash21(floor((px - vec2(u_phase * 14.0, 0.0)) / 5.5));
        vec3 starHue = starSpec < 0.33
          ? vec3(0.76, 0.92, 1.0)
          : (starSpec < 0.66 ? vec3(1.0, 0.98, 0.96) : (starSpec < 0.86 ? vec3(1.0, 0.88, 0.66) : vec3(0.96, 0.76, 1.0)));

        cosmosColor = nebula
                    + vec3(0.78, 0.88, 1.0) * farStars.x * 0.62
                    + vec3(0.95, 0.98, 1.0) * farStars.y * 0.85
                    + starHue * (particleBody * 0.65 + diamondStar * 1.35)
                    + vec3(0.55, 0.82, 1.0) * (organicSheen * 0.14 + topGlassGloss * 0.55);
      }

      coloredFluid = mix(coloredFluid, cosmosColor, u_isCosmos);
      coloredAlpha = mix(coloredAlpha, clamp((0.95 + 0.05 * silkFluid) * inFillMask, 0.0, 0.99), u_isCosmos);

      vec3 finalRGB = mix(coloredFluid, whiteColor, u_whiteBlend);
      float outAlpha = mix(coloredAlpha, whiteAlpha, u_whiteBlend);
      fragColor = vec4(finalRGB * outAlpha, outAlpha);
    }
  `;

  class ClaudeFluidGridEngine {
    constructor(canvas, getState) {
      this.canvas = canvas;
      this.getState = getState;
      this.time = 0;
      this.flowPhase = 0; // 严格单调递增积分相位，彻底杜绝换色/换挡时的倒流现象
      this.lastTs = performance.now();
      this.width = 176;
      this.height = 22;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.gl = canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true
      });

      this.resize();
      if (this.gl) {
        this.initWebGL();
      } else {
        this.ctx2d = canvas.getContext('2d');
      }

      this.running = true;
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width || 176;
      this.height = rect.height || 22;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    compileShader(type, source) {
      const gl = this.gl;
      const sh = gl.createShader(type);
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }

    initWebGL() {
      const gl = this.gl;
      const vs = this.compileShader(gl.VERTEX_SHADER, GRID_VS);
      const fs = this.compileShader(gl.FRAGMENT_SHADER, GRID_FS);
      if (!vs || !fs) {
        this.gl = null;
        this.ctx2d = this.canvas.getContext('2d');
        return;
      }

      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);
      this.program = prog;

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posLoc = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      this.uRes = gl.getUniformLocation(prog, 'u_res');
      this.uPhase = gl.getUniformLocation(prog, 'u_phase');
      this.uTime = gl.getUniformLocation(prog, 'u_time');
      this.uFill = gl.getUniformLocation(prog, 'u_fill');
      this.uWhiteBlend = gl.getUniformLocation(prog, 'u_whiteBlend');
      this.uDensity = gl.getUniformLocation(prog, 'u_density');
      this.uIgnite = gl.getUniformLocation(prog, 'u_ignite');
      this.uColLeft = gl.getUniformLocation(prog, 'u_colLeft');
      this.uColMid = gl.getUniformLocation(prog, 'u_colMid');
      this.uColRight = gl.getUniformLocation(prog, 'u_colRight');
      this.uCrestLeft = gl.getUniformLocation(prog, 'u_crestLeft');
      this.uCrestRight = gl.getUniformLocation(prog, 'u_crestRight');
      this.uIsDarkInk = gl.getUniformLocation(prog, 'u_isDarkInk');
      this.uIsCosmos = gl.getUniformLocation(prog, 'u_isCosmos');
    }

    loop(now) {
      if (!this.running) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTs) * 0.001));
      this.lastTs = now;
      this.time += dt;
      const state = this.getState();
      const pos = Math.max(0, Math.min(1, state.pos));
      // 积分相位每帧只增不减，无论怎么换色或拖动都绝不倒流
      const flowSpeed = 0.55 + Math.pow(pos, 1.15) * 0.65;
      this.flowPhase += dt * flowSpeed;
      this.render(flowSpeed);
      requestAnimationFrame(this.loop);
    }

    render(flowSpeed = 0.8) {
      const state = this.getState();
      const pos = Math.max(0, Math.min(1, state.pos));
      const padNorm = 7 / Math.max(40, this.width);
      const fillNorm = padNorm + pos * (1 - padNorm * 2) + (pos > 0.96 ? padNorm : 0.02);
      const density = 0.72 + pos * 0.26;

      // 根据当前连续挡位 pos (0..1 -> 0..3) 平滑插值相邻两档的颜色主题
      const scaled = pos * 3;
      const idxA = Math.max(0, Math.min(3, Math.floor(scaled)));
      const idxB = Math.max(0, Math.min(3, Math.ceil(scaled)));
      const frac = scaled - idxA;
      const t = frac * frac * (3 - 2 * frac);

      const themeA = COLOR_THEMES[state.gearColors[GEARS[idxA].id]] || COLOR_THEMES.white;
      const themeB = COLOR_THEMES[state.gearColors[GEARS[idxB].id]] || COLOR_THEMES.red;
      const lerp3 = (a, b, f) => [
        a[0] + (b[0] - a[0]) * f,
        a[1] + (b[1] - a[1]) * f,
        a[2] + (b[2] - a[2]) * f
      ];

      const colLeft = lerp3(themeA.colLeft, themeB.colLeft, t);
      const colMid = lerp3(themeA.colMid, themeB.colMid, t);
      const colRight = lerp3(themeA.colRight, themeB.colRight, t);
      const crestLeft = lerp3(themeA.crestLeft, themeB.crestLeft, t);
      const crestRight = lerp3(themeA.crestRight, themeB.crestRight, t);
      const whiteBlend = themeA.isWhiteMode + (themeB.isWhiteMode - themeA.isWhiteMode) * t;
      const isDarkInk = themeA.isDarkInk + (themeB.isDarkInk - themeA.isDarkInk) * t;
      const isCosmos = (themeA.isCosmos || 0) + ((themeB.isCosmos || 0) - (themeA.isCosmos || 0)) * t;

      if (this.gl && this.program) {
        const gl = this.gl;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program);
        gl.uniform2f(this.uRes, this.width, this.height);
        gl.uniform1f(this.uPhase, this.flowPhase);
        gl.uniform1f(this.uTime, this.time);
        gl.uniform1f(this.uFill, fillNorm);
        gl.uniform1f(this.uWhiteBlend, whiteBlend);
        gl.uniform1f(this.uDensity, density);
        gl.uniform1f(this.uIgnite, state.ignite);
        gl.uniform3fv(this.uColLeft, colLeft);
        gl.uniform3fv(this.uColMid, colMid);
        gl.uniform3fv(this.uColRight, colRight);
        gl.uniform3fv(this.uCrestLeft, crestLeft);
        gl.uniform3fv(this.uCrestRight, crestRight);
        gl.uniform1f(this.uIsDarkInk, isDarkInk);
        gl.uniform1f(this.uIsCosmos, isCosmos);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (this.ctx2d) {
        const activeTheme = COLOR_THEMES[state.gearColors[GEARS[state.targetIndex].id]] || COLOR_THEMES.red;
        this.renderCanvas2DFallback(fillNorm, 1 - activeTheme.isWhiteMode, flowSpeed, activeTheme);
      }
    }

    renderCanvas2DFallback(fillNorm, topBlend, flowSpeed, theme) {
      const ctx = this.ctx2d;
      const w = this.width;
      const h = this.height;
      const pitch = 2.5;
      const cols = Math.ceil(w / pitch);
      const rows = Math.ceil(h / pitch);
      const fillEndPx = fillNorm * w;

      ctx.save();
      ctx.scale(this.dpr, this.dpr);
      ctx.clearRect(0, 0, w, h);

      if (topBlend > 0.5 && theme.isDarkInk > 0.5) {
        ctx.fillStyle = 'rgba(210, 216, 226, 0.92)';
        ctx.fillRect(0, 0, fillEndPx, h);
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * pitch + 0.25;
          const py = r * pitch + 0.25;
          if (px > fillEndPx + 2) continue;

          const seed = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
          const rand = seed - Math.floor(seed);
          const wave = 0.5 + 0.5 * Math.sin(c * 0.25 - this.time * 2.2 * flowSpeed + r * 0.4);
          const twinkle = Math.pow(0.5 + 0.5 * Math.sin(this.time * (5 + rand * 9) + rand * 6.28), 2.8);
          const alpha = Math.min(1, 0.42 + wave * 0.35 + twinkle * 0.28);

          if (topBlend > 0.05) {
            const xGrad = Math.max(0, Math.min(1, px / w));
            const rr = Math.round(255 * (theme.colLeft[0] * (1 - xGrad) + theme.colRight[0] * xGrad));
            const gg = Math.round(255 * (theme.colLeft[1] * (1 - xGrad) + theme.colRight[1] * xGrad));
            const bb = Math.round(255 * (theme.colLeft[2] * (1 - xGrad) + theme.colRight[2] * xGrad));
            ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${alpha.toFixed(3)})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
          }
          ctx.fillRect(px, py, 2, 2);
        }
      }
      ctx.restore();
    }

    destroy() {
      this.running = false;
    }
  }

  // 全局右键配色菜单管理
  let activeMenuEl = null;
  function closeColorContextMenu() {
    if (activeMenuEl && activeMenuEl.parentNode) {
      activeMenuEl.parentNode.removeChild(activeMenuEl);
    }
    activeMenuEl = null;
  }

  function openColorContextMenu(clientX, clientY, gearObj, currentColorId, onSelectColor, onResetDefault) {
    closeColorContextMenu();

    const menu = document.createElement('div');
    menu.className = 'ag-gear-ctx-menu';

    const title = document.createElement('div');
    title.className = 'ag-gear-ctx-title';
    title.textContent = `${gearObj.label} 档流体颜色`;
    menu.appendChild(title);

    const defColorId = DEFAULT_GEAR_COLORS[gearObj.id];

    COLOR_ORDER.forEach((cid) => {
      const theme = COLOR_THEMES[cid];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ag-gear-ctx-item' + (cid === currentColorId ? ' is-selected' : '');

      const left = document.createElement('span');
      left.className = 'ag-gear-ctx-left';

      const swatch = document.createElement('span');
      swatch.className = 'ag-gear-ctx-swatch';
      swatch.style.background = theme.swatch;
      if (cid === 'black') {
        swatch.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.45)';
      } else if (cid === 'cosmos') {
        swatch.style.boxShadow = '0 0 8px rgba(139, 92, 246, 0.85)';
      } else {
        swatch.style.boxShadow = `0 0 6px ${theme.swatch}`;
      }

      const label = document.createElement('span');
      label.textContent = cid === defColorId ? `${theme.name}（默认）` : theme.name;

      left.appendChild(swatch);
      left.appendChild(label);
      btn.appendChild(left);

      if (cid === currentColorId) {
        const check = document.createElement('span');
        check.className = 'ag-gear-ctx-check';
        check.textContent = '✓';
        btn.appendChild(check);
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectColor(cid);
        closeColorContextMenu();
      });

      menu.appendChild(btn);
    });

    const divider = document.createElement('div');
    divider.style.cssText = 'height:1px;background:rgba(255,255,255,0.08);margin:4px 0;';
    menu.appendChild(divider);

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'ag-gear-ctx-item';
    resetBtn.style.color = 'rgba(255,255,255,0.65)';
    resetBtn.textContent = '恢复各档默认配色';
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onResetDefault();
      closeColorContextMenu();
    });
    menu.appendChild(resetBtn);

    document.body.appendChild(menu);
    activeMenuEl = menu;

    const rect = menu.getBoundingClientRect();
    const x = Math.min(window.innerWidth - rect.width - 8, Math.max(8, clientX));
    const y = Math.min(window.innerHeight - rect.height - 8, Math.max(8, clientY));
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
  }

  document.addEventListener('pointerdown', (e) => {
    if (activeMenuEl && !activeMenuEl.contains(e.target)) {
      closeColorContextMenu();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeColorContextMenu();
  });

  function findComposerContainer(el) {
    let node = el ? el.parentElement : null;
    for (let depth = 0; depth < 10 && node && node !== document.body && node !== document.documentElement; depth++) {
      const editor = node.querySelector('textarea, [contenteditable="true"], [role="textbox"]');
      if (editor) {
        return { composer: node, editor };
      }
      node = node.parentElement;
    }
    return null;
  }

  function setAttrIfDiff(el, name, val) {
    if (el && el.getAttribute(name) !== val) {
      el.setAttribute(name, val);
    }
  }

  function removeAttrIfHas(el, name) {
    if (el && el.hasAttribute(name)) {
      el.removeAttribute(name);
    }
  }

  function expandChatComposerHeight(modelBtn) {
    if (!modelBtn) return;
    setAttrIfDiff(modelBtn, 'data-ag-model-btn', 'true');

    const parent = modelBtn.parentElement;
    if (parent && parent !== document.body) {
      // 仅首次初始化父容器的水平排版模式并永久锁定，绝不因下拉菜单打开（新增子元素）或
      // 读取自身注入后的 computedStyle 而反复切换属性导致掉行和页面抖动！
      if (parent.dataset.agRowInit !== '1') {
        const cs = window.getComputedStyle(parent);
        const isNativeFlexRow =
          (cs.display === 'flex' || cs.display === 'inline-flex') && cs.flexDirection === 'row';
        const nativeFlowSiblings = Array.from(parent.children).filter((c) => {
          if (c.classList.contains('ag-gear-shifter-host')) return false;
          const cPos = window.getComputedStyle(c).position;
          return cPos !== 'absolute' && cPos !== 'fixed';
        });

        if (!isNativeFlexRow || nativeFlowSiblings.length <= 1) {
          setAttrIfDiff(parent, 'data-ag-gear-row', 'true');
          removeAttrIfHas(parent, 'data-ag-gear-row-flex');
        } else {
          setAttrIfDiff(parent, 'data-ag-gear-row-flex', 'true');
          removeAttrIfHas(parent, 'data-ag-gear-row');
        }
        parent.dataset.agRowInit = '1';
      }

      setAttrIfDiff(parent, 'data-ag-expanded-toolbar', 'true');
    }

    const found = findComposerContainer(modelBtn);
    if (found) {
      setAttrIfDiff(found.composer, 'data-ag-expanded-composer', 'true');
      setAttrIfDiff(found.editor, 'data-ag-expanded-editor', 'true');

      // 找到输入框容器内包含底部工具栏的直接子容器，用 margin-top: auto 统一沉底
      let bottomBar = modelBtn;
      while (bottomBar && bottomBar.parentElement && bottomBar.parentElement !== found.composer) {
        bottomBar = bottomBar.parentElement;
      }
      if (bottomBar && bottomBar.parentElement === found.composer && !bottomBar.contains(found.editor)) {
        setAttrIfDiff(bottomBar, 'data-ag-bottom-bar', 'true');
      }
    }
  }

  function parseGearIdExact(raw) {
    const s = String(raw || '')
      .trim()
      .replace(/^[\(\[\s·•\-:]+|[\)\]\s·•\-:]+$/g, '')
      .trim();
    if (!s) return null;
    // 先匹配 extra / xhigh，避免被 high 误吞
    if (/^(?:xhigh|x-high|x\s*high|extra|extra\s*high|max|maximum|ultra|超高|极高|最高)$/i.test(s)) {
      return 'extra';
    }
    if (/^(?:high|高)$/i.test(s)) {
      return 'high';
    }
    if (/^(?:med|medium|standard|balanced|default|normal|中|中等|标准)$/i.test(s)) {
      return 'med';
    }
    if (/^(?:low|minimal|min|低|极速|快速)$/i.test(s)) {
      return 'low';
    }
    return null;
  }

  function parseGearIdFromString(raw) {
    const s = String(raw || '').trim();
    if (!s) return null;
    if (/(?:^|[\s\(\[\-\/·•])(?:xhigh|x-high|x\s+high|extra\s+high|extra|max|maximum|ultra|超高|极高|最高)(?:$|[\s\)\]\-\/·•])/i.test(s)) {
      return 'extra';
    }
    if (/(?:^|[\s\(\[\-\/·•])(?:high|高)(?:$|[\s\)\]\-\/·•])/i.test(s)) {
      return 'high';
    }
    if (/(?:^|[\s\(\[\-\/·•])(?:med|medium|standard|balanced|中|中等)(?:$|[\s\)\]\-\/·•])/i.test(s)) {
      return 'med';
    }
    if (/(?:^|[\s\(\[\-\/·•])(?:low|minimal|低)(?:$|[\s\)\]\-\/·•])/i.test(s)) {
      return 'low';
    }
    return null;
  }

  const GEAR_TRAILING_WORD_REGEX =
    /\s+(?:XHigh|X-High|X\s*High|Extra\s*High|Extra|High|Medium|Med|Low|Minimal|Max|超高|极高|最高|高|中等|中|低)\s*$/i;

  function stripGearTextFromModelButton(modelBtn) {
    if (!modelBtn) return null;
    let detectedGear = null;
    let hidLeafElement = false;

    // 1. 优先扫描按钮内部独立的叶子节点（如 Antigravity 真实 DOM 中的灰色 <span>High</span>），
    //    通过 CSS display:none 隐藏而不破坏 React 文本节点，确保模型/档位变化时仍能双向同步！
    const descendants = modelBtn.querySelectorAll('*');
    for (const child of descendants) {
      if (child instanceof SVGElement || child.closest('svg')) continue;
      if (child.children.length > 0) continue;
      const g = parseGearIdExact(child.textContent);
      if (g) {
        detectedGear = g;
        hidLeafElement = true;
        setAttrIfDiff(child, 'data-ag-hidden-gear-badge', 'true');
      } else if (child.getAttribute('data-ag-hidden-gear-badge') === 'true') {
        removeAttrIfHas(child, 'data-ag-hidden-gear-badge');
      }
    }

    // 2. 检查紧挨在按钮后面的外部独立档位角标
    const nextSib = modelBtn.nextElementSibling;
    if (nextSib && !nextSib.classList.contains('ag-gear-shifter-host')) {
      const sibGear = parseGearIdExact(nextSib.textContent);
      if (sibGear) {
        detectedGear = detectedGear || sibGear;
        setAttrIfDiff(nextSib, 'data-ag-hidden-gear-badge', 'true');
      }
    }

    // 3. 兜底：若模型名和档位在同一段文本节点里（如 "Gemini 4 Neon (XHigh)" 或 "Gemini 4 Neon High"）
    const walker = document.createTreeWalker(modelBtn, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const parentEl = node.parentElement;
      if (parentEl && (parentEl.closest('svg') || parentEl.closest('[data-ag-hidden-gear-badge="true"]'))) {
        continue;
      }
      const txt = node.nodeValue;
      if (!txt || !txt.trim()) continue;

      if (!detectedGear) {
        const g = parseGearIdFromString(txt);
        if (g) detectedGear = g;
      }

      if (GEAR_SUFFIX_REGEX.test(txt)) {
        node.nodeValue = txt.replace(GEAR_SUFFIX_REGEX, '');
      } else if (!hidLeafElement && GEAR_TRAILING_WORD_REGEX.test(txt)) {
        node.nodeValue = txt.replace(GEAR_TRAILING_WORD_REGEX, '');
      }
    }

    return detectedGear;
  }

  function getBaseModelName(modelBtn) {
    if (!modelBtn) return '';
    const parts = [];
    const walker = document.createTreeWalker(modelBtn, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const p = node.parentElement;
      if (p && (p.closest('svg') || p.closest('[data-ag-hidden-gear-badge="true"]'))) continue;
      const t = (node.nodeValue || '').trim();
      if (t) parts.push(t);
    }
    return parts
      .join(' ')
      .replace(GEAR_SUFFIX_REGEX, '')
      .replace(GEAR_TRAILING_WORD_REGEX, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ===== 真实调用 Antigravity 原生模型/档位下拉切换器（支持 Radix / Floating UI / Headless UI / 自定义弹窗）=====
  let stealthSwitchActive = false;
  let pendingSwitchTask = null;

  function sleepMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function fireRealClick(el) {
    if (!el || !el.isConnected) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + Math.max(1, rect.width * 0.5);
    const cy = rect.top + Math.max(1, rect.height * 0.5);
    const common = {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      clientX: cx,
      clientY: cy
    };
    try {
      if (typeof el.focus === 'function') {
        el.focus({ preventScroll: true });
      }
      if (typeof PointerEvent === 'function') {
        el.dispatchEvent(
          new PointerEvent('pointerdown', {
            ...common,
            button: 0,
            buttons: 1,
            pointerId: 1,
            pointerType: 'mouse',
            isPrimary: true
          })
        );
      }
      el.dispatchEvent(new MouseEvent('mousedown', { ...common, button: 0, buttons: 1, detail: 1 }));
      if (typeof PointerEvent === 'function') {
        el.dispatchEvent(
          new PointerEvent('pointerup', {
            ...common,
            button: 0,
            buttons: 0,
            pointerId: 1,
            pointerType: 'mouse',
            isPrimary: true
          })
        );
      }
      el.dispatchEvent(new MouseEvent('mouseup', { ...common, button: 0, buttons: 0, detail: 1 }));
      el.dispatchEvent(new MouseEvent('click', { ...common, button: 0, buttons: 0, detail: 1 }));
    } catch (_) {
      try {
        el.click();
      } catch (__) {}
    }
  }

  function fireRealHover(el) {
    if (!el || !el.isConnected) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + Math.max(1, rect.width * 0.5);
    const cy = rect.top + Math.max(1, rect.height * 0.5);
    const common = {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      clientX: cx,
      clientY: cy
    };
    try {
      if (typeof PointerEvent === 'function') {
        el.dispatchEvent(new PointerEvent('pointerover', { ...common, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
        el.dispatchEvent(
          new PointerEvent('pointerenter', { ...common, bubbles: false, pointerId: 1, pointerType: 'mouse', isPrimary: true })
        );
        el.dispatchEvent(new PointerEvent('pointermove', { ...common, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
      }
      el.dispatchEvent(new MouseEvent('mouseover', common));
      el.dispatchEvent(new MouseEvent('mouseenter', { ...common, bubbles: false }));
      el.dispatchEvent(new MouseEvent('mousemove', common));
    } catch (_) {}
  }

  function fireEscapeKey() {
    const evInit = {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true,
      composed: true
    };
    try {
      (document.activeElement || document.body).dispatchEvent(new KeyboardEvent('keydown', evInit));
      document.dispatchEvent(new KeyboardEvent('keydown', evInit));
    } catch (_) {}
  }

  function getElementTextSegments(el) {
    const segs = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let n;
    while ((n = walker.nextNode())) {
      const p = n.parentElement;
      if (p && p.closest('svg')) continue;
      const t = (n.nodeValue || '').trim();
      if (t) segs.push(t);
    }
    return segs;
  }

  function getDomDepth(el) {
    let d = 0;
    let cur = el;
    while (cur && cur.parentElement) {
      d++;
      cur = cur.parentElement;
    }
    return d;
  }

  function isVisibleRect(el) {
    if (!el || !el.isConnected) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return false;
    const cs = window.getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }

  const POPOVER_SELECTOR =
    '[role="menu"], [role="listbox"], [role="dialog"], [data-radix-popper-content-wrapper], [data-floating-ui-portal], [data-headlessui-state="open"], [data-state="open"]';

  function collectClickableItems(roots, modelBtn) {
    const result = [];
    const seen = new Set();

    const addIfValid = (el) => {
      if (!el || seen.has(el) || !el.isConnected) return;
      if (el === modelBtn || el.contains(modelBtn) || modelBtn.contains(el)) return;
      if (el.closest('.ag-gear-shifter-host, .ag-gear-ctx-menu')) return;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      if (!isVisibleRect(el)) return;
      seen.add(el);
      result.push(el);
    };

    const interactiveSel =
      'button, [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"], [role="radio"], [role="tab"], a, li, [tabindex]';

    for (const root of roots) {
      if (!root || !root.isConnected) continue;
      if (root.matches && root.matches(interactiveSel)) addIfValid(root);
      const interactive = root.querySelectorAll(interactiveSel);
      for (const el of interactive) addIfValid(el);

      // 兼容无 ARIA role 的自定义 Tailwind div/span 选项（仅采集最外层 cursor: pointer 节点，
      // 严禁采集从父行继承 cursor: pointer 的内部 <span>Medium</span>，避免误点其他模型行！）
      const extras = root.querySelectorAll('div, span');
      for (const el of extras) {
        if (seen.has(el)) continue;
        if (el.children.length > 8) continue;
        if (el.closest(interactiveSel)) continue;
        if (!isVisibleRect(el)) continue;
        const cs = window.getComputedStyle(el);
        if (cs.cursor === 'pointer') {
          const parentCs = el.parentElement ? window.getComputedStyle(el.parentElement) : null;
          if (parentCs && parentCs.cursor === 'pointer') continue;
          addIfValid(el);
        }
      }
    }
    return result;
  }

  function itemContainsMultipleGears(el) {
    const distinct = new Set();
    const leaves = el.querySelectorAll('button, [role="menuitem"], [role="option"], [role="radio"], [role="tab"], span, div');
    for (const leaf of leaves) {
      if (leaf.children.length > 0) continue;
      const g = parseGearIdExact(leaf.textContent);
      if (g) distinct.add(g);
      if (distinct.size >= 2) return true;
    }
    return false;
  }

  function getItemExactGear(el) {
    const attrGear = parseGearIdExact(
      el.getAttribute('data-effort') ||
        el.getAttribute('data-thinking-level') ||
        el.getAttribute('data-gear') ||
        el.getAttribute('data-value') ||
        ''
    );
    if (attrGear) return attrGear;

    const ariaGear = parseGearIdExact(el.getAttribute('aria-label') || '');
    if (ariaGear) return ariaGear;

    const segs = getElementTextSegments(el);
    if (segs.length === 0) return null;
    // 完整文案直接匹配（如 "High" / "XHigh" / "Medium" / "Low"）
    const fullExact = parseGearIdExact(segs.join(' '));
    if (fullExact) return fullExact;
    // 首行主标题精确匹配（兼容带副标题说明的选项，如 ["High", "Deep reasoning..."]）
    if (segs.length <= 4) {
      const firstExact = parseGearIdExact(segs[0]);
      if (firstExact) return firstExact;
    }
    return null;
  }

  function findTargetOptionInItems(items, baseModelName, targetGearId) {
    const baseNorm = (baseModelName || '').toLowerCase().replace(/\s+/g, ' ').trim();
    const pickDeepest = (list) => {
      if (!list.length) return null;
      list.sort((a, b) => getDomDepth(b) - getDomDepth(a));
      return list[0];
    };

    // 策略 1a：当前模型行内的独立档位按钮（如行内 [Low] [Med] [High] [XHigh] 药丸按钮）
    if (baseNorm) {
      const inlineMatches = [];
      for (const el of items) {
        if (itemContainsMultipleGears(el)) continue;
        if (getItemExactGear(el) !== targetGearId) continue;
        // 向上查找最多 4 层，看是否处于当前模型的行容器中
        let anc = el.parentElement;
        for (let i = 0; i < 4 && anc && anc !== document.body; i++) {
          const ancText = getElementTextSegments(anc).join(' ').toLowerCase();
          if (ancText.includes(baseNorm) && ancText.length < 260) {
            inlineMatches.push(el);
            break;
          }
          anc = anc.parentElement;
        }
      }
      if (inlineMatches.length) return pickDeepest(inlineMatches);
    }

    // 策略 1b：合并模型+档位行（如 "Gemini 4 Neon XHigh" 或 "Gemini 4 Neon (High)"）
    if (baseNorm) {
      const combinedMatches = [];
      for (const el of items) {
        if (itemContainsMultipleGears(el)) continue;
        const segs = getElementTextSegments(el);
        if (!segs.length) continue;
        const joined = segs.join(' ');
        const joinedLower = joined.toLowerCase();
        if (!joinedLower.includes(baseNorm)) continue;
        if (joined.length > 180) continue;

        // 先检查是否有独立叶子段精确匹配目标档位
        let matchedGear = null;
        for (const seg of segs) {
          const exact = parseGearIdExact(seg);
          if (exact) {
            matchedGear = exact;
            break;
          }
        }
        // 再去掉模型名后匹配剩余部分中的档位词
        if (!matchedGear) {
          const remainder = joinedLower.replace(baseNorm, ' ').trim();
          matchedGear = parseGearIdFromString(remainder);
        }
        if (matchedGear === targetGearId) {
          combinedMatches.push(el);
        }
      }
      if (combinedMatches.length) return pickDeepest(combinedMatches);
    }

    // 策略 2：弹窗中的独立档位选项（例如顶部/底部的 Effort 切换栏，或纯档位菜单）
    const exactMatches = [];
    for (const el of items) {
      if (itemContainsMultipleGears(el)) continue;
      if (getItemExactGear(el) === targetGearId) {
        exactMatches.push(el);
      }
    }
    if (exactMatches.length) return pickDeepest(exactMatches);

    return null;
  }

  function findModelRowInItems(items, baseModelName) {
    const baseNorm = (baseModelName || '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (!baseNorm) return null;
    const candidates = [];
    for (const el of items) {
      if (el.querySelectorAll('button, [role="menuitem"], [role="option"]').length >= 2) continue;
      const segs = getElementTextSegments(el);
      if (!segs.length) continue;
      const joined = segs.join(' ');
      const lower = joined.toLowerCase();
      if (!lower.includes(baseNorm)) continue;
      if (joined.length > 160) continue;
      const isMenuItem = el.matches('button, [role="menuitem"], [role="menuitemradio"], [role="option"]');
      candidates.push({ el, isMenuItem, depth: getDomDepth(el) });
    }
    if (!candidates.length) return null;
    // Radix SubTrigger 的 hover/pointermove 绑定在行级 menuitem/button（较浅层级）上
    candidates.sort((a, b) => Number(b.isMenuItem) - Number(a.isMenuItem) || a.depth - b.depth);
    return candidates[0].el;
  }

  function fireArrowRight(el) {
    if (!el || !el.isConnected) return;
    try {
      if (typeof el.focus === 'function') el.focus({ preventScroll: true });
      el.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          code: 'ArrowRight',
          keyCode: 39,
          which: 39,
          bubbles: true,
          cancelable: true,
          composed: true
        })
      );
    } catch (_) {}
  }

  async function switchRealAntigravityGear(modelBtn, gearObj) {
    if (!modelBtn || !modelBtn.isConnected) {
      return { ok: false, popoverOpened: false };
    }

    if (stealthSwitchActive) {
      return new Promise((resolve) => {
        pendingSwitchTask = { modelBtn, gearObj, resolve };
      });
    }

    stealthSwitchActive = true;
    const baseModelName = getBaseModelName(modelBtn);
    const beforePopovers = new Set(
      Array.from(document.querySelectorAll(POPOVER_SELECTOR)).filter((el) => isVisibleRect(el))
    );
    const addedRoots = new Set();

    const tempObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          for (const node of m.addedNodes) {
            if (node.nodeType !== 1) continue;
            if (node === modelBtn || node.contains(modelBtn) || modelBtn.contains(node)) continue;
            if (node.closest && node.closest('.ag-gear-shifter-host, .ag-gear-ctx-menu')) continue;
            addedRoots.add(node);
            if (node.setAttribute) node.setAttribute('data-ag-stealth-popover', 'true');
          }
        } else if (m.type === 'attributes' && m.target && m.target.nodeType === 1) {
          const t = m.target;
          if (t === modelBtn || t.contains(modelBtn) || modelBtn.contains(t)) continue;
          if (t.closest && t.closest('.ag-gear-shifter-host, .ag-gear-ctx-menu')) continue;
          if (isVisibleRect(t) && (t.matches(POPOVER_SELECTOR) || t.querySelector('button, [role="menuitem"], [role="option"]'))) {
            addedRoots.add(t);
            t.setAttribute('data-ag-stealth-popover', 'true');
          }
        }
      }
    });

    const getActivePopoverRoots = () => {
      const roots = new Set();
      for (const r of addedRoots) {
        if (r && r.isConnected && isVisibleRect(r)) roots.add(r);
      }
      for (const el of document.querySelectorAll(POPOVER_SELECTOR)) {
        if (beforePopovers.has(el)) continue;
        if (el === modelBtn || el.contains(modelBtn) || modelBtn.contains(el)) continue;
        if (el.closest('.ag-gear-shifter-host, .ag-gear-ctx-menu')) continue;
        if (isVisibleRect(el)) {
          el.setAttribute('data-ag-stealth-popover', 'true');
          roots.add(el);
        }
      }
      return Array.from(roots);
    };

    let matched = false;
    let popoverOpened = false;

    try {
      document.documentElement.classList.add('ag-gear-stealth-switching');
      tempObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden', 'data-state', 'aria-hidden']
      });

      // 1. 以真实鼠标指针序列打开 Antigravity 原生模型/档位下拉菜单
      if (modelBtn.getAttribute('aria-expanded') !== 'true') {
        fireRealClick(modelBtn);
      }

      let activeRoots = [];
      let items = [];
      let targetEl = null;

      for (let t = 0; t < 16; t++) {
        await sleepMs(20);
        activeRoots = getActivePopoverRoots();
        if (activeRoots.length > 0) {
          popoverOpened = true;
          items = collectClickableItems(activeRoots, modelBtn);
          targetEl = findTargetOptionInItems(items, baseModelName, gearObj.id);
          if (targetEl) break;
          // 等多一帧让异步子菜单/列表项渲染完整
          if (items.length > 0 && t >= 4) break;
        }
      }

      // 2. 若一级菜单展示的是模型列表（如 Antigravity 的 "Gemini 4 Neon High ✓" 级联菜单），
      //    悬停/右箭头/点击当前模型行展开二级档位子菜单，并严格只在新增的子菜单项中匹配目标档位
      if (!targetEl && popoverOpened && items.length > 0) {
        const level1Items = new Set(items);
        const modelRow = findModelRowInItems(items, baseModelName);
        if (modelRow) {
          const searchSubmenu = () => {
            activeRoots = getActivePopoverRoots();
            const allNow = collectClickableItems(activeRoots, modelBtn);
            const subItems = allNow.filter((it) => !level1Items.has(it));
            if (subItems.length > 0) {
              const hit = findTargetOptionInItems(subItems, baseModelName, gearObj.id);
              if (hit) return hit;
            }
            return null;
          };

          // 2a. 悬停展开（兼容 Radix SubTrigger / Floating UI 150~250ms 悬停延迟）
          fireRealHover(modelRow);
          for (let t = 0; t < 18; t++) {
            await sleepMs(20);
            if (t === 2 || t === 5) fireRealHover(modelRow);
            targetEl = searchSubmenu();
            if (targetEl) break;
          }

          // 2b. 兜底：键盘 ArrowRight 展开级联子菜单
          if (!targetEl) {
            fireArrowRight(modelRow);
            for (let t = 0; t < 8; t++) {
              await sleepMs(20);
              targetEl = searchSubmenu();
              if (targetEl) break;
            }
          }

          // 2c. 兜底：点击模型行展开二级面板
          if (!targetEl) {
            fireRealClick(modelRow);
            for (let t = 0; t < 9; t++) {
              await sleepMs(20);
              targetEl = searchSubmenu();
              if (targetEl) break;
            }
          }
        }
      }

      // 3. 命中真实选项 -> 模拟真实点击切换！
      if (targetEl) {
        fireRealClick(targetEl);
        matched = true;
        await sleepMs(65);
        // 若是不会自动关闭的 Popover 面板，补发一次 Escape 收起
        const stillOpen = getActivePopoverRoots();
        if (stillOpen.length > 0) {
          fireEscapeKey();
          await sleepMs(35);
        }
      } else if (popoverOpened) {
        console.warn(
          '[ag-gear-shifter] 已打开模型菜单，但当前模型未找到对应档位:',
          { baseModelName, targetGear: gearObj.id, seenItems: items.slice(0, 20).map((i) => getElementTextSegments(i).join(' ')) }
        );
        fireEscapeKey();
        await sleepMs(35);
        if (modelBtn.getAttribute('aria-expanded') === 'true') {
          fireRealClick(modelBtn);
        }
      }
    } finally {
      tempObserver.disconnect();
      document.querySelectorAll('[data-ag-stealth-popover="true"]').forEach((el) => {
        el.removeAttribute('data-ag-stealth-popover');
      });
      document.documentElement.classList.remove('ag-gear-stealth-switching');
      stealthSwitchActive = false;

      // 立刻重新隐藏更新后的档位文本（保证按钮只显示干净的模型名）
      if (modelBtn && modelBtn.isConnected) {
        stripGearTextFromModelButton(modelBtn);
      }

      // 若切换期间用户再次拖动了档位，立即执行最新一次排队请求
      if (pendingSwitchTask) {
        const nextTask = pendingSwitchTask;
        pendingSwitchTask = null;
        switchRealAntigravityGear(nextTask.modelBtn, nextTask.gearObj).then(nextTask.resolve);
      }
    }

    return { ok: matched, popoverOpened };
  }

  function syncAntigravityGear(gearObj, modelBtn, onResult) {
    try {
      localStorage.setItem(STORAGE_KEY, gearObj.id);
    } catch (_) {}

    window.dispatchEvent(
      new CustomEvent('antigravity:gear-change', {
        detail: {
          gear: gearObj.id,
          label: gearObj.label,
          fullName: gearObj.fullName,
          isTopGear: gearObj.isTop,
          promptTag: gearObj.promptTag
        }
      })
    );

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'antigravity-set-effort-gear',
          payload: {
            gear: gearObj.id,
            fullName: gearObj.fullName,
            promptTag: gearObj.promptTag
          }
        },
        '*'
      );
    }

    // 优先直接驱动真实的 Antigravity 模型档位下拉菜单
    if (modelBtn && modelBtn.isConnected) {
      switchRealAntigravityGear(modelBtn, gearObj).then((res) => {
        if (typeof onResult === 'function') onResult(res);
      });
      return;
    }

    // 无 modelBtn 时的页面内属性控件兜底
    const targets = [gearObj.id, gearObj.fullName.toLowerCase(), ...(gearObj.aliases || [])];
    const effortSelectors = document.querySelectorAll(
      '[data-effort], [data-thinking-level], [aria-label*="Effort" i], [aria-label*="Thinking" i]'
    );
    effortSelectors.forEach((el) => {
      if (el.closest('.ag-gear-shifter-host')) return;
      const val = (
        el.getAttribute('data-effort') ||
        el.getAttribute('data-thinking-level') ||
        el.textContent ||
        ''
      )
        .trim()
        .toLowerCase();
      if (targets.includes(val)) {
        fireRealClick(el);
      }
    });
  }

  function createGearShifterElement(initialGearId = null, modelBtn = null) {
    injectStyles();

    const host = document.createElement('div');
    host.className = 'ag-gear-shifter-host';
    host.setAttribute('data-testid', 'ag-fluid-gear-shifter');

    const capsule = document.createElement('div');
    capsule.className = 'ag-gear-capsule';
    capsule.setAttribute('role', 'slider');
    capsule.setAttribute('aria-label', 'Antigravity Effort Gear Shifter');
    capsule.setAttribute('aria-valuemin', '0');
    capsule.setAttribute('aria-valuemax', '3');
    capsule.setAttribute('tabindex', '0');

    const canvas = document.createElement('canvas');
    canvas.className = 'ag-gear-canvas';

    const stopsWrap = document.createElement('div');
    stopsWrap.className = 'ag-gear-stops';
    const stopDots = GEARS.map((g, idx) => {
      const dot = document.createElement('span');
      dot.className = 'ag-gear-stop-dot';
      const pct = idx === 0 ? 5 : idx === 1 ? 37 : idx === 2 ? 66 : 95;
      dot.style.left = `${pct}%`;
      stopsWrap.appendChild(dot);
      return dot;
    });

    const thumbPill = document.createElement('div');
    thumbPill.className = 'ag-gear-thumb-pill';

    capsule.appendChild(canvas);
    capsule.appendChild(stopsWrap);
    capsule.appendChild(thumbPill);

    const extLabelsWrap = document.createElement('div');
    extLabelsWrap.className = 'ag-gear-external-labels';

    const labelEls = GEARS.map((g, idx) => {
      const item = document.createElement('span');
      item.className = 'ag-gear-ext-label';
      item.setAttribute('data-gear-id', g.id);
      item.setAttribute('data-idx', String(idx));
      item.textContent = g.label;
      extLabelsWrap.appendChild(item);
      return item;
    });

    host.appendChild(capsule);
    host.appendChild(extLabelsWrap);

    // 真实读取到的模型当前档位永远优先于 localStorage 缓存，避免显示与实际档位脱节
    let savedId = initialGearId;
    let savedGearColors = { ...DEFAULT_GEAR_COLORS };
    try {
      if (!savedId) {
        savedId = localStorage.getItem(STORAGE_KEY) || 'high';
      }
      const rawMap = localStorage.getItem(COLOR_STORAGE_KEY);
      if (rawMap) {
        const parsed = JSON.parse(rawMap);
        if (parsed && typeof parsed === 'object') {
          Object.keys(DEFAULT_GEAR_COLORS).forEach((gid) => {
            if (parsed[gid] && COLOR_THEMES[parsed[gid]]) {
              savedGearColors[gid] = parsed[gid];
            }
          });
        }
      }
    } catch (_) {
      if (!savedId) savedId = 'high';
    }

    let activeIndex = Math.max(
      0,
      GEARS.findIndex((g) => g.id === savedId)
    );

    const state = {
      pos: GEARS[activeIndex].norm,
      targetPos: GEARS[activeIndex].norm,
      targetIndex: activeIndex,
      dragging: false,
      velocity: 0,
      ignite: 0.3,
      gearColors: savedGearColors
    };

    let boundModelBtn = modelBtn;
    const engine = new ClaudeFluidGridEngine(canvas, () => state);

    function applyThemeStyles(index) {
      const gid = GEARS[index].id;
      const cid = state.gearColors[gid] || DEFAULT_GEAR_COLORS[gid];
      const theme = COLOR_THEMES[cid] || COLOR_THEMES.white;
      const isColored = cid !== 'white';

      if (isColored) {
        capsule.style.borderColor = theme.border;
        capsule.style.boxShadow = `inset 0 1px 3px rgba(0, 0, 0, 0.9), 0 0 14px ${theme.glow}`;
        thumbPill.style.background = theme.thumbBg;
        thumbPill.style.borderColor = theme.thumbBorder;
        thumbPill.style.boxShadow = theme.thumbShadow;
        thumbPill.style.setProperty('--ag-thumb-core', theme.thumbCore);
      } else {
        capsule.style.borderColor = '';
        capsule.style.boxShadow = '';
        thumbPill.style.background = '';
        thumbPill.style.borderColor = '';
        thumbPill.style.boxShadow = '';
        thumbPill.style.removeProperty('--ag-thumb-core');
      }

      labelEls.forEach((el, idx) => {
        el.classList.toggle('is-active', idx === index);
        el.classList.toggle('is-passed', idx < index);
        if (isColored && idx <= index) {
          const stepPos = index === 0 ? 3 : Math.round((idx / index) * 3);
          el.style.color = theme.labels[stepPos];
          el.style.textShadow = idx === index ? `0 0 10px ${theme.glow}` : '';
        } else {
          el.style.color = '';
          el.style.textShadow = '';
        }
      });
    }

    function updateUI(index, normPos) {
      const g = GEARS[index];
      const cid = state.gearColors[g.id] || DEFAULT_GEAR_COLORS[g.id];
      const theme = COLOR_THEMES[cid] || COLOR_THEMES.white;
      host.setAttribute('data-gear', g.id);
      capsule.setAttribute('data-gear', g.id);
      capsule.classList.toggle('is-dragging', state.dragging);
      capsule.setAttribute('aria-valuenow', String(index));
      capsule.setAttribute('aria-valuetext', `${g.label} - ${g.desc}`);
      capsule.title = `反重力算力挡位: ${g.label} | 配色: ${theme.name}（左右拖动切换真实档位 · 右键换色）`;

      applyThemeStyles(index);

      stopDots.forEach((dot, idx) => {
        dot.classList.toggle('is-covered', idx / 3 <= normPos + 0.04);
      });

      const trackW = capsule.clientWidth || 176;
      const thumbW = 9;
      const travel = trackW - thumbW - 4;
      const leftPx = 2 + Math.max(0, Math.min(1, normPos)) * travel;
      thumbPill.style.transform = `translateX(${leftPx.toFixed(1)}px)`;
    }

    // 右键菜单切换当前档位配色（支持红/黑/紫/蓝/绿/宇宙色/白及一键恢复默认）
    host.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const curGear = GEARS[state.targetIndex];
      const curCid = state.gearColors[curGear.id] || DEFAULT_GEAR_COLORS[curGear.id];
      openColorContextMenu(
        e.clientX,
        e.clientY,
        curGear,
        curCid,
        (newColorId) => {
          state.gearColors[curGear.id] = newColorId;
          try {
            localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(state.gearColors));
          } catch (_) {}
          updateUI(state.targetIndex, state.pos);
        },
        () => {
          state.gearColors = { ...DEFAULT_GEAR_COLORS };
          try {
            localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(state.gearColors));
          } catch (_) {}
          updateUI(state.targetIndex, state.pos);
        }
      );
    });

    const STIFFNESS = 520;
    const DAMPING = 38;
    const SUBSTEP = 0.006;
    let lastPhysTs = performance.now();
    let accum = 0;

    function animatePhysics(now) {
      const dt = Math.min(0.06, Math.max(0.001, (now - lastPhysTs) * 0.001));
      lastPhysTs = now;

      if (state.dragging || Math.abs(state.velocity) > 0.05) {
        state.ignite = Math.min(1.0, state.ignite + dt / 0.45);
      } else {
        state.ignite = Math.max(0.0, state.ignite - dt / 0.85);
      }

      if (!state.dragging) {
        accum += dt;
        while (accum >= SUBSTEP) {
          const force = -STIFFNESS * (state.pos - state.targetPos) - DAMPING * state.velocity;
          state.velocity += force * SUBSTEP;
          state.pos += state.velocity * SUBSTEP;
          accum -= SUBSTEP;
        }
        if (Math.abs(state.targetPos - state.pos) < 0.0005 && Math.abs(state.velocity) < 0.002) {
          state.pos = state.targetPos;
          state.velocity = 0;
        }
        updateUI(state.targetIndex, state.pos);
      }
      requestAnimationFrame(animatePhysics);
    }
    requestAnimationFrame(animatePhysics);

    function selectGearByIndex(newIndex, triggerSync = true, forceSync = false) {
      const clamped = Math.max(0, Math.min(GEARS.length - 1, newIndex));
      const changed = clamped !== state.targetIndex;
      state.targetIndex = clamped;
      state.targetPos = GEARS[clamped].norm;
      activeIndex = clamped;
      state.ignite = 1.0;
      updateUI(clamped, state.pos);
      if ((changed || forceSync) && triggerSync) {
        syncAntigravityGear(GEARS[clamped], boundModelBtn, (res) => {
          // 若真实打开了下拉菜单但当前模型确实不支持该档位，则回弹到真实档位，避免“假切档”
          if (res && res.popoverOpened && !res.ok && boundModelBtn && boundModelBtn.isConnected) {
            const actualGear = stripGearTextFromModelButton(boundModelBtn);
            if (actualGear && actualGear !== GEARS[clamped].id) {
              const actualIdx = GEARS.findIndex((g) => g.id === actualGear);
              if (actualIdx >= 0) {
                selectGearByIndex(actualIdx, false);
              }
            }
          }
        });
      }
    }

    labelEls.forEach((el, idx) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectGearByIndex(idx, true, true);
      });
    });

    function pointerXToNorm(clientX) {
      const rect = capsule.getBoundingClientRect();
      const pad = 9;
      return Math.max(0, Math.min(1, (clientX - (rect.left + pad)) / Math.max(1, rect.width - pad * 2)));
    }

    let dragStartIndex = activeIndex;

    capsule.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.preventDefault();
      e.stopPropagation();
      closeColorContextMenu();
      capsule.setPointerCapture(e.pointerId);
      state.dragging = true;
      state.ignite = 1.0;
      dragStartIndex = state.targetIndex;

      const norm = pointerXToNorm(e.clientX);
      state.targetPos = norm;
      state.pos = norm;
      state.velocity = 0;
      const nearestIdx = Math.round(norm * 3);
      state.targetIndex = nearestIdx;
      updateUI(nearestIdx, state.pos);
    });

    capsule.addEventListener('pointermove', (e) => {
      if (!state.dragging) return;
      e.preventDefault();
      const norm = pointerXToNorm(e.clientX);
      state.velocity = (norm - state.pos) * 18;
      state.pos = norm;
      state.targetPos = norm;

      const nearestIdx = Math.round(norm * 3);
      if (nearestIdx !== state.targetIndex) {
        state.targetIndex = nearestIdx;
        state.ignite = 1.0;
      }
      updateUI(nearestIdx, state.pos);
    });

    const endDrag = (e) => {
      if (!state.dragging) return;
      state.dragging = false;
      try {
        capsule.releasePointerCapture(e.pointerId);
      } catch (_) {}
      const finalIdx = Math.round(state.pos * 3);
      // 单次触发真实切换（避免之前 selectGearByIndex + syncAntigravityGear 重复调用两次！）
      const shouldSync = finalIdx !== dragStartIndex || finalIdx !== activeIndex;
      selectGearByIndex(finalIdx, shouldSync, shouldSync);
    };

    capsule.addEventListener('pointerup', endDrag);
    capsule.addEventListener('pointercancel', endDrag);

    capsule.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        selectGearByIndex(state.targetIndex + 1, true, true);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        selectGearByIndex(state.targetIndex - 1, true, true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        selectGearByIndex(0, true, true);
      } else if (e.key === 'End') {
        e.preventDefault();
        selectGearByIndex(GEARS.length - 1, true, true);
      }
    });

    requestAnimationFrame(() => {
      engine.resize();
      updateUI(activeIndex, state.pos);
    });

    host._bindModelButton = (btn) => {
      boundModelBtn = btn;
    };

    host._isUserInteracting = () => state.dragging || stealthSwitchActive;

    host._getCurrentGearId = () => GEARS[state.targetIndex].id;

    host._setGear = (id) => {
      const idx = GEARS.findIndex((g) => g.id === id);
      if (idx >= 0) selectGearByIndex(idx, false);
    };

    host._setColor = (cid, gearId) => {
      const targetGid = gearId || GEARS[state.targetIndex].id;
      if (COLOR_THEMES[cid] && state.gearColors[targetGid] !== undefined) {
        state.gearColors[targetGid] = cid;
        updateUI(state.targetIndex, state.pos);
      }
    };

    return host;
  }

  function isInsideFloatingOverlay(el) {
    let cur = el;
    for (let depth = 0; depth < 8 && cur && cur !== document.body; depth++) {
      const pos = window.getComputedStyle(cur).position;
      if (pos === 'fixed' || pos === 'absolute') {
        const rect = cur.getBoundingClientRect();
        // 排除小图标，识别弹出的菜单浮层
        if (rect.height > 120 && rect.width > 160) return true;
      }
      cur = cur.parentElement;
    }
    return false;
  }

  function findAndMountGearShifter() {
    if (stealthSwitchActive) return;

    const candidates = Array.from(
      document.querySelectorAll(
        'button, [role="button"], [role="combobox"], .model-selector, [data-testid*="model" i], [aria-label*="Model" i]'
      )
    );

    for (const el of candidates) {
      // 严禁在下拉菜单、弹窗、选项列表或插件自身内部重复挂载！
      if (
        el.closest(
          '.ag-gear-shifter-host, .ag-gear-ctx-menu, [role="menu"], [role="listbox"], [role="dialog"], [role="menuitem"], [role="option"], [data-radix-popper-content-wrapper], [data-floating-ui-portal], [data-ag-stealth-popover="true"]'
        )
      ) {
        continue;
      }
      if (el.parentElement && el.parentElement.closest('[data-ag-model-btn="true"]')) {
        continue;
      }

      const text = (el.textContent || '').trim();
      const isModelSelector =
        /(?:Gemini|Argon|Neon|Carbon|Hydrogen|Orchestrator|Flash|Pro|Claude|Sonnet|Opus|GPT)/i.test(text) &&
        text.length < 64 &&
        el.children.length < 12;

      if (!isModelSelector) continue;

      // 仅挂载在聊天输入框所在工具栏的模型按钮旁，避免误伤标题栏或聊天消息气泡中的按钮
      const foundComposer = findComposerContainer(el);
      if (!foundComposer) continue;

      // 若该输入框内已经挂载了流体档位条，仅对已绑定的那个模型按钮执行同步，绝不对下拉菜单项重复挂载！
      const existingShifter =
        el.nextElementSibling && el.nextElementSibling.classList.contains('ag-gear-shifter-host')
          ? el.nextElementSibling
          : null;

      if (!existingShifter) {
        if (foundComposer.composer.querySelector('.ag-gear-shifter-host')) continue;
        if (isInsideFloatingOverlay(el)) continue;
      }

      expandChatComposerHeight(el);
      const detectedGear = stripGearTextFromModelButton(el);

      if (existingShifter) {
        if (typeof existingShifter._bindModelButton === 'function') {
          existingShifter._bindModelButton(el);
        }
        // 双向同步：若用户在原生菜单里手动切换了模型/档位，滑轨自动同步过去
        if (
          detectedGear &&
          typeof existingShifter._isUserInteracting === 'function' &&
          !existingShifter._isUserInteracting() &&
          existingShifter._getCurrentGearId() !== detectedGear
        ) {
          existingShifter._setGear(detectedGear);
        }
        continue;
      }

      const shifter = createGearShifterElement(detectedGear, el);
      el.insertAdjacentElement('afterend', shifter);
    }
  }

  function boot() {
    findAndMountGearShifter();
    let scheduled = false;
    const observer = new MutationObserver((mutations) => {
      if (stealthSwitchActive || scheduled) return;
      // 若本次变动全部发生在已打开的下拉菜单或插件自身内部，直接忽略，彻底杜绝悬停菜单时的无谓扫描与抖动
      let relevant = false;
      for (const m of mutations) {
        const t = m.target && m.target.nodeType === 1 ? m.target : m.target && m.target.parentElement;
        if (!t) continue;
        if (
          t.closest(
            '.ag-gear-shifter-host, .ag-gear-ctx-menu, [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper], [data-floating-ui-portal]'
          )
        ) {
          continue;
        }
        relevant = true;
        break;
      }
      if (!relevant) return;

      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        findAndMountGearShifter();
      });
    });
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.AntigravityGearShifter = {
    create: createGearShifterElement,
    mountAll: findAndMountGearShifter,
    GEARS,
    COLOR_THEMES
  };
})();
