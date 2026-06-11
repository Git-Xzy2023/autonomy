---
title: "写一个 `sleep(ms)`，要求能用 `await`。"
---

# 写一个 `sleep(ms)`，要求能用 `await`。

```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function demo() {
  console.log("start");
  await sleep(1000);
  console.log("end");
}
```

---
