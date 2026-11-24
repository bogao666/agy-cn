# Antigravity 反重力流体挡位插件 (Fluid Gear Shifter)

打开反重力即自动在底部**模型选择器右侧**运行的 WebGL2 粒子流体四档调节插件（`LOW` / `MED` / `HIGH` / `EXTRA`）。

## 最终定版特性

1. **自动增高对话框 + 精密对齐布局**：
   - 自动识别模型选择按钮并剥离原有的 `(Low)` / `(Med)` / `(High)` / `(XHigh)` / `(Extra)` 档位后缀。
   - 自动增高 Antigravity 对话输入框与底部工具栏空间。
   - 流体滑轨采用 **`176px × 22px`** 精巧比例，与模型选择器水平居中齐平，**`LOW / MED / HIGH / EXTRA` 字母外置在滑轨正下方**，轨道内零文字遮挡。
   - 搭配 `9px` **半透明液态玻璃光学游标**与内置微光灯丝，粒子流体穿透可见。
2. **丝滑单向右流 WebGL2 粒子流体引擎（永不倒流）**：
   - **严格单调递增积分相位**：无论如何切换颜色、快速拖动或磁吸回弹，粒子流向 100% 恒定**从左向右**流淌。
   - **Domain-Warped 丝滑流体基底 + 四层无理数尺度随机星芒**：黄金比例行错位 + 非周期双频闪烁 + 随机角度钻石十字星芒，连贯丝滑且闪亮自然。
   - **原生弹簧阻尼手感**：`Stiffness = 520`，`Damping = 38`，`6ms` 固定子步长。
3. **默认四档配色 + 右键自由换色（含「宇宙色」）**：
   - 默认配色：**`LOW` 白色** / **`MED` 黑色** / **`HIGH` 紫色** / **`EXTRA` 红色**（拖动时相邻档位平滑液态变色，每档均为左浅右深渐变）。
   - 在滑块上点击**鼠标右键**，即可为当前档位自由切换：**红色 / 黑色 / 紫色 / 蓝色 / 绿色 / 宇宙色（浩瀚星云与五层多彩繁星海） / 白色**，并支持一键恢复各档默认配色，自动本地持久化记忆。

## 文件清单

- [src/antigravity-gear-shifter.js](./src/antigravity-gear-shifter.js) — 完整自包含核心插件脚本（WebGL2 着色器 + DOM 挂载 + 右键换色）
- [install.ps1](./install.ps1) — Windows 一键注入安装脚本（自动备份原文件）
- [uninstall.ps1](./uninstall.ps1) — 一键卸载与还原脚本
- [preview.html](./preview.html) — 本地独立预览页面
- [plugin.json](./plugin.json) & [rules/AGENTS.md](./rules/AGENTS.md) — Antigravity 插件元信息与四档推理规则

## 安装与还原

一键注入到 Antigravity 客户端（重启后自动在模型选择右侧生效）：

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\glb\.gemini\antigravity\scratch\antigravity-gear-shifter\install.ps1"
```

如需一键恢复原始界面：

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\glb\.gemini\antigravity\scratch\antigravity-gear-shifter\uninstall.ps1"
```
