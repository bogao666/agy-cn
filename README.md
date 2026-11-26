# Antigravity 反重力增强套件

[![Version](https://img.shields.io/badge/version-v1.6-4A9EFF)](../../releases)
[![Platform](https://img.shields.io/badge/platform-Windows-blue)](#安装)
[![Antigravity](https://img.shields.io/badge/Antigravity-v2.35.2-A98BFF)](https://antigravity.google)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

给 **Google Antigravity 桌面版** 做界面增强。一个仓库，两个组件：

| 组件 | 作用 | 状态 |
| --- | --- | --- |
| **顶部额度电池** | 标题栏实时显示 Claude / Gemini 剩余额度，顺带做界面汉化 | 当前 v1.6 |
| **流体挡位插件** | 模型选择器右侧的 WebGL2 粒子流体四档调节器（LOW / MED / HIGH / EXTRA） | 1.0.0 |

> 两个组件都会修改 `resources/app.asar` 里的 `dist/preload.js`，**安装顺序很重要**（见下方）。

![额度电池](preview.png)

---

## 组件一：顶部额度电池（agy-cn）

- 顶栏右上角显示 **Claude（橙）** 与 **Gemini（紫）** 两块小电池，填充比例即真实剩余额度，鼠标悬停看明细，点击立刻刷新。
- 数据来自应用自己的 `GetUserStatus` 接口：优先读 `clientModelConfigs[].quotaInfo.remainingFraction`，没有独立模型额度时回退到共享积分。每 60 秒自动刷新，切回窗口也会刷新。
- 官网把 Neon / Argon / Hydrogen / Flash 的额度合并后，组件会**自动隐藏重复的 Argon 电池**；以后额度拆分又会自动恢复。
- GPT 电池已按需求移除。
- 附带**界面汉化**：顶栏菜单、侧栏、输入框、设置页（通用 / 外观 / 快捷键 / 模型 / 自定义 / 浏览器 / 对话 / 反馈 / 账号）、额度提示、常用按钮。对话正文、代码、输入框内容不翻译，产品名与模型名保留英文。
- 安装时会**关闭后台自动更新检查**，避免新版本覆盖补丁；菜单里的手动「检查更新」仍可用。

文件：`inject.js` / `inject.css` / `install.py` / `install.bat` / `restore.bat`。详细变更见 [CHANGELOG.md](CHANGELOG.md)。

## 组件二：流体挡位插件（gear-shifter）

- 打开反重力后自动在**模型选择器右侧**挂载 `176px × 22px` 的四档流体滑轨：`LOW` / `MED` / `HIGH` / `EXTRA`，档位字母外置在轨道下方。
- WebGL2 粒子流体引擎：单向从左向右流动，Domain-Warped 流体基底 + 星芒闪烁；原生弹簧阻尼手感（Stiffness 520 / Damping 38）。
- 默认配色：**白 / 黑 / 紫 / 红**。在滑块上**右键**可为当前档位换色（红 / 黑 / 紫 / 蓝 / 绿 / 宇宙色 / 白），支持恢复默认，自动本地持久化。
- 自动识别并剥离模型按钮原有的 `(Low)` / `(Med)` / `(High)` / `(XHigh)` / `(Extra)` 后缀，并适当增高输入框区域。

完整说明见 [gear-shifter/README.md](gear-shifter/README.md)，独立预览页面 [gear-shifter/preview.html](gear-shifter/preview.html)。

---

## 安装

从 [Releases](../../releases) 下载 `agy-cn-v*.zip` 和 `antigravity-gear-shifter.zip`，分别解压。

> **顺序必须这样**：① 先装额度电池 → ② 再装流体挡位。
> 原因是额度电池的安装器会基于官方 `app.asar` 备份重建 `preload.js`；如果先装挡位再装电池，挡位注入会被冲掉。

```powershell
# 1) 额度电池：解压后双击 install.bat，或
python install.py

# 2) 流体挡位：解压后
powershell -ExecutionPolicy Bypass -File .\install.ps1
# 或零依赖 Node 方式
node patch-asar.mjs install "C:\Users\glb\AppData\Local\Programs\antigravity\resources\app.asar"
```

然后从**托盘完整退出 Antigravity**（关窗口不算）并重新打开。

> 齿轮插件的安装脚本需要 Node.js；电池包自带 Python 安装器，不强依赖 PATH 里的 Python。

## 卸载

按相反顺序操作：

```powershell
# 1) 去掉挡位插件
powershell -ExecutionPolicy Bypass -File .\uninstall.ps1
# 2) 还原电池包（恢复官方 app.asar）
restore.bat   # 或 python install.py --restore
```

`python install.py --check` 可查看电池包版本、补丁状态和自动更新状态。

## 兼容性

- 适配 Windows 桌面版 Antigravity **v2.35.2**（2.33 / 2.25 / 2.24 也验证过）。
- 已在 v2.35.2 上完整重装验证：电池包 + 汉化、关闭自动更新、流体挡位插件均正常。
- 应用自动更新或重装会覆盖 `app.asar`，两个补丁都会失效 —— 重新按上面的顺序跑一次安装即可。
- 本仓库仅修改客户端的 `app.asar`，不碰你的对话记录、工作区和 Google 账号数据。

## 目录

```
README.md                     本说明
inject.js / inject.css        额度电池 + 汉化的注入脚本与样式
install.py / install.bat      电池包安装器（备份 / 补丁 / 关自动更新）
restore.bat                   电池包卸载
preview.png / preview-settings.png  效果预览
CHANGELOG.md                  电池包变更日志
gear-shifter/                 流体挡位插件完整源码与安装脚本
```

MIT License.
