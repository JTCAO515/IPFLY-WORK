# 钱学森 Skills 快速开始

Repository: https://github.com/JTCAO515/qian-systems-engineering
Version: 1.0.0

## 三步集成

### 1. 安装为 Codex Skill

```bash
git clone https://github.com/JTCAO515/qian-systems-engineering.git
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R qian-systems-engineering/skill/qian-systems-engineering "${CODEX_HOME:-$HOME/.codex}/skills/"
```

安装后可用 `$qian-systems-engineering` 触发。

### 2. 添加治理工具到你的项目

```bash
cd /path/to/your-project
git submodule add https://github.com/JTCAO515/qian-systems-engineering.git .qian-skills
node .qian-skills/scripts/init.js .
```

如果不想使用 submodule，也可以直接克隆：

```bash
git clone https://github.com/JTCAO515/qian-systems-engineering.git .qian-skills
node .qian-skills/scripts/init.js .
```

### 3. 检查和生成上下文

```bash
node .qian-skills/scripts/docs-check.js --project .
node .qian-skills/scripts/generate-index.js --project .
node .qian-skills/scripts/context-generator.js --project .
```

这会创建或验证：

- `docs/manifest.json`
- `docs/handoff.json`
- `docs/INDEX.md`
- `CONTEXT.md`
- `.github/ISSUE_TEMPLATE/standard.md`

### 4. 加入 package 脚本

```json
{
  "scripts": {
    "docs:check": "node .qian-skills/scripts/docs-check.js --project .",
    "docs:impact": "node .qian-skills/scripts/docs-impact.js --project . --base main",
    "docs:generate-index": "node .qian-skills/scripts/generate-index.js --project .",
    "context:generate": "node .qian-skills/scripts/context-generator.js --project .",
    "qian:audit": "node .qian-skills/scripts/audit.js ."
  }
}
```

## 你需要维护的文件

| File | Purpose |
| --- | --- |
| `docs/manifest.json` | Register controlled documents and their owners. |
| `docs/handoff.json` | Record current phase, active work, blockers, checks, and next actions. |
| `docs/INDEX.md` | Generated reading order and handoff snapshot. |
| `.github/ISSUE_TEMPLATE/standard.md` | Executable Issue template. |
| `CONTEXT.md` | Compact context package for AI agents. |

## 首个 Issue 应包含

```markdown
## 上层目标
用户能力：
商业结果：

## 当前观测
- 

## 预期成果
- 

## 接口影响
- 

## 文档影响
- 

## 验收标准
- [ ] 
```

完整模板见 [templates/issue-template.md](templates/issue-template.md)。

## 常用命令

```bash
node .qian-skills/scripts/audit.js .
node .qian-skills/scripts/docs-check.js --project .
node .qian-skills/scripts/docs-impact.js --project . --base main
node .qian-skills/scripts/generate-index.js --project .
node .qian-skills/scripts/context-generator.js --project .
```

## 必读顺序

1. [SKILL.md](SKILL.md)
2. [docs/methodology/qian-systems-engineering.md](docs/methodology/qian-systems-engineering.md)
3. [docs/constraints/qian-systems-engineering.md](docs/constraints/qian-systems-engineering.md)
4. [docs/constraints/karpathy-guidelines.md](docs/constraints/karpathy-guidelines.md)
