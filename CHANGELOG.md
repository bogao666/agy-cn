# 变更日志

## v1.7.1 (2026-11-27)

- 挡位插件更新：默认配色改为 LOW 白 / MED 白 / HIGH 黑 / EXTRA 暗夜紫；紫色主题重做为深色星云质感，右键换色循环顺序调整。
- 颜色本地存储键升级到 v3，避免旧配色覆盖新默认值。
- 额度电池 v1.6 不变。


## v1.7 (2026-11-27)

- 适配并完整验证 Antigravity **v2.35.2**：额度电池 + 汉化、关闭自动更新、流体挡位插件按正确顺序重装均可正常工作。
- 组件内容未变（电池 v1.6 / 挡位 1.0.0 修复版），Release 附件继续提供两份安装包。


## v1.6.1 (2026-11-24)

- 流体挡位插件修复误挂载：在对话输入框里输入 gemini 等内容时，不再把富文本编辑器 / combobox 当成模型选择器。
- 模型按钮识别收紧为「文本以模型族名开头」且长度 < 48，避免误匹配普通文本或附件胶囊。
- 额度电池 v1.6 不变。


## v1.6 (2026-11-24)

- 去掉 Gemini 悬浮明细里的「含 Argon」标注。
- **移除 GPT 白色电池**：顶栏只保留 Claude（橙）与 Gemini（紫）；额度交互与其余汉化不变。


## v1.5 (2026-11-24)

- **Gemini 额度合并**：现在 Neon / Argon / Hydrogen / Flash 共用同一额度池（`remainingFraction` 与重置时间一致）。
  检测到合并时自动隐藏重复的 4Argon 电池，并在 Gemini 悬浮明细里标注「含 Argon」；
  若以后额度重新拆分，两块电池会自动恢复。
- 实测：Claude 14% / GPT 14% / Gemini 89%（含 Argon），与接口一致。


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
