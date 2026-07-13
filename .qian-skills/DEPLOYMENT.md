# 钱学森 Skills 部署与集成指南

完整的三步集成流程，适用于新项目和已有项目。

---

## 第一步：快速集成（1-2 周）

### 1.1 基础设置

```bash
# 1. 克隆或下载 skills
cd /path/to/your-project
git submodule add https://github.com/JTCAO515/qian-systems-engineering.git .qian-skills

# 2. 初始化核心文档、manifest、handoff 和 Issue 模板
node .qian-skills/scripts/init.js .

# 3. 可选：复制 PR 模板
cp .qian-skills/templates/pr-template.md .github/PULL_REQUEST_TEMPLATE.md
```

### 1.2 填写项目基线

编辑 `docs/governance/composite-engineering-baseline.md`（最关键文件）：

```markdown
# 项目总体设计基线

## 商业目标

- 用户能力 1：[e.g., "用户可预订行程"]
- 用户能力 2：...

## 子系统拓扑

```
商业结果
  ├─ 用户能力：Trip Planning
  │  └─ 子系统：Trip (模块: domain, server, web)
  ├─ 用户能力：Commerce
  │  └─ 子系统：Payment (模块: domain, server, ops)
  ...
```

## 观测指标

| 指标名 | 目标值 | 测量方式 | Owner | 复盘节拍 |
|---|---|---|---|---|
| user_conversion | 20% | 漏斗分析 | Product | 周 |
| trip_completion | 80% | 事件追踪 | Backend | 日 |

## 不变量（红线）

- 支付数据不可逆
- 身份验证无旁路
- 知识来源可追溯
```

### 1.3 定义项目约束

编辑 `docs/constraints/project-constraints.md`：

```markdown
# 项目约束与不变量

## 技术约束

- 使用 TypeScript，类型覆盖 > 90%
- 所有外部 API 调用需要重试与超时处理
- 数据库迁移需要 rollback 脚本

## 商业约束

- 支付功能上线前需通过 PCI 审计
- 用户数据不可以出国
- 合规报告需要月度审核

## 不可变规则

- 任何用户数据删除需要 90 天软删除期
- API 版本变化必须提前 30 天通知客户
- 紧急生产补丁必须 24 小时内补文档和测试

## 依赖与风险

- 依赖第三方支付网关 (Stripe)，故障时降级到离线支付
- 依赖 GPS 定位准确度，城市内 < 100m 误差
```

### 1.4 初始化 Issue 模板

在 `.github/ISSUE_TEMPLATE/standard.md` 中预填：

```markdown
## 上层目标

这个 Issue 服务于哪个用户能力和商业结果？

## 当前观测

- 问题症状
- 测试结果
- 遥测数据

## 预期成果

用户看到什么，系统行为如何改变？

## 接口影响

哪些 schema、router、event、migration 会变化？

## 文档影响

哪些模块说明、约束、runbook 需要同步？

## 验收标准

- [ ] 测试通过 (命令: ...)
- [ ] 文档已更新
- [ ] Code review 通过
- [ ] (可选) 遥测验证

## 工作估算

- XS (≤0.5 天) / S (≤1 天) / M (≤3 天) / L (≤5 天)
```

### 1.5 设置 GitHub Actions (可选但推荐)

```bash
# 当前包不发布预制 workflow 文件；直接创建下面的项目级 workflow。
mkdir -p .github/workflows
```

**示例 `.github/workflows/docs-check.yml`**:

```yaml
name: Docs Check

on:
  pull_request:
    paths:
      - 'docs/**'
      - '**.ts'
      - '**.json'

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run docs:check
      - run: npm run docs:impact -- --base main
```

---

## 第二步：文档即代码（第 2-3 周）

### 2.1 建立 manifest（文档注册表）

`docs/manifest.json` 应记录每份受控文档的元数据：

```json
{
  "docs/governance/composite-engineering-baseline.md": {
    "type": "governance",
    "status": "active",
    "owner": "architecture",
    "summary": "系统总体设计、用户能力树、观测指标",
    "codeMappings": [
      "packages/domain/src/**",
      "apps/server/src/handlers/**"
    ]
  },
  "docs/constraints/project-constraints.md": {
    "type": "constraints",
    "status": "active",
    "owner": "architecture",
    "summary": "技术、商业和不可变规则"
  },
  "docs/architecture/payment-api.md": {
    "type": "interface",
    "status": "active",
    "owner": "payment-team",
    "summary": "支付 API 契约和版本管理",
    "consumers": [
      "apps/web",
      "apps/mobile",
      "apps/ops"
    ]
  }
}
```

### 2.2 建立 handoff（工作状态快照）

`docs/handoff.json` 在每个 PR 合并时更新：

```json
{
  "lastUpdated": "2026-07-13T10:30:00Z",
  "currentPhase": "G3-coding",
  "activeWork": [
    { "id": "#123", "title": "Payment flow redesign", "owner": "alice" },
    { "id": "#125", "title": "Trip completion analytics", "owner": "bob" }
  ],
  "blockers": [
    "Design review pending for Issue #127 (Payment error handling)"
  ],
  "verificationEvidence": {
    "stagingSmokeTest": "passed 2026-07-13 09:15 UTC",
    "productionMetrics": "conversion rate +2% YoY"
  },
  "nextActions": [
    "Merge PR #123 after design review",
    "Deploy to staging and verify payment flow",
    "Complete production rollout by 2026-07-14"
  ],
  "readingOrder": [
    "CONTEXT.md",
    "docs/INDEX.md (auto-generated)",
    ".github/ISSUE_TEMPLATE/standard.md",
    "docs/governance/composite-engineering-baseline.md",
    "docs/architecture/payment-api.md",
    "#123 (current work)"
  ]
}
```

### 2.3 启用 npm 脚本

`package.json`:

```json
{
  "scripts": {
    "docs:impact": "node .qian-skills/scripts/docs-impact.js --project . --base main",
    "docs:check": "node .qian-skills/scripts/docs-check.js --project .",
    "docs:generate-index": "node .qian-skills/scripts/generate-index.js --project .",
    "context:generate": "node .qian-skills/scripts/context-generator.js --project ."
  },
  "devDependencies": {
    "glob": "^10.0.0",
    "json5": "^2.2.3"
  }
}
```

运行：

```bash
npm run docs:check          # 检查文档完整性
npm run docs:impact        # 显示代码→文档映射
npm run docs:generate-index # 生成 docs/INDEX.md
npm run context:generate   # 生成 CONTEXT.md
```

---

## 第三步：完整闭环（第 3-4 周）

### 3.1 偏差分级与控制机制

在 PR 评审时标记偏差等级：

| 等级 | 定义 | 例子 | 动作 |
|---|---|---|---|
| **D0** | 在容差内 | 页面微调、注释改进 | 记录 observation，无需改动 |
| **D1** | 单模块、可逆、接口不变 | 修复本地 bug、优化性能 | 当前 PR 或小 Issue 修正 |
| **D2** | 跨模块、接口/权限变化 | API 字段增删、权限规则改变 | 暂停、架构评审、ADR、contract PR |
| **D3** | 产品定位、总体架构失效 | 支付模型变化、用户路径重设 | 操作者决策、修订基线和 roadmap |

在 PR 中标记：

```markdown
## Deviation Classification

**Deviation Level:** D1

**Rationale:** Single-module fix (payment adapter), no interface change, can be reverted independently.

**Verification:** Test case added; staging smoke test passed.
```

### 3.2 生命周期门禁检查

创建 PR 合并前的检查清单 (`PR_CHECKLIST.md`):

```markdown
# 钱学森 Skills PR 合并检查

## G3 Gate - 代码 + 文档 + 测试完全

- [ ] Issue 字段完整填写
- [ ] 代码变化对应最小充分实现
- [ ] 单元测试通过，覆盖率 > 80%
- [ ] 文档已更新（docs/impact 无失败）
- [ ] 回滚计划存在（如适用）
- [ ] 没有无关重构或清理
- [ ] Deviation 已分级（D0-D3）

## G4 Gate - 验证可复现

- [ ] 所有 acceptance 标准可执行
- [ ] 未检查的项已明确标记（"already tested in staging"）
- [ ] 相关模块owner 已批准
- [ ] 数据迁移脚本（如有）已验证

## 文档同步（自动检查）

- [ ] `pnpm docs:impact` 无失败
- [ ] `pnpm docs:check` 无失败
- [ ] `docs/handoff.json` 已更新
- [ ] `docs/manifest.json` 已更新（如新增文档）
```

### 3.3 观测与复盘流程

合并后的观测周期（取决于功能）：

```markdown
# 观测周期与复盘

## 发布后观测

**窗口:** 上线后 24-72 小时  
**指标:** user_conversion, trip_completion, error_rate, latency p99  
**Owner:** Product Manager  
**节拍:** 每日早会

## 发现偏差后

如果观测 y(t) 与目标 r(t) 的偏差 e(t) > 容差：

1. 分类 (D0-D3)
2. 记录 (Issue #xxx)
3. 选择控制动作 (小修、回滚、设计评审)
4. 执行并复验

示例：
- D0: "转化率 +1.5%，在预期 ±2% 范围内" → 记录 observation
- D1: "登录失败率 0.5%" → 小 hotfix
- D2: "用户流失率 +5%" → 产品评审，可能需要 UX 重设
- D3: "收入下降 30%" → 操作者决策，可能修订商业模型
```

### 3.4 Agent 最小上下文包

为 AI Agent 生成精简上下文，减少 token 消耗：

```bash
npm run context:generate
```

生成的 `CONTEXT.md`:

```markdown
# VisePanda 当前工作上下文

## 快速导航

1. 项目现状：第 G3 阶段 (coding), 正在实现支付流程 (#123)
2. 强制阅读：docs/INDEX.md → Issue #123 → docs/governance/composite-engineering-baseline.md
3. 关键约束：支付数据不可逆；身份验证无旁路；知识来源可追溯

## 当前工作

**Issue #123**: Payment flow redesign  
**Owner**: alice  
**Status**: In PR #456  
**Acceptance**: Payment success rate 99.9%, error logging complete

## 关键不变量

- TypeScript 覆盖 > 90%
- API 变化需要 30 天通知
- 紧急修复 24h 补完
- 跨模块接口先冻结 contract

## 模块所有权

- Payment: alice (alice@company.com)
- Trip: bob (bob@company.com)
- Identity: charlie (charlie@company.com)

## 最后状态同步

**Time**: 2026-07-13 10:30 UTC  
**Evidence**: Staging smoke test passed, PR #456 approved by reviewer
```

---

## 常见集成场景

### 场景 A：完全新项目（推荐）

```bash
# Week 1
node .qian-skills/scripts/init.js .
node .qian-skills/scripts/generate-index.js --project .
node .qian-skills/scripts/context-generator.js --project .
# → 生成 docs/、manifest.json、handoff.json、docs/INDEX.md、CONTEXT.md

# 编辑基线、约束、Issue 模板

# Week 2-4
# 按 Issue 编码，遵循三层融合工作流
```

### 场景 B：迁移现有项目（谨慎）

```bash
# Audit 现状
node .qian-skills/scripts/audit.js . > audit.md

# Week 1: 建立总体设计、Issue 模板、manifest
# Week 2: 文档索引、handoff 同步
# Week 3: CI 检查、Agent 上下文
# Week 4: 观测与复盘

# 不建议一次全量迁移；逐项目或按优先级分阶段
```

### 场景 C：多团队协作（推荐完全集成）

```bash
# 中心化管理
# - 总体设计由 Architecture 维护
# - 每个子系统团队填写模块 docs/
# - CI 保证 manifest、handoff、INDEX 同步
# - Agent 每人一份 CONTEXT.md (per-team variant)
```

---

## 故障排查

### 问题：`pnpm docs:impact` 显示文档缺失

```bash
# 原因：code 变化但 manifest.json 中无映射
# 解决：编辑 docs/manifest.json，添加受影响文档
pnpm docs:impact --fix  # (可选) 自动添加检测到的缺失项
```

### 问题：`docs/INDEX.md` 生成错误

```bash
# 原因：manifest.json 或 handoff.json 格式错误
# 解决：
npm run docs:check     # 显示详细错误
# 修正 JSON，重试
npm run docs:generate-index
```

### 问题：Team 无法聚焦到最小上下文

```bash
# 原因：CONTEXT.md 过大或陈旧
# 解决：
npm run context:generate  # 重新生成
# 检查 docs/handoff.json 是否最新
# 移除已完成工作项
```

### 问题：新 Agent 不知道从哪里开始

```bash
# 原因：读书顺序不清
# 解决：
# 1. 打开 docs/INDEX.md (auto-generated, 有强制顺序)
# 2. 打开 docs/handoff.json (当前工作状态)
# 3. 按指示读相关文档和 Issue
```

---

## 下一步

集成完成后：

1. **建立观测** - 定义 user_conversion、feature_adoption、error_rate 等
2. **启动 Issue 拆分** - 按 Issue 模板创建任务
3. **配置 Agent** - 生成 CONTEXT.md，配置 Claude Code skills
4. **启动迭代** - 遵循三层融合工作流
5. **定期复盘** - 每周 handoff 同步，每 release 观测验证

---

## 支持与反馈

- **问题**: GitHub Issues
- **讨论**: GitHub Discussions
- **贡献**: PR 欢迎；大改进先 Discussions 对齐

**维护**: VisePanda 架构与治理  
**联系**: JTCAO515/qian-systems-engineering
