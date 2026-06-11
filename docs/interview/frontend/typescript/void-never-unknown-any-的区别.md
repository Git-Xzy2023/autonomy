---
title: "`void`、`never`、`unknown`、`any` 的区别？"
---

# `void`、`never`、`unknown`、`any` 的区别？

这是面试常考题目，需要清晰区分：

```ts
// ========== void ==========
// 函数没有返回值（或返回 undefined）
function log(msg: string): void {
  console.log(msg);
  // 隐式返回 undefined
}
// void 作为变量类型时，只能赋值为 undefined（strict 模式）
let v: void = undefined;

// ========== never ==========
// 函数永远不会"正常返回"
// 场景1：抛出异常
function error(msg: string): never {
  throw new Error(msg);
}
// 场景2：无限循环
function loop(): never {
  while (true) {}
}
// 场景3：穷尽性检查（exhaustive check）
type Fruit = "apple" | "banana";
function handleFruit(f: Fruit) {
  switch (f) {
    case "apple":
      /*...*/ break;
    case "banana":
      /*...*/ break;
    default:
      // 如果日后新增了 Fruit 的成员，这里会编译报错，提醒你处理
      const _exhaustiveCheck: never = f; // ❌ 若 f 未被穷尽
      throw new Error("未知类型");
  }
}

// ========== unknown ==========
// 类型安全的 any —— 必须先做类型检查才能使用
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}
const data = parseJSON('{"x":1}');
// data.x; // ❌ 报错：Object is of type 'unknown'
if (typeof data === "object" && data !== null && "x" in data) {
  console.log((data as { x: number }).x); // ✅ 必须先缩小类型
}

// ========== any ==========
// 跳过类型检查，不推荐
let anything: any = "hello";
anything = 123;
anything = { x: 1 };
anything.nonexistent.method(); // ❌ 编译不报错，运行时才炸
```

**对比总结：**

| 类型      | 可赋值给它  | 它可赋值给                    | 可随意调用方法/属性 | 说明             |
| --------- | ----------- | ----------------------------- | ------------------- | ---------------- |
| `any`     | 任何类型    | 任何类型                      | ✅                  | 完全跳过类型检查 |
| `unknown` | 任何类型    | 只能赋值给 `unknown` 和 `any` | ❌                  | 必须先类型收窄   |
| `void`    | `undefined` | ——                            | ——                  | 函数无返回值     |
| `never`   | 无          | 任何类型                      | ——                  | 永远不会正常结束 |

**最佳实践**：能用 `unknown` 就不要用 `any`。`any` 会污染整个类型系统（any 参与运算后其他值也会变成 any）。
