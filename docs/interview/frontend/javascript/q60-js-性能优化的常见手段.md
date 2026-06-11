---
title: "JS 性能优化的常见手段？"
---

# JS 性能优化的常见手段？

```text
【加载层面】
1. 代码分割（Code Splitting）：路由级、组件级懒加载
2. Tree Shaking：移除死代码
3. 压缩 + 混淆：Terser / esbuild
4. Gzip/Brotli：服务端开启
5. 预加载：<link rel="preload/prefetch/modulepreload">
6. CDN + 长缓存：hash 文件名，Cache-Control: max-age=31536000

【运行层面】
7. 避免频繁操作 DOM：DocumentFragment / 虚拟列表
8. 防抖 + 节流：滚动/输入/resize 场景
9. 长任务拆分：rAF / setTimeout(0) 让出主线程（避免超过 50ms）
10. Web Worker：把密集计算放到后台线程（不阻塞 UI）
11. 避免不必要的重渲染：React.memo / useMemo / PureComponent
12. 图片优化：懒加载 + 现代格式（WebP/AVIF）+ 响应式尺寸
13. 事件委托：减少监听器数量
14. 虚拟列表：长列表只渲染可见区域

【监控层面】
15. Lighthouse / WebPageTest 跑分
16. Performance API：performance.mark/measure + User Timing
17. Core Web Vitals：LCP / INP / CLS
```

```js
// ===== 防抖 debounce（n 秒内只执行最后一次）=====
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ===== 节流 throttle（n 秒内最多执行一次）=====
function throttle(fn, delay = 300) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// ===== Web Worker 示例 =====
// main.js
const worker = new Worker("./heavy.js");
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => console.log("结果:", e.data);
// heavy.js（独立上下文，无 window/document）
self.onmessage = (e) => {
  const result = heavyCompute(e.data);
  self.postMessage(result);
};
```

---
