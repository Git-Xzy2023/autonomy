---
title: "可辨识联合（Discriminated Unions）"
---

# 可辨识联合（Discriminated Unions）

**Q51: 什么是可辨识联合？它有什么价值？**

可辨识联合是处理复杂状态的最佳 TS 模式。它要求联合中的每个类型都有**一个共同的、可以用来做区分的属性**（叫做"tag"或"discriminator"）：

```ts
// 场景：异步请求的三种状态
type LoadingState = { status: "loading" };
type SuccessState<T> = { status: "success"; data: T };
type ErrorState = { status: "error"; error: string };
type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function render<T>(state: AsyncState<T>) {
  switch (state.status) {
    case "loading":
      return <Spinner />;
    case "success":
      return <Display data={state.data} />; // state.data 类型安全
    case "error":
      return <Alert message={state.error} />;
  }
}
```

**为什么好**：

- **穷尽性检查**：`switch` 遗漏某个分支时 TS 会报错（配合 `never` 检查）
- **类型安全**：在每个分支内 TS 知道当前是哪个子类型，可以直接访问对应的属性
- **无非法状态**：`success` 状态必有 `data`、`error` 状态必有 `error`，杜绝了"success 但 data 为空"的无效状态

**在 Redux/Vuex/useReducer 中极为常见**：每个 action 都有一个 `type` 字段作为辨识符。
