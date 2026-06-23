---
title: 代码审查
---

# 代码审查

> 代码审查（Code Review）是保证代码质量、促进知识共享的重要环节。

---

## 一、代码审查的目的

```
┌─────────────────────────────────────────┐
│         代码审查的目的                  │
├─────────────────────────────────────────┤
│                                         │
│  ✅ 提高代码质量                        │
│  ✅ 发现潜在 bug                        │
│  ✅ 确保代码规范                        │
│  ✅ 促进知识共享                        │
│  ✅ 统一代码风格                        │
│  ✅ 学习最佳实践                        │
│  ✅ 培养团队协作                        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、审查清单

### 2.1 功能性

- [ ] 代码是否实现了需求？
- [ ] 是否处理了边界情况？
- [ ] 是否处理了错误情况？
- [ ] 是否有未使用的代码？

### 2.2 可读性

- [ ] 变量/函数命名是否清晰？
- [ ] 代码结构是否清晰？
- [ ] 是否有过长的函数？
- [ ] 是否有重复代码？
- [ ] 注释是否必要且准确？

### 2.3 安全性

- [ ] 是否有 XSS 风险？
- [ ] 是否有 SQL 注入风险？
- [ ] 敏感信息是否泄露？
- [ ] 权限检查是否完整？

### 2.4 性能

- [ ] 是否有不必要的渲染？
- [ ] 是否有内存泄漏？
- [ ] 是否有 N+1 查询？
- [ ] 大数据是否分页？

### 2.5 测试

- [ ] 是否有单元测试？
- [ ] 测试覆盖率是否达标？
- [ ] 测试是否有效？

---

## 三、审查示例

### 3.1 命名问题

```typescript
// ❌ 审查意见：命名不清晰
function fn(a: any, b: any) {
  const x = a + b
  return x
}

// ✅ 修改后
function calculateTotal(price: number, tax: number): number {
  const total = price + tax
  return total
}
```

### 3.2 边界情况

```typescript
// ❌ 审查意见：未处理边界情况
function getItem(list: any[], index: number) {
  return list[index]
}

// ✅ 修改后
function getItem<T>(list: T[], index: number): T | undefined {
  if (index < 0 || index >= list.length) {
    return undefined
  }
  return list[index]
}
```

### 3.3 性能问题

```typescript
// ❌ 审查意见：每次渲染都创建新函数
function Component({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  )
}

// ✅ 修改后：使用 useCallback
function Component({ items }) {
  const handleClick = useCallback((id: string) => {
    // ...
  }, [])

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  )
}
```

### 3.4 安全问题

```typescript
// ❌ 审查意见：XSS 风险
function Comment({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

// ✅ 修改后：使用文本渲染
function Comment({ content }) {
  return <div>{content}</div>
}
```

---

## 四、审查工具

### 4.1 GitHub PR

```markdown
## 审查模板

### 总体评价
<!-- 总体评价 -->

### 必须修改
- [ ] 问题1：描述
- [ ] 问题2：描述

### 建议修改
- 💡 建议1：描述
- 💡 建议2：描述

### 赞赏
- 👍 亮点1
- 👍 亮点2
```

### 4.2 自动化工具

```yaml
# .github/workflows/code-review.yml
name: Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: ESLint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Coverage
        run: npm run test:coverage
```

---

## 五、审查最佳实践

### 5.1 审查者

```
┌─────────────────────────────────────────┐
│         审查者最佳实践                  │
├─────────────────────────────────────────┤
│                                         │
│  ✅ 对事不对人                          │
│  ✅ 具体说明问题                        │
│  ✅ 提供解决方案                        │
│  ✅ 区分必须修改和建议                  │
│  ✅ 及时审查                            │
│  ✅ 肯定好的代码                        │
│                                         │
│  ❌ 不要讽刺挖苦                        │
│  ❌ 不要吹毛求疵                        │
│  ❌ 不要拖延审查                        │
│  ❌ 不要只说"不好"                      │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 被审查者

```
┌─────────────────────────────────────────┐
│        被审查者最佳实践                 │
├─────────────────────────────────────────┤
│                                         │
│  ✅ 提交前自审                          │
│  ✅ 小批量提交                          │
│  ✅ 清晰的 PR 描述                      │
│  ✅ 虚心接受意见                        │
│  ✅ 解释设计决策                        │
│  ✅ 及时修改                            │
│                                         │
│  ❌ 不要提交大量代码                    │
│  ❌ 不要抵触反馈                        │
│  ❌不要无解释的代码                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 六、总结

### ✅ 关键知识点

1. **审查目的**：质量保证、知识共享
2. **审查清单**：功能、可读性、安全、性能、测试
3. **审查工具**：GitHub PR、自动化 CI
4. **最佳实践**：对事不对人、及时审查、虚心接受

### 🔚 结束

- 上一章：[TypeScript 规范](/web/architecture/code-standards/04-typescript/)
- 上一级：[代码规范](/web/architecture/code-standards/)
- 下一模块：[测试](/web/architecture/testing/)
