---
title: "JS 中的错误类型？如何捕获错误？"
---

# JS 中的错误类型？如何捕获错误？

```js
// 内置错误类型
new Error("普通错误");
new SyntaxError("语法错"); // 解析代码时
new ReferenceError("未定义变量"); // 访问不存在的变量
new TypeError("类型错"); // 调用非函数、访问 null 的属性
new RangeError("超出范围"); // 数组长度负数等
new URIError("URI 编码错");

// ===== try/catch/finally =====
try {
  JSON.parse("not json");
} catch (err) {
  console.error(err.name, err.message, err.stack);
} finally {
  console.log("无论成功失败都会执行");
}

// ===== 异步错误 =====
// ❌ try/catch 抓不到 setTimeout 里的错误
try {
  setTimeout(() => {
    throw new Error("boom");
  }, 0);
} catch (e) {
  /* 抓不到！ */
}

// ✅ 用 window.onerror（全局同步错误）
window.onerror = (msg, src, line, col, err) => {
  console.error(msg, err?.stack);
  return true; // 阻止浏览器默认显示
};

// ✅ 用 window.addEventListener('unhandledrejection') 抓未处理的 Promise
window.addEventListener("unhandledrejection", (e) => {
  console.error("未捕获的 Promise 错误:", e.reason);
  e.preventDefault();
});

// ✅ async 函数里用 try/catch
async function demo() {
  try {
    await fetch("/api");
  } catch (e) {
    console.error(e);
  }
}
```

---
