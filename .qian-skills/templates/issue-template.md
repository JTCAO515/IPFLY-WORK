# Issue Template - Qian Systems Engineering

## 上层目标

<!-- 
这个 Issue 服务于哪个用户能力和商业结果？
Example: Increase user conversion rate from trip discovery to booking by 15%
-->

**User Capability:**  
**Business Result:**  

## 当前观测

<!-- 说明问题的症状、测试结果、遥测数据 -->

- Symptom:
- Evidence (test/telemetry):
- Current baseline:

## 预期成果

<!-- 用户看到什么，系统行为如何改变？ -->

**User sees:**  
**System behavior:**  

## 接口影响

<!-- schema、router、event、migration、RLS 会变化吗？ -->

- [ ] No interface changes
- [ ] Interface changes (describe below):

**Affected interfaces:**

## 文档影响

<!-- 哪些模块说明、约束、runbook 需要同步？ -->

- [ ] No documentation changes
- [ ] Documentation updates needed:

## 所有权与依赖

**Owner:**  
**Dependencies:**  

## 验收标准

- [ ] Implementation passes unit tests (command: `npm test`)
- [ ] Documentation updated
- [ ] Code review approved
- [ ] (Optional) Staging verification complete

## 工作估算

- [ ] XS (≤0.5 day)
- [ ] S (≤1 day)
- [ ] M (≤3 days)
- [ ] L (≤5 days)
- [ ] (If > L, must decompose)

## 风险与回滚

**Risks:**  
**Rollback procedure:**  

---

**Label:** `work:system-engineering` to apply Qian rules
