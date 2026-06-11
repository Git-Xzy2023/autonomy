---
title: "`Proxy` / `Reflect` 能做什么？"
---

# `Proxy` / `Reflect` 能做什么？

**Proxy = 在目标对象前加一层"拦截器"**，能拦截 13 种基本操作（读、写、枚举、`in`、函数调用……）。

```js
const user = { name: "Alice", age: 30 };
const proxy = new Proxy(user, {
  get(target, key, receiver) {
    console.log(`读取 ${String(key)}`);
    return Reflect.get(target, key, receiver); // 用 Reflect 调默认行为
  },
  set(target, key, value, receiver) {
    if (key === "age" && (typeof value !== "number" || value < 0)) {
      throw new TypeError("age 必须是正整数");
    }
    return Reflect.set(target, key, value, receiver);
  },
  has(target, key) {
    return key === "name" ? false : key in target;
  }, // 隐藏 name
  deleteProperty(target, key) {
    console.log("删除", key);
    return Reflect.deleteProperty(target, key);
  },
});

proxy.name; // 'Alice'，同时打印日志
proxy.age = -1; // 抛错
"name" in proxy; // false（被 has 拦截了）
```

**典型应用**：Vue 3 的响应式系统、默认值、只读包装、数据校验、观察者模式、API 请求自动重试/缓存。

**Reflect = 把原来"挂在 Object/Function 上的内部操作"统一成一个命名空间**，所有 Proxy trap 都有对应的 Reflect 方法。

---
