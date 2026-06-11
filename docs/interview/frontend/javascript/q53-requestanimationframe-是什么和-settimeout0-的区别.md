---
title: "`requestAnimationFrame` 是什么？和 `setTimeout(0)` 的区别？"
---

# `requestAnimationFrame` 是什么？和 `setTimeout(0)` 的区别？

**rAF = 在下一次浏览器重绘前执行你的回调**（通常 60fps，即约 16.67ms 一次）。

```js
function animate() {
  box.style.transform = `translateX(${Date.now() % 500}px)`;
  requestAnimationFrame(animate); // 持续动
}
requestAnimationFrame(animate);

// 区别：
// setTimeout(fn, 0) → 最快 4~5ms 一次（HTML5 spec 规定嵌套 >=4ms），不与屏幕刷新同步 → 可能掉帧
// requestAnimationFrame → 跟随屏幕刷新率，后台标签页自动暂停，省 CPU/电量
```

---
