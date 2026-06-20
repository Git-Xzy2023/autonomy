export default {
  // 面试题-首页
  "/interview/": [
    {
      text: "面试题",
      items: [
        { text: "前端面试题", link: "/interview/frontend/" },
        { text: "Java 面试题", link: "/interview/" },
        { text: "Python 面试题", link: "/interview/" },
        { text: "Go 面试题", link: "/interview/" },
      ],
    },
  ],

  // 面试题-前端面试题
  "/interview/frontend/": [
    {
      text: "前端面试题",
      items: [
        { text: "网络", link: "/interview/frontend/network/" },
        { text: "浏览器渲染", link: "/interview/frontend/browser/" },
        { text: "CSS", link: "/interview/frontend/css/" },
        { text: "JavaScript", link: "/interview/frontend/javascript/" },
        { text: "ES 新特性", link: "/interview/frontend/es/" },
        { text: "TypeScript", link: "/interview/frontend/typescript/" },
        { text: "Vue", link: "/interview/frontend/vue/" },
        { text: "React", link: "/interview/frontend/react" },
        { text: "Node.js", link: "/interview/frontend/nodejs/" },
        { text: "工程化", link: "/interview/frontend/engineering" },
      ],
    },
  ],

  // 面试题-网络
  "/interview/frontend/network/": [
    {
      text: "网络面试题",
      items: [
        {
          text: "1. 常见的 HTTP 方法有哪些？",
          link: "/interview/frontend/network/",
        },
        {
          text: "2. 什么是 CSRF 攻击？",
          link: "/interview/frontend/network/csrf",
        },
        { text: "3. 什么是 DNS？", link: "/interview/frontend/network/dns" },
        {
          text: "4. GET 与 POST 的区别",
          link: "/interview/frontend/network/get-vs-post",
        },
        {
          text: "5. 前端需要注意哪些 HTTP？",
          link: "/interview/frontend/network/http-frontend",
        },
        {
          text: "6. HTTP 报文结构",
          link: "/interview/frontend/network/http-message",
        },
        {
          text: "7. HTTP 如何优化？",
          link: "/interview/frontend/network/http-optimize",
        },
        {
          text: "8. HTTP 常见的状态码有哪些？",
          link: "/interview/frontend/network/http-status-code",
        },
        {
          text: "9. HTTP 与 HTTP2.0 的区别",
          link: "/interview/frontend/network/http2",
        },
        {
          text: "10. HTTP 和 HTTPS 的区别",
          link: "/interview/frontend/network/https",
        },
        {
          text: "11. TCP 的流量控制",
          link: "/interview/frontend/network/tcp-flow-control",
        },
        {
          text: "12. TCP 的三次握手和四次挥手",
          link: "/interview/frontend/network/tcp-handshake",
        },
        {
          text: "13. TCP 的可靠传输机制",
          link: "/interview/frontend/network/tcp-reliable",
        },
        {
          text: "14. TCP 粘包问题",
          link: "/interview/frontend/network/tcp-sticky",
        },
        {
          text: "15. TCP 和 UDP 的区别",
          link: "/interview/frontend/network/tcp-udp",
        },
        {
          text: "16. WebSocket",
          link: "/interview/frontend/network/websocket",
        },
        {
          text: "17. 什么是 XSS 攻击？",
          link: "/interview/frontend/network/xss",
        },
      ],
    },
  ],

  // 面试题-浏览器渲染
  "/interview/frontend/browser/": [
    {
      text: "浏览器渲染面试题",
      items: [
        { text: "1. 什么是 XSS 攻击？", link: "/interview/frontend/browser/" },
        {
          text: "2. 浏览器缓存机制",
          link: "/interview/frontend/browser/cache",
        },
        {
          text: "3. 浏览器组成",
          link: "/interview/frontend/browser/composition",
        },
        { text: "4. 同源策略与跨域", link: "/interview/frontend/browser/cors" },
        {
          text: "5. 什么是 CSRF 攻击？",
          link: "/interview/frontend/browser/csrf",
        },
        { text: "6. 事件循环", link: "/interview/frontend/browser/event-loop" },
        {
          text: "7. 浏览器事件机制",
          link: "/interview/frontend/browser/event",
        },
        {
          text: "8. 什么是中间人攻击？",
          link: "/interview/frontend/browser/mitm",
        },
        {
          text: "9. 进程与线程的概念",
          link: "/interview/frontend/browser/process-thread",
        },
        {
          text: "10. F5、Ctrl+F5、地址栏回车有什么区别？",
          link: "/interview/frontend/browser/refresh",
        },
        {
          text: "11. 浏览器的渲染过程",
          link: "/interview/frontend/browser/render",
        },
        {
          text: "12. 浏览器存储方式",
          link: "/interview/frontend/browser/storage",
        },
        {
          text: "13. 浏览器渲染进程有哪些线程？",
          link: "/interview/frontend/browser/threads",
        },
      ],
    },
  ],

  // 面试题-CSS
  "/interview/frontend/css/": [
    {
      text: "CSS面试题",
      items: [
        {
          text: "1. CSS 的引入方式有哪些？它们的优先级如何？",
          link: "/interview/frontend/css/",
        },
        {
          text: "2. aspect-ratio（宽高比）",
          link: "/interview/frontend/css/aspect-ratio宽高比",
        },
        {
          text: "3. Can I Use 与浏览器兼容性",
          link: "/interview/frontend/css/can-i-use-与浏览器兼容性",
        },
        {
          text: "4. container queries（容器查询）",
          link: "/interview/frontend/css/container-queries容器查询",
        },
        {
          text: "5. CSS Grid 进阶特性",
          link: "/interview/frontend/css/css-grid-进阶特性",
        },
        {
          text: "6. CSS Hack 是什么？有哪些常见的？",
          link: "/interview/frontend/css/css-hack-是什么有哪些常见的",
        },
        {
          text: "7. CSS Logical Properties（逻辑属性）",
          link: "/interview/frontend/css/css-logical-properties逻辑属性",
        },
        {
          text: "8. CSS Reset 和 Normalize.css 的区别？",
          link: "/interview/frontend/css/css-reset-和-normalizecss-的区别",
        },
        {
          text: "9. CSS 中 `currentColor` 关键字有什么用？",
          link: "/interview/frontend/css/css-中-currentcolor-关键字有什么用",
        },
        {
          text: "10. CSS 中哪些属性可以继承？",
          link: "/interview/frontend/css/css-中哪些属性可以继承",
        },
        {
          text: "11. CSS 中如何实现垂直居中？",
          link: "/interview/frontend/css/css-中如何实现垂直居中",
        },
        {
          text: "12. CSS 中如何实现暗色模式（Dark Mode）？",
          link: "/interview/frontend/css/css-中如何实现暗色模式dark-mode",
        },
        {
          text: "13. CSS 中如何实现瀑布流布局？",
          link: "/interview/frontend/css/css-中如何实现瀑布流布局",
        },
        {
          text: "14. CSS 中如何实现粘性定位（Sticky）？",
          link: "/interview/frontend/css/css-中如何实现粘性定位sticky",
        },
        {
          text: "15. CSS 中常见的单位有哪些？区别是什么？",
          link: "/interview/frontend/css/css-中常见的单位有哪些区别是什么",
        },
        {
          text: "16. CSS 代码规范与最佳实践",
          link: "/interview/frontend/css/css-代码规范与最佳实践",
        },
        { text: "17. CSS 函数", link: "/interview/frontend/css/css-函数" },
        {
          text: "18. CSS 前缀（Vendor Prefix）",
          link: "/interview/frontend/css/css-前缀vendor-prefix",
        },
        {
          text: "19. CSS 动画有哪些实现方式？",
          link: "/interview/frontend/css/css-动画有哪些实现方式",
        },
        {
          text: "20. CSS 变量（Custom Properties）",
          link: "/interview/frontend/css/css-变量custom-properties",
        },
        {
          text: "21. CSS 嵌套（Native CSS Nesting）",
          link: "/interview/frontend/css/css-嵌套native-css-nesting",
        },
        {
          text: "22. CSS 工程化工具",
          link: "/interview/frontend/css/css-工程化工具",
        },
        {
          text: "23. CSS 选择器有哪些类型？优先级如何计算？",
          link: "/interview/frontend/css/css-选择器有哪些类型优先级如何计算",
        },
        {
          text: "24. CSS 选择器的优先级是怎样的？",
          link: "/interview/frontend/css/css-选择器的优先级是怎样的",
        },
        {
          text: "25. CSS 选择器的解析顺序是怎样的？",
          link: "/interview/frontend/css/css-选择器的解析顺序是怎样的",
        },
        {
          text: "26. CSS 预处理器 vs CSS 新特性",
          link: "/interview/frontend/css/css-预处理器-vs-css-新特性",
        },
        {
          text: "27. display: none、visibility: hidden、opacity: 0 的区别？",
          link: "/interview/frontend/css/display-nonevisibility-hiddenopacity-0-的区别",
        },
        {
          text: "28. display 属性有哪些常用值？它们的区别是什么？",
          link: "/interview/frontend/css/display-属性有哪些常用值它们的区别是什么",
        },
        {
          text: "29. Flexbox 中 flex: 1 代表什么？",
          link: "/interview/frontend/css/flexbox-中-flex-1-代表什么",
        },
        {
          text: "30. Flexbox（弹性盒子）详解",
          link: "/interview/frontend/css/flexbox弹性盒子详解",
        },
        {
          text: "31. Grid（网格布局）详解",
          link: "/interview/frontend/css/grid网格布局详解",
        },
        {
          text: "32. :has() 选择器（父选择器）",
          link: "/interview/frontend/css/has-选择器父选择器",
        },
        {
          text: "33. Less 核心特性",
          link: "/interview/frontend/css/less-核心特性",
        },
        {
          text: "34. Sass/SCSS 核心特性",
          link: "/interview/frontend/css/sassscss-核心特性",
        },
        {
          text: "35. viewport 是什么？如何设置？",
          link: "/interview/frontend/css/viewport-是什么如何设置",
        },
        {
          text: "36. z-index 的工作原理是什么？如何正确使用？",
          link: "/interview/frontend/css/z-index-的工作原理是什么如何正确使用",
        },
        {
          text: "37. 什么是 BFC？如何创建 BFC？它有什么作用？",
          link: "/interview/frontend/css/什么是-bfc如何创建-bfc它有什么作用",
        },
        {
          text: "38. 什么是 CSS 盒模型？标准盒模型和 IE 盒模型有什么区别？",
          link: "/interview/frontend/css/什么是-css-盒模型标准盒模型和-ie-盒模型有什么区别",
        },
        {
          text: "39. 什么是 CSS 继承？哪些属性可以继承？",
          link: "/interview/frontend/css/什么是-css-继承哪些属性可以继承",
        },
        {
          text: "40. 什么是 CSS 选择器？有哪些常见的选择器？",
          link: "/interview/frontend/css/什么是-css-选择器有哪些常见的选择器",
        },
        {
          text: "41. 什么是 CSS 预处理器？有哪些常见的？",
          link: "/interview/frontend/css/什么是-css-预处理器有哪些常见的",
        },
        {
          text: "42. 什么是 margin 合并（塌陷）？如何解决？",
          link: "/interview/frontend/css/什么是-margin-合并塌陷如何解决",
        },
        {
          text: "43. 什么是响应式设计？如何实现？",
          link: "/interview/frontend/css/什么是响应式设计如何实现",
        },
        {
          text: "44. 什么是回流（Reflow）和重绘（Repaint）？如何优化？",
          link: "/interview/frontend/css/什么是回流reflow和重绘repaint如何优化",
        },
        {
          text: "45. 什么是定位（position）？有哪些定位方式？",
          link: "/interview/frontend/css/什么是定位position有哪些定位方式",
        },
        {
          text: "46. 什么是层叠上下文？层叠顺序是怎样的？",
          link: "/interview/frontend/css/什么是层叠上下文层叠顺序是怎样的",
        },
        {
          text: "47. 什么是浮动（float）？它有哪些问题？如何清除浮动？",
          link: "/interview/frontend/css/什么是浮动float它有哪些问题如何清除浮动",
        },
        {
          text: "48. 响应式布局常见技巧",
          link: "/interview/frontend/css/响应式布局常见技巧",
        },
        {
          text: "49. 如何优化 CSS 动画性能？",
          link: "/interview/frontend/css/如何优化-css-动画性能",
        },
        {
          text: "50. 如何优化 CSS 的加载性能？",
          link: "/interview/frontend/css/如何优化-css-的加载性能",
        },
        {
          text: "51. 如何实现一个自适应的圆形头像？",
          link: "/interview/frontend/css/如何实现一个自适应的圆形头像",
        },
        {
          text: "52. 如何实现一个自适应的正方形？",
          link: "/interview/frontend/css/如何实现一个自适应的正方形",
        },
        {
          text: "53. 如何实现三角形？",
          link: "/interview/frontend/css/如何实现三角形",
        },
        {
          text: "54. 如何实现两栏布局（左侧固定，右侧自适应）？",
          link: "/interview/frontend/css/如何实现两栏布局左侧固定右侧自适应",
        },
        {
          text: "55. 如何实现元素的水平垂直居中？",
          link: "/interview/frontend/css/如何实现元素的水平垂直居中",
        },
        {
          text: "56. 如何实现单行/多行文本溢出省略号？",
          link: "/interview/frontend/css/如何实现单行多行文本溢出省略号",
        },
        {
          text: "57. 总结：CSS 学习路径",
          link: "/interview/frontend/css/总结css-学习路径",
        },
        {
          text: "58. 移动端适配方案有哪些？",
          link: "/interview/frontend/css/移动端适配方案有哪些",
        },
      ],
    },
  ],

  // 面试题-JavaScript
  "/interview/frontend/javascript/": [
    {
      text: "JavaScript面试题",
      items: [
        {
          text: "1. JS 有哪些数据类型？原始类型和对象类型有什么区别？",
          link: "/interview/frontend/javascript/",
        },
        {
          text: "2. 什么是 IIFE？为什么要用它？",
          link: "/interview/frontend/javascript/q10-什么是-iife为什么要用它",
        },
        {
          text: "3. 什么是原型（Prototype）？每个对象都有 `__proto__` 吗？",
          link: "/interview/frontend/javascript/q11-什么是原型prototype每个对象都有-__proto__-吗",
        },
        {
          text: "4. `new` 关键字到底做了什么？",
          link: "/interview/frontend/javascript/q12-new-关键字到底做了什么",
        },
        {
          text: "5. 原型链（Prototype Chain）是怎样的？`instanceof` 的原理？",
          link: "/interview/frontend/javascript/q13-原型链prototype-chain是怎样的instanceof-的原理",
        },
        {
          text: "6. 如何实现继承？ES5 的组合寄生继承 vs ES6 的 `class` 继承",
          link: "/interview/frontend/javascript/q14-如何实现继承es5-的组合寄生继承-vs-es6-的-class-继承",
        },
        {
          text: "7. `Object.create`、`Object.setPrototypeOf`、`Object.assign` 的区别？",
          link: "/interview/frontend/javascript/q15-objectcreateobjectsetprototypeofobjectassign-的区别",
        },
        {
          text: "8. `hasOwnProperty` / `in` / `for...in` 的区别？",
          link: "/interview/frontend/javascript/q16-hasownproperty-in-forin-的区别",
        },
        {
          text: "9. 什么是执行上下文（Execution Context）？什么是调用栈（Call Stack）？",
          link: "/interview/frontend/javascript/q17-什么是执行上下文execution-context什么是调用栈call-stack",
        },
        {
          text: "10. `this` 的绑定规则？箭头函数的 `this`？",
          link: "/interview/frontend/javascript/q18-this-的绑定规则箭头函数的-this",
        },
        {
          text: "11. `call` / `apply` / `bind` 的区别？手写一个 `bind`？",
          link: "/interview/frontend/javascript/q19-call-apply-bind-的区别手写一个-bind",
        },
        {
          text: "12. `==` 与 `===` 的区别？",
          link: "/interview/frontend/javascript/q2-与-的区别",
        },
        {
          text: "13. 严格模式（`'use strict'`）有什么影响？",
          link: "/interview/frontend/javascript/q20-严格模式use-strict有什么影响",
        },
        {
          text: "14. JS 的事件循环（Event Loop）是什么？宏任务 / 微任务有哪些？",
          link: "/interview/frontend/javascript/q21-js-的事件循环event-loop是什么宏任务-微任务有哪些",
        },
        {
          text: "15. Promise 的三种状态？状态转换规则？",
          link: "/interview/frontend/javascript/q22-promise-的三种状态状态转换规则",
        },
        {
          text: "16. 手写一个最简版的 Promise（符合 A+ 规范思想）",
          link: "/interview/frontend/javascript/q23-手写一个最简版的-promise符合-a-规范思想",
        },
        {
          text: "17. `Promise.all` / `allSettled` / `race` / `any` 的区别？",
          link: "/interview/frontend/javascript/q24-promiseall-allsettled-race-any-的区别",
        },
        {
          text: "18. `async/await` 是什么？它只是 Promise 的语法糖吗？",
          link: "/interview/frontend/javascript/q25-asyncawait-是什么它只是-promise-的语法糖吗",
        },
        {
          text: "19. 如何实现一个带并发限制的 Promise 调度器？",
          link: "/interview/frontend/javascript/q26-如何实现一个带并发限制的-promise-调度器",
        },
        {
          text: "20. 什么是宏任务 / 微任务？`process.nextTick` / `setImmediate` / `setTimeout(0)` 的顺序？（Node 特有）",
          link: "/interview/frontend/javascript/q27-什么是宏任务-微任务processnexttick-setimmediate-settimeout0-的顺序node-特有",
        },
        {
          text: "21. `map / forEach / filter / reduce / some / every / find / findIndex` 的区别？",
          link: "/interview/frontend/javascript/q28-map-foreach-filter-reduce-some-every-find-findindex-的区别",
        },
        {
          text: "22. 浅拷贝 / 深拷贝？如何实现深拷贝？",
          link: "/interview/frontend/javascript/q29-浅拷贝-深拷贝如何实现深拷贝",
        },
        {
          text: "23. `null`、`undefined`、`''`、`0`、`NaN` 的区别？",
          link: "/interview/frontend/javascript/q3-nullundefined0nan-的区别",
        },
        {
          text: "24. `Array.prototype.sort()` 的默认排序规则？它是稳定的吗？",
          link: "/interview/frontend/javascript/q30-arrayprototypesort-的默认排序规则它是稳定的吗",
        },
        {
          text: "25. 数组去重的 N 种方式？",
          link: "/interview/frontend/javascript/q31-数组去重的-n-种方式",
        },
        {
          text: "26. 展开运算符 `...` 与 `Object.assign`、`Array.concat` 的关系？",
          link: "/interview/frontend/javascript/q32-展开运算符-与-objectassignarrayconcat-的关系",
        },
        {
          text: "27. `let` / `const` 和 `var` 的区别？",
          link: "/interview/frontend/javascript/q33-let-const-和-var-的区别",
        },
        {
          text: "28. 箭头函数和普通函数有哪些区别？",
          link: "/interview/frontend/javascript/q34-箭头函数和普通函数有哪些区别",
        },
        {
          text: "29. 解构赋值（Destructuring）的常见用法？",
          link: "/interview/frontend/javascript/q35-解构赋值destructuring的常见用法",
        },
        {
          text: "30. 模板字符串（Template Literals）能做什么？标签模板（Tagged Template）？",
          link: "/interview/frontend/javascript/q36-模板字符串template-literals能做什么标签模板tagged-template",
        },
        {
          text: "31. `Map` / `Set` / `WeakMap` / `WeakSet` 的区别？",
          link: "/interview/frontend/javascript/q37-map-set-weakmap-weakset-的区别",
        },
        {
          text: "32. `Symbol` 是什么？有什么用？",
          link: "/interview/frontend/javascript/q38-symbol-是什么有什么用",
        },
        {
          text: "33. 迭代器（Iterator）与生成器（Generator）？",
          link: "/interview/frontend/javascript/q39-迭代器iterator与生成器generator",
        },
        {
          text: "34. 什么是 NaN？如何判断一个值是不是 NaN？",
          link: "/interview/frontend/javascript/q4-什么是-nan如何判断一个值是不是-nan",
        },
        {
          text: "35. `Proxy` / `Reflect` 能做什么？",
          link: "/interview/frontend/javascript/q40-proxy-reflect-能做什么",
        },
        {
          text: "36. 可选链 `?.` / 空值合并 `??` / 逻辑赋值 `&&=` / `||=` / `??=`？",
          link: "/interview/frontend/javascript/q41-可选链-空值合并-逻辑赋值",
        },
        {
          text: "37. Promise.finally / ES2020 到 ES2023 的重要特性？",
          link: "/interview/frontend/javascript/q42-promisefinally-es2020-到-es2023-的重要特性",
        },
        {
          text: "38. DOM 事件流是怎样的？捕获 / 目标 / 冒泡三阶段？",
          link: "/interview/frontend/javascript/q43-dom-事件流是怎样的捕获-目标-冒泡三阶段",
        },
        {
          text: "39. 事件委托（Event Delegation）是什么？为什么要用它？",
          link: "/interview/frontend/javascript/q44-事件委托event-delegation是什么为什么要用它",
        },
        {
          text: "40. `e.target` vs `e.currentTarget` vs `this`？",
          link: "/interview/frontend/javascript/q45-etarget-vs-ecurrenttarget-vs-this",
        },
        {
          text: "41. DOM 的查询 / 创建 / 插入 / 删除 API？",
          link: "/interview/frontend/javascript/q46-dom-的查询-创建-插入-删除-api",
        },
        {
          text: "42. `innerHTML`、`textContent`、`innerText` 的区别？",
          link: "/interview/frontend/javascript/q47-innerhtmltextcontentinnertext-的区别",
        },
        {
          text: "43. 回流（Reflow / Layout）与重绘（Repaint）？如何优化？",
          link: "/interview/frontend/javascript/q48-回流reflow-layout与重绘repaint如何优化",
        },
        {
          text: "44. BOM 有哪些常用 API？",
          link: "/interview/frontend/javascript/q49-bom-有哪些常用-api",
        },
        {
          text: "45. JS 的隐式类型转换规则？`'5' + 3`、`'5' - 3` 结果是什么？",
          link: "/interview/frontend/javascript/q5-js-的隐式类型转换规则5-35-3-结果是什么",
        },
        {
          text: "46. Cookie / localStorage / sessionStorage / IndexedDB 的区别？",
          link: "/interview/frontend/javascript/q50-cookie-localstorage-sessionstorage-indexeddb-的区别",
        },
        {
          text: "47. `XMLHttpRequest` vs `fetch` vs `axios`？",
          link: "/interview/frontend/javascript/q51-xmlhttprequest-vs-fetch-vs-axios",
        },
        {
          text: "48. `JSONP` 的原理？CORS 与 `withCredentials`？",
          link: "/interview/frontend/javascript/q52-jsonp-的原理cors-与-withcredentials",
        },
        {
          text: "49. `requestAnimationFrame` 是什么？和 `setTimeout(0)` 的区别？",
          link: "/interview/frontend/javascript/q53-requestanimationframe-是什么和-settimeout0-的区别",
        },
        {
          text: "50. CommonJS vs ES Module？",
          link: "/interview/frontend/javascript/q54-commonjs-vs-es-module",
        },
        {
          text: "51. 什么是 Tree Shaking？需要满足什么条件？",
          link: "/interview/frontend/javascript/q55-什么是-tree-shaking需要满足什么条件",
        },
        {
          text: "52. `import()` 动态导入与懒加载？",
          link: "/interview/frontend/javascript/q56-import-动态导入与懒加载",
        },
        {
          text: "53. JS 中的错误类型？如何捕获错误？",
          link: "/interview/frontend/javascript/q57-js-中的错误类型如何捕获错误",
        },
        {
          text: "54. 如何自定义错误类？",
          link: "/interview/frontend/javascript/q58-如何自定义错误类",
        },
        {
          text: "55. JS 中正则的常用 API？",
          link: "/interview/frontend/javascript/q59-js-中正则的常用-api",
        },
        {
          text: "56. 变量提升（Hoisting）是什么？`var`、`let`、`const`、`function` 的提升规则？",
          link: "/interview/frontend/javascript/q6-变量提升hoisting是什么varletconstfunction-的提升规则",
        },
        {
          text: "57. JS 性能优化的常见手段？",
          link: "/interview/frontend/javascript/q60-js-性能优化的常见手段",
        },
        {
          text: "58. 手写 `new`",
          link: "/interview/frontend/javascript/q61-手写-new",
        },
        {
          text: "59. 手写 `instanceof`",
          link: "/interview/frontend/javascript/q62-手写-instanceof",
        },
        {
          text: "60. 手写 `call` / `apply` / `bind`",
          link: "/interview/frontend/javascript/q63-手写-call-apply-bind",
        },
        {
          text: "61. 手写 `debounce` 支持 `immediate`",
          link: "/interview/frontend/javascript/q64-手写-debounce-支持-immediate",
        },
        {
          text: "62. 手写 `throttle`（时间戳 + 定时器双版本）",
          link: "/interview/frontend/javascript/q65-手写-throttle时间戳-定时器双版本",
        },
        {
          text: "63. 手写 `deepClone`（含循环引用）",
          link: "/interview/frontend/javascript/q66-手写-deepclone含循环引用",
        },
        {
          text: "64. 手写 `Promise`（最简版）",
          link: "/interview/frontend/javascript/q67-手写-promise最简版",
        },
        {
          text: "65. 手写 `Promise.all` / `allSettled` / `race` / `any`",
          link: "/interview/frontend/javascript/q68-手写-promiseall-allsettled-race-any",
        },
        {
          text: "66. 手写 `并发限制的 Promise 调度器`",
          link: "/interview/frontend/javascript/q69-手写-并发限制的-promise-调度器",
        },
        {
          text: "67. 作用域（Scope）有几种？什么是块级作用域？",
          link: "/interview/frontend/javascript/q7-作用域scope有几种什么是块级作用域",
        },
        {
          text: "68. 手写 `ajax` / 简易 `fetch` 封装",
          link: "/interview/frontend/javascript/q70-手写-ajax-简易-fetch-封装",
        },
        {
          text: "69. 手写 `flat`（数组扁平化）",
          link: "/interview/frontend/javascript/q71-手写-flat数组扁平化",
        },
        {
          text: "70. 手写 `柯里化 (curry)`",
          link: "/interview/frontend/javascript/q72-手写-柯里化-curry",
        },
        {
          text: "71. 手写 `compose`（函数组合，从右到左）",
          link: "/interview/frontend/javascript/q73-手写-compose函数组合从右到左",
        },
        {
          text: "72. 手写 `去重` 多种方式",
          link: "/interview/frontend/javascript/q74-手写-去重-多种方式",
        },
        {
          text: "73. 手写 `发布-订阅模式`",
          link: "/interview/frontend/javascript/q75-手写-发布-订阅模式",
        },
        {
          text: "74. 手写 `千分位格式化`",
          link: "/interview/frontend/javascript/q76-手写-千分位格式化",
        },
        {
          text: "75. 手写 `LazyMan`（经典面试题，事件循环 + 链式调用）",
          link: "/interview/frontend/javascript/q77-手写-lazyman经典面试题事件循环-链式调用",
        },
        {
          text: "76. 手写 `版本号比较`",
          link: "/interview/frontend/javascript/q78-手写-版本号比较",
        },
        {
          text: "77. 手写 `模板渲染引擎`（简易版）",
          link: "/interview/frontend/javascript/q79-手写-模板渲染引擎简易版",
        },
        {
          text: "78. 什么是闭包（Closure）？请举例说明。",
          link: "/interview/frontend/javascript/q8-什么是闭包closure请举例说明",
        },
        {
          text: "79. `typeof` 能正确判断所有类型吗？如何准确判断类型？",
          link: "/interview/frontend/javascript/q80-typeof-能正确判断所有类型吗如何准确判断类型",
        },
        {
          text: "80. 什么是作用域链（Scope Chain）？什么是词法作用域？",
          link: "/interview/frontend/javascript/q9-什么是作用域链scope-chain什么是词法作用域",
        },
      ],
    },
  ],

  // 面试题-ES新特性
  "/interview/frontend/es/": [
    {
      text: "ES新特性面试题",
      items: [
        {
          text: "1. 简述 ES2015（ES6）有哪些你常用的新特性？",
          link: "/interview/frontend/es/",
        },
        {
          text: "2. 私有字段 `#private` 是哪个版本引入的？和 `_private` 约定有什么区别？",
          link: "/interview/frontend/es/q10-私有字段-private-是哪个版本引入的和-_private-约定有什么区别",
        },
        {
          text: "3. ES Module 与 CommonJS（`require`/`module.exports`）有什么区别？",
          link: "/interview/frontend/es/q11-es-module-与-commonjsrequiremoduleexports有什么区别",
        },
        {
          text: "4. `import` 和 `require` 能混用吗？动态 `import()` 是什么？",
          link: "/interview/frontend/es/q12-import-和-require-能混用吗动态-import-是什么",
        },
        {
          text: "5. Tree Shaking 是什么？ES Module 为什么能支持 Tree Shaking？",
          link: "/interview/frontend/es/q13-tree-shaking-是什么es-module-为什么能支持-tree-shaking",
        },
        {
          text: "6. Promise 有哪些状态？如何理解「状态一旦改变就不可逆」？",
          link: "/interview/frontend/es/q14-promise-有哪些状态如何理解「状态一旦改变就不可逆」",
        },
        {
          text: "7. `Promise.all` / `allSettled` / `race` / `any` 分别什么时候用？",
          link: "/interview/frontend/es/q15-promiseall-allsettled-race-any-分别什么时候用",
        },
        {
          text: "8. async/await 是 Promise 的语法糖吗？它背后发生了什么？",
          link: "/interview/frontend/es/q16-asyncawait-是-promise-的语法糖吗它背后发生了什么",
        },
        {
          text: "9. Top-level await 是什么？（ES2022）",
          link: "/interview/frontend/es/q17-top-level-await-是什么es2022",
        },
        {
          text: "10. 什么是迭代器（Iterator）？什么是可迭代对象（Iterable）？",
          link: "/interview/frontend/es/q18-什么是迭代器iterator什么是可迭代对象iterable",
        },
        {
          text: "11. 生成器函数 `function*` 有什么用？`yield` 和 `yield*` 有什么区别？",
          link: "/interview/frontend/es/q19-生成器函数-function-有什么用yield-和-yield-有什么区别",
        },
        {
          text: "12. `var` / `let` / `const` 的区别？为什么建议默认使用 `const`？",
          link: "/interview/frontend/es/q2-var-let-const-的区别为什么建议默认使用-const",
        },
        {
          text: "13. `for...in` 和 `for...of` 有什么区别？",
          link: "/interview/frontend/es/q20-forin-和-forof-有什么区别",
        },
        {
          text: "14. `Map` 和普通对象 `Object` 有什么区别？什么时候用 `Map`？",
          link: "/interview/frontend/es/q21-map-和普通对象-object-有什么区别什么时候用-map",
        },
        {
          text: "15. `WeakMap` / `WeakSet` 与 `Map` / `Set` 有什么区别？为什么它们不能被遍历？",
          link: "/interview/frontend/es/q22-weakmap-weakset-与-map-set-有什么区别为什么它们不能被遍历",
        },
        {
          text: "16. 数组去重有几种方法？`[...new Set(arr)]` 为什么好用？",
          link: "/interview/frontend/es/q23-数组去重有几种方法new-setarr-为什么好用",
        },
        {
          text: "17. `Array.from` 和 `Array.of` 有什么用？与 `Array()` 有什么区别？",
          link: "/interview/frontend/es/q24-arrayfrom-和-arrayof-有什么用与-array-有什么区别",
        },
        {
          text: "18. 数组实例上的 `find` / `findIndex` / `findLast` / `findLastIndex`？（ES2023 新增后两个）",
          link: "/interview/frontend/es/q25-数组实例上的-find-findindex-findlast-findlastindexes2023-新增后两个",
        },
        {
          text: "19. 字符串新增了哪些好用的方法？",
          link: "/interview/frontend/es/q26-字符串新增了哪些好用的方法",
        },
        {
          text: "20. 对象新增的方法？`Object.assign` 和展开运算符 `{...a, ...b}` 有区别吗？",
          link: "/interview/frontend/es/q27-对象新增的方法objectassign-和展开运算符-a-b-有区别吗",
        },
        {
          text: "21. `Object.entries` / `Object.fromEntries` 有什么用？",
          link: "/interview/frontend/es/q28-objectentries-objectfromentries-有什么用",
        },
        {
          text: "22. 数组方法 `at()` 是什么？为什么要引入它？（ES2022）",
          link: "/interview/frontend/es/q29-数组方法-at-是什么为什么要引入它es2022",
        },
        {
          text: "23. 箭头函数 `() => {}` 和普通函数 `function() {}` 有什么区别？",
          link: "/interview/frontend/es/q3-箭头函数-和普通函数-function-有什么区别",
        },
        {
          text: "24. ES2023 新增的「不修改原数组」的方法有哪些？为什么要加？",
          link: "/interview/frontend/es/q30-es2023-新增的「不修改原数组」的方法有哪些为什么要加",
        },
        {
          text: "25. `BigInt` 解决了什么问题？如何使用？",
          link: "/interview/frontend/es/q31-bigint-解决了什么问题如何使用",
        },
        {
          text: "26. ES6 新增的 `Number` 静态方法有哪些？",
          link: "/interview/frontend/es/q32-es6-新增的-number-静态方法有哪些",
        },
        {
          text: "27. 如何比较两个浮点数「几乎相等」？",
          link: "/interview/frontend/es/q33-如何比较两个浮点数「几乎相等」",
        },
        {
          text: "28. `Proxy` 能做什么？与 `Object.defineProperty` 有什么区别？",
          link: "/interview/frontend/es/q34-proxy-能做什么与-objectdefineproperty-有什么区别",
        },
        {
          text: "29. `Reflect` 是什么？为什么要和 Proxy 一起用？",
          link: "/interview/frontend/es/q35-reflect-是什么为什么要和-proxy-一起用",
        },
        {
          text: "30. `Symbol` 是什么？有哪些用途？",
          link: "/interview/frontend/es/q36-symbol-是什么有哪些用途",
        },
        {
          text: "31. 可选链 `?.` 和空值合并 `??` 是什么？（ES2020）",
          link: "/interview/frontend/es/q37-可选链-和空值合并-是什么es2020",
        },
        {
          text: "32. 逻辑赋值运算符 `&&=` / `||=` / `??=`（ES2021）",
          link: "/interview/frontend/es/q38-逻辑赋值运算符-es2021",
        },
        {
          text: "33. 类的字段声明（Class Fields）有哪些新写法？",
          link: "/interview/frontend/es/q39-类的字段声明class-fields有哪些新写法",
        },
        {
          text: "34. 什么是解构（Destructuring）？常用写法有哪些？",
          link: "/interview/frontend/es/q4-什么是解构destructuring常用写法有哪些",
        },
        {
          text: "35. 命名捕获组（Named Capture Groups，ES2018）是什么？",
          link: "/interview/frontend/es/q40-命名捕获组named-capture-groupses2018是什么",
        },
        {
          text: "36. 数组的 `flat` / `flatMap`（ES2019）",
          link: "/interview/frontend/es/q41-数组的-flat-flatmapes2019",
        },
        {
          text: "37. `Object.fromEntries` 与 `Array.prototype.entries`（ES2019 / ES6）",
          link: "/interview/frontend/es/q42-objectfromentries-与-arrayprototypeentrieses2019-es6",
        },
        {
          text: "38. `globalThis`（ES2020）解决了什么问题？",
          link: "/interview/frontend/es/q43-globalthises2020解决了什么问题",
        },
        {
          text: "39. `Promise.withResolvers()`（ES2024）",
          link: "/interview/frontend/es/q44-promisewithresolverses2024",
        },
        {
          text: "40. 装饰器（Decorators）目前在 TC39 处于什么阶段？怎么使用？",
          link: "/interview/frontend/es/q45-装饰器decorators目前在-tc39-处于什么阶段怎么使用",
        },
        {
          text: "41. 用 ES6+ 语法重构下面这段老代码：",
          link: "/interview/frontend/es/q46-用-es6-语法重构下面这段老代码",
        },
        {
          text: "42. 写一个 `sleep(ms)`，要求能用 `await`。",
          link: "/interview/frontend/es/q47-写一个-sleepms要求能用-await",
        },
        {
          text: "43. 用 `Object.fromEntries` + `Object.entries` 对对象做 filter：",
          link: "/interview/frontend/es/q48-用-objectfromentries-objectentries-对对象做-filter",
        },
        {
          text: "44. 手写一个带并发限制的 Promise 调度器（ES2017）",
          link: "/interview/frontend/es/q49-手写一个带并发限制的-promise-调度器es2017",
        },
        {
          text: "45. 模板字符串（Template Literals）除了 `${}` 插值还有什么能力？",
          link: "/interview/frontend/es/q5-模板字符串template-literals除了-插值还有什么能力",
        },
        {
          text: "46. 你怎么看「ES 每年更新一次」的节奏？",
          link: "/interview/frontend/es/q50-你怎么看「es-每年更新一次」的节奏",
        },
        {
          text: "47. 对象字面量增强有哪些写法？",
          link: "/interview/frontend/es/q6-对象字面量增强有哪些写法",
        },
        {
          text: "48. `class` 和传统构造函数有什么区别？`class` 内部是严格模式吗？",
          link: "/interview/frontend/es/q7-class-和传统构造函数有什么区别class-内部是严格模式吗",
        },
        {
          text: "49. `extends` 继承如何使用？`super` 在构造器里为什么必须在 `this` 之前调用？",
          link: "/interview/frontend/es/q8-extends-继承如何使用super-在构造器里为什么必须在-this-之前调用",
        },
        {
          text: "50. `static` 静态方法/属性和实例方法有什么区别？静态成员能继承吗？",
          link: "/interview/frontend/es/q9-static-静态方法属性和实例方法有什么区别静态成员能继承吗",
        },
      ],
    },
  ],

  // 面试题-TypeScript
  "/interview/frontend/typescript/": [
    {
      text: "TypeScript面试题",
      items: [
        {
          text: "1. TypeScript 与 JavaScript 的关系",
          link: "/interview/frontend/typescript/",
        },
        {
          text: "2. 结构化类型 vs 名义类型",
          link: "/interview/frontend/typescript/101-结构化类型-vs-名义类型",
        },
        {
          text: "3. 协变、逆变、不变",
          link: "/interview/frontend/typescript/102-协变逆变不变",
        },
        {
          text: "4. 类型别名 vs 接口",
          link: "/interview/frontend/typescript/14-类型别名-vs-接口",
        },
        {
          text: "5. 字面量类型与字符串/数字字面量联合",
          link: "/interview/frontend/typescript/15-字面量类型与字符串数字字面量联合",
        },
        {
          text: "6. 模板字面量类型（Template Literal Types）",
          link: "/interview/frontend/typescript/24-模板字面量类型template-literal-types",
        },
        {
          text: "7. 索引类型与 `keyof`",
          link: "/interview/frontend/typescript/25-索引类型与-keyof",
        },
        {
          text: "8. 类型守卫与断言",
          link: "/interview/frontend/typescript/26-类型守卫与断言",
        },
        {
          text: "9. 枚举（Enum）与 `as const`",
          link: "/interview/frontend/typescript/28-枚举enum与-as-const",
        },
        {
          text: "10. 常用内置类型工具速查",
          link: "/interview/frontend/typescript/31-常用内置类型工具速查",
        },
        {
          text: "11. 字符串操作类型（TS 4.1+）",
          link: "/interview/frontend/typescript/32-字符串操作类型ts-41",
        },
        {
          text: "12. 类的成员修饰符",
          link: "/interview/frontend/typescript/61-类的成员修饰符",
        },
        {
          text: "13. 抽象类与接口",
          link: "/interview/frontend/typescript/62-抽象类与接口",
        },
        {
          text: "14. 可辨识联合（Discriminated Unions）",
          link: "/interview/frontend/typescript/71-可辨识联合discriminated-unions",
        },
        {
          text: "15. 类型提取模式",
          link: "/interview/frontend/typescript/72-类型提取模式",
        },
        {
          text: "16. 受控类型 vs 类型标注",
          link: "/interview/frontend/typescript/73-受控类型-vs-类型标注",
        },
        {
          text: "17. Props 类型定义",
          link: "/interview/frontend/typescript/81-props-类型定义",
        },
        {
          text: "18. useState 与泛型",
          link: "/interview/frontend/typescript/82-usestate-与泛型",
        },
        {
          text: "19. 常见错误与误解",
          link: "/interview/frontend/typescript/91-常见错误与误解",
        },
        {
          text: "20. `Add<A, B>` —— 类型级别的数字加法（借助元组长度）",
          link: "/interview/frontend/typescript/adda-b-类型级别的数字加法-借助元组长度",
        },
        {
          text: "21. `declare global`、`declare module`、`declare namespace` 的区别？",
          link: "/interview/frontend/typescript/declare-global-declare-module-declare-namespace-的区别",
        },
        {
          text: "22. `esModuleInterop` 解决了什么问题？",
          link: "/interview/frontend/typescript/esmoduleinterop-解决了什么问题",
        },
        {
          text: "23. `IsUnion<T>` —— 判断是不是联合类型",
          link: "/interview/frontend/typescript/isuniont-判断是不是联合类型",
        },
        {
          text: "24. `moduleResolution` 的不同策略？",
          link: "/interview/frontend/typescript/moduleresolution-的不同策略",
        },
        {
          text: "25. `null` 和 `undefined` 在 TS 中的行为是什么？`--strictNullChecks` 有什么影响？",
          link: "/interview/frontend/typescript/null-和-undefined-在-ts-中的行为是什么-strictnullchecks-有什么影响",
        },
        {
          text: "26. `Permutation<T>` —— 生成联合类型的全排列",
          link: "/interview/frontend/typescript/permutationt-生成联合类型的全排列",
        },
        {
          text: "27. `Pop<T>` —— 移除元组最后一个元素",
          link: "/interview/frontend/typescript/popt-移除元组最后一个元素",
        },
        {
          text: "28. `/// <reference path='...' />` 三斜线指令是什么？",
          link: "/interview/frontend/typescript/reference-path-三斜线指令是什么",
        },
        {
          text: "29. `Repeat<T, N>` —— 创建长度为 N、元素为 T 的元组",
          link: "/interview/frontend/typescript/repeatt-n-创建长度为-n-元素为-t-的元组",
        },
        {
          text: "30. `Shift<T>` —— 移除元组第一个元素",
          link: "/interview/frontend/typescript/shiftt-移除元组第一个元素",
        },
        {
          text: "31. `strict` 开启了哪些检查？",
          link: "/interview/frontend/typescript/strict-开启了哪些检查",
        },
        {
          text: "32. `target`、`module`、`lib` 分别是什么？",
          link: "/interview/frontend/typescript/target-module-lib-分别是什么",
        },
        {
          text: "33. TypeScript 如何进行类型收窄（Type Narrowing）？",
          link: "/interview/frontend/typescript/typescript-如何进行类型收窄-type-narrowing",
        },
        {
          text: "34. TypeScript 有哪些基础类型？",
          link: "/interview/frontend/typescript/typescript-有哪些基础类型",
        },
        {
          text: "35. `UnionToIntersection<U>` —— 联合变交叉",
          link: "/interview/frontend/typescript/uniontointersectionu-联合变交叉",
        },
        {
          text: "36. `void`、`never`、`unknown`、`any` 的区别？",
          link: "/interview/frontend/typescript/void-never-unknown-any-的区别",
        },
        {
          text: "37. 什么是 `.d.ts` 文件？它和 `.ts` 文件有什么区别？",
          link: "/interview/frontend/typescript/什么是-d-ts-文件-它和-ts-文件有什么区别",
        },
        {
          text: "38. 什么是交叉类型（Intersection Types）？",
          link: "/interview/frontend/typescript/什么是交叉类型-intersection-types",
        },
        {
          text: "39. 什么是映射类型？它能做什么？",
          link: "/interview/frontend/typescript/什么是映射类型-它能做什么",
        },
        {
          text: "40. 什么是条件类型？语法是什么？",
          link: "/interview/frontend/typescript/什么是条件类型-语法是什么",
        },
        {
          text: "41. 什么是泛型？为什么需要它？",
          link: "/interview/frontend/typescript/什么是泛型-为什么需要它",
        },
        {
          text: "42. 什么是联合类型（Union Types）？",
          link: "/interview/frontend/typescript/什么是联合类型-union-types",
        },
        {
          text: "43. 从入门到精通的 TypeScript 学习路线",
          link: "/interview/frontend/typescript/从入门到精通的-typescript-学习路线",
        },
        {
          text: "44. 函数重载（Function Overloads）",
          link: "/interview/frontend/typescript/函数重载-function-overloads",
        },
        {
          text: "45. 如何在函数中正确标注 `this` 类型？",
          link: "/interview/frontend/typescript/如何在函数中正确标注-this-类型",
        },
        {
          text: "46. 实现 `Get<O, P>` —— 按字符串路径访问对象类型",
          link: "/interview/frontend/typescript/实现-geto-p-按字符串路径访问对象类型",
        },
        {
          text: "47. 实现 `PathOf<T>` —— 生成对象所有可能的路径字符串",
          link: "/interview/frontend/typescript/实现-pathoft-生成对象所有可能的路径字符串",
        },
        {
          text: "48. 手写 `Concat<A, B>` —— 连接两个元组",
          link: "/interview/frontend/typescript/手写-concata-b-连接两个元组",
        },
        {
          text: "49. 手写 `DeepPartial<T>` —— 递归地将所有属性设为可选",
          link: "/interview/frontend/typescript/手写-deeppartialt-递归地将所有属性设为可选",
        },
        {
          text: "50. 手写 `DeepReadonly<T>` —— 递归地将所有属性设为只读",
          link: "/interview/frontend/typescript/手写-deepreadonlyt-递归地将所有属性设为只读",
        },
        {
          text: "51. 手写 `First<T>` —— 获取元组的第一个元素",
          link: "/interview/frontend/typescript/手写-firstt-获取元组的第一个元素",
        },
        {
          text: "52. 手写 `If<Condition, True, False>` —— 类型级别的 if",
          link: "/interview/frontend/typescript/手写-ifcondition-true-false-类型级别的-if",
        },
        {
          text: "53. 手写 `Length<T>` —— 获取元组长度",
          link: "/interview/frontend/typescript/手写-lengtht-获取元组长度",
        },
        {
          text: "54. 条件类型 + 泛型 —— 类型'函数'",
          link: "/interview/frontend/typescript/条件类型-泛型-类型函数",
        },
        {
          text: "55. 条件类型的分布式行为（Distributive Conditional Types）",
          link: "/interview/frontend/typescript/条件类型的分布式行为-distributive-conditional-types",
        },
        {
          text: "56. 泛型函数的类型推断 —— `infer` 的前置理解",
          link: "/interview/frontend/typescript/泛型函数的类型推断-infer-的前置理解",
        },
        {
          text: "57. 泛型接口、泛型类",
          link: "/interview/frontend/typescript/泛型接口-泛型类",
        },
        {
          text: "58. 泛型的默认参数",
          link: "/interview/frontend/typescript/泛型的默认参数",
        },
        {
          text: "59. 泛型约束（Constraints）",
          link: "/interview/frontend/typescript/泛型约束-constraints",
        },
        {
          text: "60. 高级映射 —— `as` 子句重新映射键（TS 4.1+）",
          link: "/interview/frontend/typescript/高级映射-as-子句重新映射键-ts-4-1",
        },
      ],
    },
  ],

  // 面试题-Vue
  "/interview/frontend/vue/": [
    {
      text: "Vue面试题",
      items: [
        {
          text: "1. Vue2 响应式原理（Object.defineProperty）",
          link: "/interview/frontend/vue/",
        },
        { text: "2. API 风格", link: "/interview/frontend/vue/api-风格" },
        {
          text: "3. computed vs watch vs methods",
          link: "/interview/frontend/vue/computed-vs-watch-vs-methods",
        },
        {
          text: "4. computed / watch / watchEffect",
          link: "/interview/frontend/vue/computed-watch-watcheffect",
        },
        {
          text: "5. computed 原理",
          link: "/interview/frontend/vue/computed-原理",
        },
        {
          text: "6. Fragments / Teleport / Suspense",
          link: "/interview/frontend/vue/fragments-teleport-suspense",
        },
        {
          text: "7. 常见面试题",
          link: "/interview/frontend/vue/nexttick-原理-常见面试题",
        },
        { text: "8. setup 函数", link: "/interview/frontend/vue/setup-函数" },
        {
          text: "9. Vue2 nextTick 实现（src/core/util/next-tick.js）",
          link: "/interview/frontend/vue/vue2-nexttick-实现srccoreutilnext-tickjs",
        },
        {
          text: "10. Vue2 实现要点（src/core/components/keep-alive.js）",
          link: "/interview/frontend/vue/vue2-实现要点srccorecomponentskeep-alivejs",
        },
        {
          text: "11. Vue2 方式汇总",
          link: "/interview/frontend/vue/vue2-方式汇总",
        },
        {
          text: "12. Vue2 渲染全流程",
          link: "/interview/frontend/vue/vue2-渲染全流程",
        },
        {
          text: "13. Vue2 生命周期选项式",
          link: "/interview/frontend/vue/vue2-生命周期选项式",
        },
        {
          text: "14. Vue2 的 Diff 算法（双端对比）",
          link: "/interview/frontend/vue/vue2-的-diff-算法双端对比",
        },
        {
          text: "15. Vue2 编译三阶段",
          link: "/interview/frontend/vue/vue2-编译三阶段",
        },
        {
          text: "16. Vue3 nextTick 简化",
          link: "/interview/frontend/vue/vue3-nexttick-简化",
        },
        { text: "17. Vue3 变化", link: "/interview/frontend/vue/vue3-变化" },
        {
          text: "18. Vue3 响应式原理（Proxy）",
          link: "/interview/frontend/vue/vue3-响应式原理proxy",
        },
        {
          text: "19. Vue3 方式汇总",
          link: "/interview/frontend/vue/vue3-方式汇总",
        },
        {
          text: "20. Vue3 渲染全流程",
          link: "/interview/frontend/vue/vue3-渲染全流程",
        },
        {
          text: "21. Vue3 生命周期（Composition API）",
          link: "/interview/frontend/vue/vue3-生命周期composition-api",
        },
        {
          text: "22. Vue3 的 Diff 优化",
          link: "/interview/frontend/vue/vue3-的-diff-优化",
        },
        {
          text: "23. Vue3 编译优化",
          link: "/interview/frontend/vue/vue3-编译优化",
        },
        { text: "24. watch 原理", link: "/interview/frontend/vue/watch-原理" },
        {
          text: "25. 为什么需要 nextTick",
          link: "/interview/frontend/vue/为什么需要-nexttick",
        },
        { text: "26. 关键差异", link: "/interview/frontend/vue/关键差异" },
        { text: "27. 其他变化", link: "/interview/frontend/vue/其他变化" },
        {
          text: "28. 常见面试题",
          link: "/interview/frontend/vue/响应式原理-常见面试题",
        },
        {
          text: "29. 响应式系统改造",
          link: "/interview/frontend/vue/响应式系统改造",
        },
        { text: "30. 核心作用", link: "/interview/frontend/vue/核心作用" },
        {
          text: "31. 核心响应式 API",
          link: "/interview/frontend/vue/核心响应式-api",
        },
        { text: "32. 编译优化", link: "/interview/frontend/vue/编译优化" },
        {
          text: "33. 自定义组合式函数（Composables）",
          link: "/interview/frontend/vue/自定义组合式函数composables",
        },
        {
          text: "34. 常见面试题",
          link: "/interview/frontend/vue/虚拟dom与diff算法-常见面试题",
        },
        {
          text: "35. 虚拟DOM是什么",
          link: "/interview/frontend/vue/虚拟dom是什么",
        },
      ],
    },
  ],

  // 面试题-React
  "/interview/frontend/react/": [
    {
      text: "React面试题",
      items: [
        {
          text: "React 基础",
          collapsed: false,
          items: [
            {
              text: "1. 什么是 React？它的核心思想是什么？",
              link: "/interview/frontend/react/11-什么是react它的核心思想是什么",
            },
            {
              text: "2. JSX 是什么？它是如何被转换的？",
              link: "/interview/frontend/react/12-jsx是什么-它是如何被转换的",
            },
            {
              text: "3. React 元素与组件的区别",
              link: "/interview/frontend/react/13-react元素与组件的区别",
            },
            {
              text: "4. Props 与 State 的区别",
              link: "/interview/frontend/react/14-props与state的区别",
            },
            {
              text: "5. 类组件与函数组件的区别",
              link: "/interview/frontend/react/15-类组件与函数组件的区别",
            },
            {
              text: "6. React 事件机制",
              link: "/interview/frontend/react/16-react事件机制",
            },
            {
              text: "7. React 中的 key 有什么作用",
              link: "/interview/frontend/react/17-react中的key有什么作用",
            },
            {
              text: "8. Ref 的作用与使用方式",
              link: "/interview/frontend/react/18-ref的作用与使用方式",
            },
          ],
        },
        {
          text: "生命周期",
          collapsed: false,
          items: [
            {
              text: "1. 类组件的生命周期",
              link: "/interview/frontend/react/21-类组件的生命周期",
            },
            {
              text: "2. 函数组件的生命周期替代方案",
              link: "/interview/frontend/react/22-函数组件的生命周期替代方案",
            },
          ],
        },
        {
          text: "Hooks",
          collapsed: false,
          items: [
            {
              text: "1. useState 的工作原理",
              link: "/interview/frontend/react/31-usestate的工作原理",
            },
            {
              text: "2. useEffect 的执行时机与依赖数组",
              link: "/interview/frontend/react/32-useeffect的执行时机与依赖数组",
            },
            {
              text: "3. useLayoutEffect 与 useEffect 的区别",
              link: "/interview/frontend/react/33-uselayouteffect与useeffect的区别",
            },
            {
              text: "4. useMemo 与 useCallback 的区别",
              link: "/interview/frontend/react/34-usememo与usecallback的区别",
            },
            {
              text: "5. useRef 的使用场景",
              link: "/interview/frontend/react/35-useref的使用场景",
            },
            {
              text: "6. useContext 的使用与性能优化",
              link: "/interview/frontend/react/36-usecontext的使用与性能优化",
            },
            {
              text: "7. useReducer 与 useState 的选择",
              link: "/interview/frontend/react/37-usereducer与usestate的选择",
            },
            {
              text: "8. 自定义 Hook",
              link: "/interview/frontend/react/38-自定义hook",
            },
            {
              text: "9. Hooks 的使用规则与底层原理",
              link: "/interview/frontend/react/39-hooks的使用规则与底层原理",
            },
          ],
        },
        {
          text: "虚拟 DOM 与 Fiber",
          collapsed: false,
          items: [
            {
              text: "1. 什么是虚拟 DOM",
              link: "/interview/frontend/react/41-什么是虚拟dom",
            },
            {
              text: "2. Diff 算法的原理与策略",
              link: "/interview/frontend/react/42-diff算法的原理与策略",
            },
            {
              text: "3. Fiber 架构",
              link: "/interview/frontend/react/43-fiber架构",
            },
          ],
        },
        {
          text: "状态管理",
          collapsed: false,
          items: [
            {
              text: "1. Context API 的使用与局限",
              link: "/interview/frontend/react/51-context-api的使用与局限",
            },
            {
              text: "2. Redux 的核心概念与工作流",
              link: "/interview/frontend/react/52-redux的核心概念与工作流",
            },
            {
              text: "3. Redux Toolkit",
              link: "/interview/frontend/react/53-redux-toolkit",
            },
            {
              text: "4. Zustand 与 Jotai",
              link: "/interview/frontend/react/54-zustand与jotai",
            },
          ],
        },
        {
          text: "性能优化",
          collapsed: false,
          items: [
            {
              text: "5. React 性能优化的常见手段",
              link: "/interview/frontend/react/61-react性能优化的常见手段",
            },
            {
              text: "6. React.memo 与浅比较",
              link: "/interview/frontend/react/62-reactmemo与浅比较",
            },
            {
              text: "7. 代码分割与懒加载",
              link: "/interview/frontend/react/63-代码分割与懒加载",
            },
          ],
        },
        {
          text: "React Router",
          collapsed: false,
          items: [
            {
              text: "1. React Router 的核心概念",
              link: "/interview/frontend/react/71-react-router的核心概念",
            },
            {
              text: "2. 路由守卫的实现",
              link: "/interview/frontend/react/72-路由守卫的实现",
            },
          ],
        },
        {
          text: "React 18 新特性",
          collapsed: false,
          items: [
            {
              text: "1. Concurrent Mode 并发模式",
              link: "/interview/frontend/react/81-concurrent-mode并发模式",
            },
            {
              text: "2. Automatic Batching 自动批处理",
              link: "/interview/frontend/react/82-automatic-batching自动批处理",
            },
            {
              text: "3. Transitions 过渡",
              link: "/interview/frontend/react/83-transitions过渡",
            },
            {
              text: "4. Suspense 与流式 SSR",
              link: "/interview/frontend/react/84-suspense与流式ssr",
            },
          ],
        },
      ],
    },
  ],

  // 面试题-Node.js
  "/interview/frontend/nodejs/": [
    {
      text: "Node.js面试题",
      items: [
        { text: "1. Node.js 是什么", link: "/interview/frontend/nodejs/" },
        {
          text: "2. `__dirname` vs `./` 的陷阱",
          link: "/interview/frontend/nodejs/__dirname-vs-的陷阱",
        },
        {
          text: "3. async / await",
          link: "/interview/frontend/nodejs/async-await",
        },
        {
          text: "4. Buffer 是什么",
          link: "/interview/frontend/nodejs/buffer-是什么",
        },
        {
          text: "5. Buffer.slice 共享内存的陷阱",
          link: "/interview/frontend/nodejs/bufferslice-共享内存的陷阱",
        },
        {
          text: "6. child_process：多进程",
          link: "/interview/frontend/nodejs/child_process多进程",
        },
        {
          text: "7. cluster：利用多核 CPU",
          link: "/interview/frontend/nodejs/cluster利用多核-cpu",
        },
        {
          text: "8. CommonJS 模块系统",
          link: "/interview/frontend/nodejs/commonjs-模块系统",
        },
        {
          text: "9. exports 和 module.exports 的区别",
          link: "/interview/frontend/nodejs/exports-和-moduleexports-的区别",
        },
        {
          text: "10. fs 模块的三种 API 风格",
          link: "/interview/frontend/nodejs/fs-模块的三种-api-风格",
        },
        {
          text: "11. 常见面试题",
          link: "/interview/frontend/nodejs/http-与网络-常见面试题",
        },
        {
          text: "12. Keep-Alive 与连接复用",
          link: "/interview/frontend/nodejs/keep-alive-与连接复用",
        },
        {
          text: "13. Node.js 中错误的传播路径",
          link: "/interview/frontend/nodejs/nodejs-中错误的传播路径",
        },
        {
          text: "14. Node.js 为什么适合高并发 I/O",
          link: "/interview/frontend/nodejs/nodejs-为什么适合高并发-io",
        },
        {
          text: "15. 常见面试题",
          link: "/interview/frontend/nodejs/nodejs-基础与运行原理-常见面试题",
        },
        {
          text: "16. Node.js 真的是单线程吗？",
          link: "/interview/frontend/nodejs/nodejs-真的是单线程吗",
        },
        {
          text: "17. npm vs yarn vs pnpm",
          link: "/interview/frontend/nodejs/npm-vs-yarn-vs-pnpm",
        },
        {
          text: "18. package.json 字段速查",
          link: "/interview/frontend/nodejs/packagejson-字段速查",
        },
        {
          text: "19. process.nextTick 与 Promise 的优先级",
          link: "/interview/frontend/nodejs/processnexttick-与-promise-的优先级",
        },
        { text: "20. Promise", link: "/interview/frontend/nodejs/promise" },
        {
          text: "21. Readable 流的两种模式",
          link: "/interview/frontend/nodejs/readable-流的两种模式",
        },
        {
          text: "22. request / response 对象",
          link: "/interview/frontend/nodejs/request-response-对象",
        },
        {
          text: "23. require 加载机制与模块缓存",
          link: "/interview/frontend/nodejs/require-加载机制与模块缓存",
        },
        {
          text: "24. SemVer（语义化版本）",
          link: "/interview/frontend/nodejs/semver语义化版本",
        },
        {
          text: "25. Stream 是什么",
          link: "/interview/frontend/nodejs/stream-是什么",
        },
        {
          text: "26. 常见面试题",
          link: "/interview/frontend/nodejs/stream-流-常见面试题",
        },
        {
          text: "27. V8 内存结构",
          link: "/interview/frontend/nodejs/v8-内存结构",
        },
        {
          text: "28. worker_threads：同进程多线程",
          link: "/interview/frontend/nodejs/worker_threads同进程多线程",
        },
        {
          text: "29. 一个最简单的 HTTP 服务器",
          link: "/interview/frontend/nodejs/一个最简单的-http-服务器",
        },
        {
          text: "30. 事件发射器（EventEmitter）",
          link: "/interview/frontend/nodejs/事件发射器eventemitter",
        },
        {
          text: "31. 事件循环是什么",
          link: "/interview/frontend/nodejs/事件循环是什么",
        },
        {
          text: "32. 内存泄漏常见原因 & 排查",
          link: "/interview/frontend/nodejs/内存泄漏常见原因-排查",
        },
        {
          text: "33. 单线程的优缺点",
          link: "/interview/frontend/nodejs/单线程的优缺点",
        },
        {
          text: "34. 各阶段详解",
          link: "/interview/frontend/nodejs/各阶段详解",
        },
        {
          text: "35. 回调函数（Callback）",
          link: "/interview/frontend/nodejs/回调函数callback",
        },
        { text: "36. 字符编码", link: "/interview/frontend/nodejs/字符编码" },
        {
          text: "37. 实用安全工具",
          link: "/interview/frontend/nodejs/实用安全工具",
        },
        {
          text: "38. 对象模式（Object Mode）",
          link: "/interview/frontend/nodejs/对象模式object-mode",
        },
        {
          text: "39. 常见安全问题",
          link: "/interview/frontend/nodejs/常见安全问题",
        },
        {
          text: "40. 常见面试题",
          link: "/interview/frontend/nodejs/异步编程模型-常见面试题",
        },
        {
          text: "41. 微任务（Microtasks）",
          link: "/interview/frontend/nodejs/微任务microtasks",
        },
        { text: "42. 性能分析", link: "/interview/frontend/nodejs/性能分析" },
        {
          text: "43. 文件描述符（File Descriptor）",
          link: "/interview/frontend/nodejs/文件描述符file-descriptor",
        },
        {
          text: "44. 浏览器 EventLoop vs Node.js EventLoop",
          link: "/interview/frontend/nodejs/浏览器-eventloop-vs-nodejs-eventloop",
        },
        {
          text: "45. 经典例题：setTimeout vs setImmediate",
          link: "/interview/frontend/nodejs/经典例题settimeout-vs-setimmediate",
        },
        {
          text: "46. 背压（Backpressure）",
          link: "/interview/frontend/nodejs/背压backpressure",
        },
        {
          text: "47. 调试：inspector",
          link: "/interview/frontend/nodejs/调试inspector",
        },
        {
          text: "48. 路径处理：path 模块",
          link: "/interview/frontend/nodejs/路径处理path-模块",
        },
        {
          text: "49. 错误优先的最佳实践",
          link: "/interview/frontend/nodejs/错误优先的最佳实践",
        },
        {
          text: "50. 阻塞事件循环的示例与规避",
          link: "/interview/frontend/nodejs/阻塞事件循环的示例与规避",
        },
        {
          text: "51. 阻塞事件循环的识别",
          link: "/interview/frontend/nodejs/阻塞事件循环的识别",
        },
      ],
    },
  ],

  // 面试题-工程化
  "/interview/frontend/engineering/": [
    {
      text: "工程化面试题",
      items: [
        {
          text: "构建工具通用题",
          collapsed: false,
          items: [
            {
              text: "1. 前端为什么需要构建工具？你用过哪些？",
              link: "/interview/frontend/engineering/11-前端为什么需要构建工具",
            },
            {
              text: "2. 什么是打包（Bundling）？Bundler 做了哪些事？",
              link: "/interview/frontend/engineering/12-什么是打包-bundler-做了哪些事",
            },
            {
              text: "3. Tree Shaking 的原理是什么？有什么前提？",
              link: "/interview/frontend/engineering/13-tree-shaking-的原理是什么",
            },
            {
              text: "4. Code Splitting / 代码分割怎么做？有几种策略？",
              link: "/interview/frontend/engineering/14-code-splitting-代码分割怎么做",
            },
            {
              text: "5. Source Map 有哪些类型？如何选择？",
              link: "/interview/frontend/engineering/15-source-map-有哪些类型如何选择",
            },
          ],
        },
        {
          text: "Webpack",
          collapsed: false,
          items: [
            {
              text: "1. Webpack 的核心概念",
              link: "/interview/frontend/engineering/21-webpack-的核心概念",
            },
            {
              text: "2. 手写一个简单的 Loader",
              link: "/interview/frontend/engineering/22-手写一个简单的-loader",
            },
            {
              text: "3. 手写一个简单的 Plugin",
              link: "/interview/frontend/engineering/23-手写一个简单的-plugin",
            },
            {
              text: "4. Webpack 5 有什么新东西？为什么要升级？",
              link: "/interview/frontend/engineering/24-webpack-5-有什么新东西",
            },
            {
              text: "5. 你是怎么优化 Webpack 构建速度的？",
              link: "/interview/frontend/engineering/25-怎么优化-webpack-构建速度",
            },
            {
              text: "6. 你是怎么分析 Bundle 体积的？有哪些工具？",
              link: "/interview/frontend/engineering/26-怎么分析-bundle-体积",
            },
          ],
        },
        {
          text: "Rollup",
          collapsed: false,
          items: [
            {
              text: "1. Rollup 和 Webpack 有什么区别？各自适合什么场景？",
              link: "/interview/frontend/engineering/31-rollup-和-webpack-有什么区别",
            },
            {
              text: "2. Rollup 的 external / globals 是干什么的？",
              link: "/interview/frontend/engineering/32-rollup-的-external-globals-是干什么的",
            },
          ],
        },
        {
          text: "Vite",
          collapsed: false,
          items: [
            {
              text: "1. Vite 的原理是什么？为什么快？",
              link: "/interview/frontend/engineering/41-vite-的原理是什么-为什么快",
            },
            {
              text: "2. 你在 Vite 配置里一般会写什么？",
              link: "/interview/frontend/engineering/42-vite-配置里一般会写什么",
            },
            {
              text: "3. Vite 里 optimizeDeps 是干什么的？",
              link: "/interview/frontend/engineering/43-vite-里-optimizedeps-是干什么的",
            },
          ],
        },
        {
          text: "esbuild / SWC / Rspack",
          collapsed: false,
          items: [
            {
              text: "1. 你知道 esbuild 吗？它为什么这么快？",
              link: "/interview/frontend/engineering/51-esbuild-为什么这么快",
            },
            {
              text: "2. SWC 和 Babel 有什么区别？什么时候会选 SWC？",
              link: "/interview/frontend/engineering/52-swc-和-babel-有什么区别",
            },
            {
              text: "3. Rspack 了解吗？和 Webpack 是什么关系？",
              link: "/interview/frontend/engineering/53-rspack-和-webpack-是什么关系",
            },
          ],
        },
        {
          text: "性能优化",
          collapsed: false,
          items: [
            {
              text: "1. 首屏性能怎么优化？从哪些维度思考？",
              link: "/interview/frontend/engineering/61-首屏性能怎么优化",
            },
            {
              text: "2. 你怎么决定哪些库应该 vendor chunk，哪些应该按需加载？",
              link: "/interview/frontend/engineering/62-怎么决定哪些库应该-vendor-chunk",
            },
          ],
        },
        {
          text: "包管理与依赖",
          collapsed: false,
          items: [
            {
              text: "1. npm / yarn / pnpm 的区别？pnpm 为什么更快？",
              link: "/interview/frontend/engineering/71-npm-yarn-pnpm-的区别",
            },
            {
              text: "2. dependencies / devDependencies / peerDependencies / optionalDependencies 有什么区别？",
              link: "/interview/frontend/engineering/72-package-json-里各种-dependencies-的区别",
            },
            {
              text: "3. 什么是 SemVer（语义化版本）？",
              link: "/interview/frontend/engineering/73-什么是-semver-语义化版本",
            },
          ],
        },
        {
          text: "Monorepo",
          collapsed: false,
          items: [
            {
              text: "1. 你了解 Monorepo 吗？什么时候用？用过哪些工具？",
              link: "/interview/frontend/engineering/81-你了解-monorepo-吗",
            },
          ],
        },
        {
          text: "代码质量工具链",
          collapsed: false,
          items: [
            {
              text: "1. ESLint / Prettier / Stylelint / Husky 等工具怎么协作？",
              link: "/interview/frontend/engineering/91-eslint-prettier-等工具怎么协作",
            },
            {
              text: "2. ESLint 怎么写自定义规则？",
              link: "/interview/frontend/engineering/92-eslint-怎么写自定义规则",
            },
          ],
        },
        {
          text: "CI/CD 与部署",
          collapsed: false,
          items: [
            {
              text: "1. 你们前端项目的 CI 流程大概是怎样的？",
              link: "/interview/frontend/engineering/101-前端项目的-ci-流程",
            },
            {
              text: "2. 你是怎么部署前端项目的？Nginx 里有哪些关键配置？",
              link: "/interview/frontend/engineering/102-怎么部署前端项目-nginx-配置",
            },
            {
              text: "3. 什么是 BFF？前端为什么需要它？",
              link: "/interview/frontend/engineering/103-什么是-bff-前端为什么需要它",
            },
          ],
        },
        {
          text: "环境与规范",
          collapsed: false,
          items: [
            {
              text: "1. 你怎么管理多个 Node 版本？团队怎么统一 Node 版本？",
              link: "/interview/frontend/engineering/111-怎么管理多个-node-版本",
            },
            {
              text: '2. 你怎么设计"新项目脚手架"？',
              link: "/interview/frontend/engineering/112-怎么设计新项目脚手架",
            },
          ],
        },
        {
          text: "TypeScript 工程化",
          collapsed: false,
          items: [
            {
              text: "1. tsconfig.json 里哪些字段最重要？",
              link: "/interview/frontend/engineering/121-tsconfig-json-里哪些字段最重要",
            },
            {
              text: "2. 你怎么发布一个 TypeScript 库到 npm？",
              link: "/interview/frontend/engineering/122-怎么发布一个-typescript-库到-npm",
            },
          ],
        },
        {
          text: "监控与错误上报",
          collapsed: false,
          items: [
            {
              text: "1. 你是怎么做前端错误监控和性能监控的？",
              link: "/interview/frontend/engineering/131-怎么做前端错误监控和性能监控",
            },
          ],
        },
        {
          text: "安全",
          collapsed: false,
          items: [
            {
              text: "1. 前端能做哪些安全措施？",
              link: "/interview/frontend/engineering/141-前端能做哪些安全措施",
            },
          ],
        },
        {
          text: "微前端",
          collapsed: false,
          items: [
            {
              text: "1. 微前端是什么？用过哪些方案？",
              link: "/interview/frontend/engineering/151-微前端是什么-用过哪些方案",
            },
          ],
        },
        {
          text: "Server-Side 相关",
          collapsed: false,
          items: [
            {
              text: "1. SSR / SSG / ISR / CSR 的区别？",
              link: "/interview/frontend/engineering/161-ssr-ssg-isr-csr-的区别",
            },
          ],
        },
        {
          text: "实战场景题",
          collapsed: false,
          items: [
            {
              text: "1. 接手老项目，Webpack 构建要 5 分钟，首屏加载 10MB，你从哪里下手优化？",
              link: "/interview/frontend/engineering/171-接手老项目如何优化",
            },
            {
              text: "2. 团队决定从 Webpack 迁移到 Vite，你会做哪些验证与风险评估？",
              link: "/interview/frontend/engineering/172-从-webpack-迁移到-vite-的验证与风险评估",
            },
          ],
        },
        {
          text: "深挖题（高级面试）",
          collapsed: false,
          items: [
            {
              text: "1. Webpack 的 Module、Chunk、Bundle、Asset 四者是什么关系？",
              link: "/interview/frontend/engineering/181-webpack-的-module-chunk-bundle-asset-关系",
            },
            {
              text: "2. 为什么 Webpack 5 不再自动 polyfill Node 模块？",
              link: "/interview/frontend/engineering/182-webpack-5-不再自动-polyfill-node-模块",
            },
            {
              text: "3. Rollup 的 Treeshaking 和 Webpack 的 Treeshaking 实现上有什么差异？",
              link: "/interview/frontend/engineering/183-rollup-和-webpack-的-treeshaking-差异",
            },
            {
              text: "4. 如果没有构建工具，你能手写一个简单的模块加载器吗？",
              link: "/interview/frontend/engineering/184-手写一个简单的模块加载器",
            },
            {
              text: '5. 怎么设计一个"组件库的按需加载"方案？',
              link: "/interview/frontend/engineering/185-怎么设计组件库的按需加载方案",
            },
            {
              text: "6. HTTP/2 有什么变化？对前端构建策略有什么影响？",
              link: "/interview/frontend/engineering/186-http2-对前端构建策略的影响",
            },
            {
              text: "7. 什么是 Module Federation？适用场景？",
              link: "/interview/frontend/engineering/187-什么是-module-federation",
            },
          ],
        },
        {
          text: "学习与选型建议",
          collapsed: false,
          items: [
            {
              text: "1. 面对这么多前端工具，你是怎么学习和选型的？",
              link: "/interview/frontend/engineering/191-怎么学习和选型前端工具",
            },
          ],
        },
      ],
    },
  ],

  // 前端学习-首页
  "/learn/frontend/": [
    {
      text: "前端学习",
      items: [{ text: "HTML", link: "/learn/frontend/" }],
    },
  ],
};
