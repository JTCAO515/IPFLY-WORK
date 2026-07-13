# Project Constraints — Vibecoding

## 技术约束

| # | 约束 | 类型 |
|---|------|------|
| TC-01 | 零成本部署（Vercel Hobby） | 强制 |
| TC-02 | 纯前端 + JSON 存储（无需后端） | 强制 |
| TC-03 | 移动端适配 | 强制 |

## 不变量

| # | 不变量 | 检查方式 |
|---|--------|----------|
| SI-01 | 用户数据不丢失（localStorage backup） | 手动验证 |
| SI-02 | 页面加载 < 3s | Lighthouse |
