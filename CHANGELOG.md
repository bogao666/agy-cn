# 变更日志

## v1.4 (2026-11-22)

- 修复新版模型归类：`gemini-pro-orchestrator-g1-pro`（显示名 `Orchestrator (Argon)`）不再被塞进 Gemini 桶，Argon 优先按显示名判定。
- Gemini 存在 Neon / Hydrogen / Flash 等多档独立额度，改用「最高剩余」避免被其中一档拉低；Claude / GPT / 4Argon 仍取最低。
- 接口返回 `errorMessage` 或取数异常时，电池显示 `!` 并在悬浮明细里写明原因，不再静默显示 `--`。
- 实测真实数据：Claude 14% / GPT 14% / Gemini 100% / 4Argon 48%，与接口一致。


## v1.3 (2026-11-19)

- 适配 Antigravity **v2.33.0**：补齐新版设置页按钮与文案汉化（Give Feedback、Voice mode、Conversation Steps、Installed MCP Servers、File Access Rules、Model Quota、快捷键命令等约 60 条）。
- 按钮的 `aria-label` / `title` 单独处理：对话行里的「归档 / 置顶 / 更多选项」等按钮也汉化，但对话标题和正文依然不翻译。
- 新增 `N tools enabled` → `已启用 N 个工具` 等正则。
- 保留产品名与模型名（Turbo、MCP、Google Sans、Google Chrome、skill 名）。


## v1.2 (2026-10-24)

- **新增 4Argon（蓝色）独立额度电池**：Gemini 4 Argon 的周额度独立于普通 Gemini，单独显示，悬浮明细含重置时间。
- Gemini 电池归类改为 `/^gemini(?!.*argon)/i`，不再把 Argon 的用量混入 Gemini 最低值。
- 模型归类同时匹配 `modelId` 与显示名 `label`，兼容不同 ID 命名变体。
- 账号 / 套餐里没有某厂商模型时，对应电池自动隐藏（不再常驻显示 `--`）。
- 每次拉数在控制台输出 `[agy-cn] 模型配置：` 清单，便于排查匹配问题。

## v1.1

- 顶栏额度小电池：Claude（橙）/ GPT（白）/ Gemini（紫），共享积分兜底。
- 基础汉化：菜单 / 侧栏 / 输入框 / 设置整页 / 额度提示，字典 + 正则规则。
- 安装器：asar 备份 / 还原 / 状态检查，关闭后台自动更新检查。
