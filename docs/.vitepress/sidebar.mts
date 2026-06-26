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
          text: "Vue2 基础",
          collapsed: false,
          items: [
            {
              text: "1. v-model 原理与双向绑定",
              link: "/interview/frontend/vue/101-vue2-vmodel-原理与双向绑定",
            },
            {
              text: "2. slot 插槽原理与演变",
              link: "/interview/frontend/vue/102-vue2-slot-插槽原理与演变",
            },
            {
              text: "3. 自定义指令原理与钩子",
              link: "/interview/frontend/vue/103-vue2-自定义指令原理与钩子",
            },
            {
              text: "4. mixin 原理与弊端（为什么 Vue3 舍弃）",
              link: "/interview/frontend/vue/104-vue2-mixin-原理与弊端",
            },
            {
              text: "5. 过滤器原理（为什么 Vue3 移除）",
              link: "/interview/frontend/vue/105-vue2-过滤器原理-为什么vue3移除",
            },
            {
              text: "6. provide/inject 原理与响应式陷阱",
              link: "/interview/frontend/vue/106-vue2-provide-inject-原理与响应式陷阱",
            },
            {
              text: "7. 事件总线原理与弊端",
              link: "/interview/frontend/vue/107-vue2-事件总线原理与弊端",
            },
            {
              text: "8. v-for 中 key 的作用与 diff",
              link: "/interview/frontend/vue/108-vue2-vfor-key的作用与diff",
            },
          ],
        },
        {
          text: "Vue2 源码相关",
          collapsed: false,
          items: [
            {
              text: "1. Observer/Dep/Watcher 三件套源码",
              link: "/interview/frontend/vue/201-vue2-observer-dep-watcher-三件套源码",
            },
            {
              text: "2. 数组方法重写源码",
              link: "/interview/frontend/vue/202-vue2-数组方法重写源码",
            },
            {
              text: "3. 异步更新队列源码",
              link: "/interview/frontend/vue/203-vue2-异步更新队列源码",
            },
            {
              text: "4. 编译器静态优化原理",
              link: "/interview/frontend/vue/204-vue2-编译器静态优化原理",
            },
            {
              text: "5. patch 双端 diff 源码",
              link: "/interview/frontend/vue/205-vue2-patch-双端diff源码",
            },
            {
              text: "6. keep-alive LRU 缓存源码",
              link: "/interview/frontend/vue/206-vue2-keepalive-lru缓存源码",
            },
            {
              text: "7. 模板编译生成 render 函数过程",
              link: "/interview/frontend/vue/207-vue2-模板编译生成render函数过程",
            },
            {
              text: "8. nextTick 微任务降级策略源码",
              link: "/interview/frontend/vue/208-vue2-nexttick-微任务降级策略源码",
            },
          ],
        },
        {
          text: "Vue3 基础",
          collapsed: false,
          items: [
            {
              text: "1. Composition API 设计动机",
              link: "/interview/frontend/vue/301-vue3-composition-api-设计动机",
            },
            {
              text: "2. ref vs reactive 的选择",
              link: "/interview/frontend/vue/302-vue3-ref-vs-reactive-的选择",
            },
            {
              text: "3. toRef / toRefs / toRaw 原理",
              link: "/interview/frontend/vue/303-vue3-toref-torefs-toraw-原理",
            },
            {
              text: "4. shallow 系列 API 原理",
              link: "/interview/frontend/vue/304-vue3-shallow系列api原理",
            },
            {
              text: "5. customRef 原理与防抖实战",
              link: "/interview/frontend/vue/305-vue3-customref-原理与防抖实战",
            },
            {
              text: "6. watch vs watchEffect 原理与选择",
              link: "/interview/frontend/vue/306-vue3-watch-vs-watcheffect-原理与选择",
            },
            {
              text: "7. defineProps / defineEmits / defineExpose 原理",
              link: "/interview/frontend/vue/307-vue3-defineprops-defineemits-defineexpose-原理",
            },
            {
              text: "8. Suspense 原理与异步组件",
              link: "/interview/frontend/vue/308-vue3-suspense-原理与异步组件",
            },
            {
              text: "9. Teleport 原理",
              link: "/interview/frontend/vue/309-vue3-teleport-原理",
            },
            {
              text: "10. Fragment 原理与多根节点",
              link: "/interview/frontend/vue/310-vue3-fragment-原理与多根节点",
            },
          ],
        },
        {
          text: "Vue3 源码相关",
          collapsed: false,
          items: [
            {
              text: "1. effect 调度器与响应式原理",
              link: "/interview/frontend/vue/401-vue3-effect-调度器与响应式原理",
            },
            {
              text: "2. 编译优化：静态提升 / PatchFlag / Block Tree",
              link: "/interview/frontend/vue/402-vue3-编译优化-静态提升-patchflag-block-tree",
            },
            {
              text: "3. Diff 算法：最长递增子序列",
              link: "/interview/frontend/vue/403-vue3-diff-最长递增子序列",
            },
            {
              text: "4. 渲染器原理与自定义渲染器",
              link: "/interview/frontend/vue/404-vue3-渲染器原理与自定义渲染器",
            },
            {
              text: "5. setup 语法糖编译原理",
              link: "/interview/frontend/vue/405-vue3-setup语法糖编译原理",
            },
            {
              text: "6. 异步组件与 defineAsyncComponent 原理",
              link: "/interview/frontend/vue/406-vue3-异步组件与defineasynccomponent原理",
            },
            {
              text: "7. KeepAlive 原理与缓存策略",
              link: "/interview/frontend/vue/407-vue3-keepalive-原理与缓存策略",
            },
            {
              text: "8. 响应式嵌套 effect 与依赖清理",
              link: "/interview/frontend/vue/408-vue3-响应式嵌套effect与依赖清理",
            },
            {
              text: "9. ref 自动解包原理",
              link: "/interview/frontend/vue/409-vue3-ref自动解包原理",
            },
            {
              text: "10. 编译器优化：缓存与 v-memo",
              link: "/interview/frontend/vue/410-vue3-编译器优化-缓存与v-memo",
            },
          ],
        },
        {
          text: "原有题目（保留）",
          collapsed: true,
          items: [
            {
              text: "1. Vue2 响应式原理（Object.defineProperty）",
              link: "/interview/frontend/vue/",
            },
            {
              text: "2. API 风格",
              link: "/interview/frontend/vue/api-风格",
            },
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
              text: "7. nextTick 原理常见面试题",
              link: "/interview/frontend/vue/nexttick-原理-常见面试题",
            },
            {
              text: "8. setup 函数",
              link: "/interview/frontend/vue/setup-函数",
            },
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
            {
              text: "17. Vue3 变化",
              link: "/interview/frontend/vue/vue3-变化",
            },
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
            {
              text: "24. watch 原理",
              link: "/interview/frontend/vue/watch-原理",
            },
            {
              text: "25. 为什么需要 nextTick",
              link: "/interview/frontend/vue/为什么需要-nexttick",
            },
            {
              text: "26. 关键差异",
              link: "/interview/frontend/vue/关键差异",
            },
            {
              text: "27. 其他变化",
              link: "/interview/frontend/vue/其他变化",
            },
            {
              text: "28. 响应式原理常见面试题",
              link: "/interview/frontend/vue/响应式原理-常见面试题",
            },
            {
              text: "29. 响应式系统改造",
              link: "/interview/frontend/vue/响应式系统改造",
            },
            {
              text: "30. 核心作用",
              link: "/interview/frontend/vue/核心作用",
            },
            {
              text: "31. 核心响应式 API",
              link: "/interview/frontend/vue/核心响应式-api",
            },
            {
              text: "32. 编译优化",
              link: "/interview/frontend/vue/编译优化",
            },
            {
              text: "33. 自定义组合式函数（Composables）",
              link: "/interview/frontend/vue/自定义组合式函数composables",
            },
            {
              text: "34. 虚拟 DOM 与 Diff 算法常见面试题",
              link: "/interview/frontend/vue/虚拟dom与diff算法-常见面试题",
            },
            {
              text: "35. 虚拟DOM是什么",
              link: "/interview/frontend/vue/虚拟dom是什么",
            },
          ],
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

  // 桌面端开发
  "/web/desktop/": [
    {
      text: "桌面端开发",
      items: [{ text: "总览与学习路线", link: "/web/desktop/" }],
    },
    {
      text: "Web 技术栈",
      collapsed: false,
      items: [
        { text: "01 Electron", link: "/web/desktop/01-electron/" },
        { text: "02 Tauri", link: "/web/desktop/02-tauri/" },
        { text: "03 NW.js", link: "/web/desktop/03-nwjs/" },
        { text: "05 Wails", link: "/web/desktop/05-wails/" },
      ],
    },
    {
      text: "自绘 UI / 原生",
      collapsed: true,
      items: [
        {
          text: "04 Flutter Desktop",
          link: "/web/desktop/04-flutter-desktop/",
        },
        { text: "06 Qt", link: "/web/desktop/06-qt/" },
      ],
    },
    {
      text: "移动端扩展",
      collapsed: true,
      items: [
        { text: "07 React Native", link: "/web/desktop/07-react-native/" },
      ],
    },
  ],

  // JavaScript 模块
  "/web/JavaScript/": [
    {
      text: "JavaScript 相关",
      items: [{ text: "总览与学习路线", link: "/web/JavaScript/" }],
    },
    {
      text: "JavaScript",
      collapsed: false,
      items: [
        { text: "JS 入门", link: "/web/JavaScript/javascript/" },
        { text: "01 基础", link: "/web/JavaScript/javascript/01-basics/" },
        {
          text: "02 函数与作用域",
          link: "/web/JavaScript/javascript/02-functions/",
        },
        {
          text: "03 对象与原型",
          link: "/web/JavaScript/javascript/03-objects/",
        },
        { text: "04 异步编程", link: "/web/JavaScript/javascript/04-async/" },
        {
          text: "06 数组方法与高阶函数",
          link: "/web/JavaScript/javascript/06-arrays/",
        },
        { text: "07 模块化", link: "/web/JavaScript/javascript/07-modules/" },
        {
          text: "08 最佳实践",
          link: "/web/JavaScript/javascript/08-best-practices/",
        },
      ],
    },
    {
      text: "TypeScript",
      collapsed: true,
      items: [
        { text: "TS 入门", link: "/web/JavaScript/typescript/" },
        { text: "01 基础", link: "/web/JavaScript/typescript/01-basics/" },
        { text: "02 类型系统", link: "/web/JavaScript/typescript/02-types/" },
        { text: "03 进阶", link: "/web/JavaScript/typescript/03-advanced/" },
        {
          text: "04 最佳实践",
          link: "/web/JavaScript/typescript/04-best-practices/",
        },
      ],
    },
    {
      text: "ES6+ 新特性",
      collapsed: true,
      items: [
        { text: "ES6+ 入门", link: "/web/JavaScript/es6/" },
        { text: "01 核心特性", link: "/web/JavaScript/es6/01-core/" },
        { text: "02 现代特性", link: "/web/JavaScript/es6/02-modern/" },
        { text: "03 内置扩展", link: "/web/JavaScript/es6/03-builtins/" },
        { text: "04 实战练习", link: "/web/JavaScript/es6/04-practice/" },
      ],
    },
  ],

  // 样式模块-首页
  "/web/styles/": [
    {
      text: "样式模块",
      items: [{ text: "总览与学习路线", link: "/web/styles/" }],
    },
    {
      text: "CSS 基础",
      collapsed: false,
      items: [
        { text: "CSS 入门", link: "/web/styles/css/" },
        { text: "01 基础语法", link: "/web/styles/css/01-basics/" },
        { text: "02 选择器", link: "/web/styles/css/02-selectors/" },
        { text: "03 盒模型", link: "/web/styles/css/03-box-model/" },
        { text: "04 布局", link: "/web/styles/css/04-layout/" },
        { text: "05 响应式", link: "/web/styles/css/05-responsive/" },
        { text: "06 动画", link: "/web/styles/css/06-animation/" },
        { text: "07 预处理器", link: "/web/styles/css/07-preprocessor/" },
        { text: "08 最佳实践", link: "/web/styles/css/08-best-practices/" },
      ],
    },
    {
      text: "Sass / SCSS",
      collapsed: true,
      items: [
        { text: "Sass 入门", link: "/web/styles/sass/" },
        { text: "01 入门与安装", link: "/web/styles/sass/01-intro/" },
        { text: "02 变量与数据类型", link: "/web/styles/sass/02-variables/" },
        { text: "03 嵌套与作用域", link: "/web/styles/sass/03-nesting/" },
        { text: "04 Mixin 与 Include", link: "/web/styles/sass/04-mixin/" },
        { text: "05 继承与占位符", link: "/web/styles/sass/05-extend/" },
        { text: "06 函数与运算", link: "/web/styles/sass/06-functions/" },
        { text: "07 控制指令", link: "/web/styles/sass/07-control/" },
        { text: "08 模块化与 @use", link: "/web/styles/sass/08-modules/" },
        { text: "09 最佳实践", link: "/web/styles/sass/09-best-practices/" },
      ],
    },
    {
      text: "Less",
      collapsed: true,
      items: [
        { text: "Less 入门", link: "/web/styles/less/" },
        { text: "01 入门与安装", link: "/web/styles/less/01-intro/" },
        { text: "02 变量", link: "/web/styles/less/02-variables/" },
        { text: "03 嵌套", link: "/web/styles/less/03-nesting/" },
        { text: "04 Mixin", link: "/web/styles/less/04-mixin/" },
        { text: "05 函数与运算", link: "/web/styles/less/05-functions/" },
        { text: "06 守卫与循环", link: "/web/styles/less/06-guard-loop/" },
        { text: "07 最佳实践", link: "/web/styles/less/07-best-practices/" },
      ],
    },
    {
      text: "Tailwind CSS",
      collapsed: true,
      items: [
        { text: "Tailwind 入门", link: "/web/styles/tailwind/" },
        { text: "01 入门与配置", link: "/web/styles/tailwind/01-intro/" },
        { text: "02 工具类速查", link: "/web/styles/tailwind/02-utilities/" },
        {
          text: "03 响应式与状态",
          link: "/web/styles/tailwind/03-responsive/",
        },
        { text: "04 自定义主题", link: "/web/styles/tailwind/04-theme/" },
        {
          text: "05 @apply 与组件抽取",
          link: "/web/styles/tailwind/05-apply/",
        },
        { text: "06 插件与生态", link: "/web/styles/tailwind/06-plugins/" },
        {
          text: "07 最佳实践",
          link: "/web/styles/tailwind/07-best-practices/",
        },
      ],
    },
    {
      text: "现代方案",
      collapsed: true,
      items: [
        { text: "现代方案总览", link: "/web/styles/modern/" },
        { text: "01 CSS Modules", link: "/web/styles/modern/01-css-modules/" },
        { text: "02 CSS-in-JS", link: "/web/styles/modern/02-css-in-js/" },
        { text: "03 CSS 新特性", link: "/web/styles/modern/03-new-features/" },
        {
          text: "04 方案对比与选型",
          link: "/web/styles/modern/04-comparison/",
        },
      ],
    },
  ],

  // Node.js 模块-首页
  "/web/nodejs/": [
    {
      text: "Node.js",
      items: [{ text: "总览与学习路线", link: "/web/nodejs/" }],
    },
    {
      text: "Node.js 基础",
      collapsed: false,
      items: [
        { text: "01 入门与安装", link: "/web/nodejs/basics/01-intro/" },
        { text: "02 模块系统", link: "/web/nodejs/basics/02-modules/" },
        { text: "03 npm 包管理", link: "/web/nodejs/basics/03-npm/" },
        { text: "04 核心模块", link: "/web/nodejs/basics/04-core-modules/" },
        { text: "05 事件循环", link: "/web/nodejs/basics/05-event-loop/" },
        { text: "06 Stream 流", link: "/web/nodejs/basics/06-stream/" },
        { text: "07 Buffer", link: "/web/nodejs/basics/07-buffer/" },
        { text: "08 进程与子进程", link: "/web/nodejs/basics/08-process/" },
      ],
    },
    {
      text: "Express",
      collapsed: true,
      items: [
        { text: "Express 入门", link: "/web/nodejs/express/" },
        { text: "01 入门与路由", link: "/web/nodejs/express/01-intro/" },
        { text: "02 中间件机制", link: "/web/nodejs/express/02-middleware/" },
        {
          text: "03 请求与响应",
          link: "/web/nodejs/express/03-request-response/",
        },
        {
          text: "04 错误处理",
          link: "/web/nodejs/express/04-error-handling/",
        },
        {
          text: "05 最佳实践",
          link: "/web/nodejs/express/05-best-practices/",
        },
      ],
    },
    {
      text: "Koa",
      collapsed: true,
      items: [
        { text: "Koa 入门", link: "/web/nodejs/koa/" },
        { text: "01 入门与 Context", link: "/web/nodejs/koa/01-intro/" },
        {
          text: "02 中间件（洋葱模型）",
          link: "/web/nodejs/koa/02-middleware/",
        },
        { text: "03 路由与常用中间件", link: "/web/nodejs/koa/03-routing/" },
        { text: "04 最佳实践", link: "/web/nodejs/koa/04-best-practices/" },
      ],
    },
    {
      text: "NestJS",
      collapsed: true,
      items: [
        { text: "NestJS 入门", link: "/web/nodejs/nestjs/" },
        { text: "01 入门与 CLI", link: "/web/nodejs/nestjs/01-intro/" },
        { text: "02 模块与依赖注入", link: "/web/nodejs/nestjs/02-modules/" },
        {
          text: "03 Controller / Provider",
          link: "/web/nodejs/nestjs/03-providers/",
        },
        {
          text: "04 中间件 / 守卫 / 拦截器",
          link: "/web/nodejs/nestjs/04-middleware/",
        },
        {
          text: "05 最佳实践",
          link: "/web/nodejs/nestjs/05-best-practices/",
        },
      ],
    },
    {
      text: "数据库",
      collapsed: true,
      items: [
        { text: "数据库总览", link: "/web/nodejs/database/" },
        { text: "01 MySQL", link: "/web/nodejs/database/01-mysql/" },
        { text: "02 MongoDB", link: "/web/nodejs/database/02-mongodb/" },
        { text: "03 Redis", link: "/web/nodejs/database/03-redis/" },
        { text: "04 ORM", link: "/web/nodejs/database/04-orm/" },
      ],
    },
    {
      text: "工程化与部署",
      collapsed: true,
      items: [
        { text: "工程化总览", link: "/web/nodejs/engineering/" },
        { text: "01 PM2 进程管理", link: "/web/nodejs/engineering/01-pm2/" },
        { text: "02 Docker 部署", link: "/web/nodejs/engineering/02-docker/" },
        { text: "03 测试", link: "/web/nodejs/engineering/03-testing/" },
        { text: "04 安全", link: "/web/nodejs/engineering/04-security/" },
        {
          text: "05 性能优化",
          link: "/web/nodejs/engineering/05-performance/",
        },
      ],
    },
  ],

  // 小程序
  "/web/miniprogram/": [
    {
      text: "小程序",
      items: [
        { text: "总览与学习路径", link: "/web/miniprogram/" },
        {
          text: "01 创建小程序",
          link: "/web/miniprogram/01-create/",
        },
        {
          text: "02 项目结构与配置",
          link: "/web/miniprogram/02-structure/",
        },
        {
          text: "03 开发详解",
          link: "/web/miniprogram/03-development/",
        },
        {
          text: "04 部署与发布",
          link: "/web/miniprogram/04-deploy/",
        },
        {
          text: "05 跨端开发",
          link: "/web/miniprogram/05-cross-platform/",
        },
      ],
    },
  ],

  // React 核心模块
  "/web/react/": [
    {
      text: "React",
      items: [{ text: "总览与学习路线", link: "/web/react/" }],
    },
    {
      text: "React 基础",
      collapsed: false,
      items: [
        { text: "React 基础入门", link: "/web/react/basics/" },
        { text: "01 React 简介", link: "/web/react/basics/01-intro/" },
        { text: "02 JSX 语法", link: "/web/react/basics/02-jsx/" },
        { text: "03 组件与 Props", link: "/web/react/basics/03-components/" },
        {
          text: "04 State 与事件",
          link: "/web/react/basics/04-state-events/",
        },
        { text: "05 生命周期", link: "/web/react/basics/05-lifecycle/" },
      ],
    },
    {
      text: "React Hooks",
      collapsed: true,
      items: [
        { text: "Hooks 入门", link: "/web/react/hooks/" },
        { text: "01 useState", link: "/web/react/hooks/01-usestate/" },
        { text: "02 useEffect", link: "/web/react/hooks/02-useeffect/" },
        { text: "03 useRef", link: "/web/react/hooks/03-useref/" },
        { text: "04 useContext", link: "/web/react/hooks/04-usecontext/" },
        {
          text: "05 useMemo / useCallback",
          link: "/web/react/hooks/05-usememo-usecallback/",
        },
        { text: "06 useReducer", link: "/web/react/hooks/06-usereducer/" },
        {
          text: "07 自定义 Hooks",
          link: "/web/react/hooks/07-custom-hooks/",
        },
      ],
    },
    {
      text: "React 进阶",
      collapsed: true,
      items: [
        { text: "React 进阶", link: "/web/react/advanced/" },
        { text: "01 Context", link: "/web/react/advanced/01-context/" },
        { text: "02 Refs", link: "/web/react/advanced/02-refs/" },
        { text: "03 高阶组件", link: "/web/react/advanced/03-hoc/" },
        {
          text: "04 Render Props",
          link: "/web/react/advanced/04-render-props/",
        },
        {
          text: "05 错误边界",
          link: "/web/react/advanced/05-error-boundaries/",
        },
        { text: "06 Portals", link: "/web/react/advanced/06-portals/" },
        { text: "07 Suspense", link: "/web/react/advanced/07-suspense/" },
      ],
    },
    {
      text: "性能优化",
      collapsed: true,
      items: [
        { text: "性能优化", link: "/web/react/performance/" },
        { text: "01 虚拟 DOM", link: "/web/react/performance/01-virtual-dom/" },
        { text: "02 memo 与记忆化", link: "/web/react/performance/02-memo/" },
        {
          text: "03 并发模式",
          link: "/web/react/performance/03-concurrent/",
        },
        {
          text: "04 性能优化实践",
          link: "/web/react/performance/04-optimization/",
        },
      ],
    },
    {
      text: "设计模式",
      collapsed: true,
      items: [
        { text: "设计模式", link: "/web/react/patterns/" },
        {
          text: "01 复合组件模式",
          link: "/web/react/patterns/01-compound/",
        },
        {
          text: "02 自定义 Hooks 模式",
          link: "/web/react/patterns/02-custom-hooks/",
        },
        { text: "03 Provider 模式", link: "/web/react/patterns/03-provider/" },
      ],
    },
    {
      text: "测试",
      collapsed: true,
      items: [
        { text: "测试", link: "/web/react/testing/" },
        { text: "01 Jest", link: "/web/react/testing/01-jest/" },
        {
          text: "02 Testing Library",
          link: "/web/react/testing/02-testing-library/",
        },
      ],
    },
    {
      text: "最佳实践",
      collapsed: true,
      items: [
        { text: "最佳实践", link: "/web/react/best-practices/" },
        {
          text: "01 项目结构",
          link: "/web/react/best-practices/01-project-structure/",
        },
        {
          text: "02 代码风格",
          link: "/web/react/best-practices/02-code-style/",
        },
        {
          text: "03 TypeScript",
          link: "/web/react/best-practices/03-typescript/",
        },
      ],
    },
    {
      text: "🆕 React 19 新特性",
      collapsed: false,
      items: [
        {
          text: "React 19 总览",
          link: "/web/react/react19/",
        },
        {
          text: "01 新 Hooks（use/useActionState/useOptimistic/useFormStatus）",
          link: "/web/react/react19/01-new-hooks/",
        },
        {
          text: "02 Actions 与表单",
          link: "/web/react/react19/02-actions/",
        },
        {
          text: "03 Server Components 与 Server Actions",
          link: "/web/react/react19/03-server-components/",
        },
        {
          text: "04 React Compiler",
          link: "/web/react/react19/04-react-compiler/",
        },
        {
          text: "05 API 变化",
          link: "/web/react/react19/05-api-changes/",
        },
        {
          text: "06 从 React 18 迁移",
          link: "/web/react/react19/06-migration/",
        },
      ],
    },
  ],

  // Git 版本控制
  "/git/": [
    {
      text: "Git 版本控制",
      items: [{ text: "Git 学习指南", link: "/git/" }],
    },
    {
      text: "基础与进阶",
      collapsed: false,
      items: [
        { text: "01 基础与核心命令", link: "/git/01-basics/" },
        { text: "02 工作流与分支策略", link: "/git/02-workflow/" },
        { text: "03 进阶与实战技巧", link: "/git/03-advanced/" },
      ],
    },
  ],

  // 数据库
  "/database/": [
    {
      text: "数据库",
      items: [{ text: "数据库学习指南", link: "/database/" }],
    },
    {
      text: "数据库学习",
      collapsed: false,
      items: [
        { text: "01 MySQL 基础与进阶", link: "/database/01-mysql/" },
        { text: "02 Redis 缓存与数据结构", link: "/database/02-redis/" },
        { text: "03 MongoDB 文档型数据库", link: "/database/03-mongodb/" },
      ],
    },
  ],

  // Nginx
  "/nginx/": [
    {
      text: "Nginx",
      items: [{ text: "Nginx 学习指南", link: "/nginx/" }],
    },
    {
      text: "Nginx 学习",
      collapsed: false,
      items: [
        { text: "01 基础与配置", link: "/nginx/01-basics/" },
        { text: "02 反向代理与负载均衡", link: "/nginx/02-reverse-proxy/" },
        { text: "03 性能优化与安全", link: "/nginx/03-optimization/" },
      ],
    },
  ],

  // Vue 生态
  "/web/vue-ecosystem/": [
    {
      text: "Vue 生态",
      items: [{ text: "生态总览", link: "/web/vue-ecosystem/" }],
    },
    {
      text: "Vue 2",
      collapsed: false,
      items: [
        { text: "Vue 2 学习指南", link: "/web/vue-ecosystem/vue2/" },
        {
          text: "01 基础与组件",
          link: "/web/vue-ecosystem/vue2/01-basics/",
        },
        {
          text: "02 进阶与最佳实践",
          link: "/web/vue-ecosystem/vue2/02-advanced/",
        },
      ],
    },
    {
      text: "Vue 3",
      collapsed: false,
      items: [
        { text: "Vue 3 学习指南", link: "/web/vue-ecosystem/vue3/" },
        {
          text: "01 Composition API 进阶",
          link: "/web/vue-ecosystem/vue3/01-composition-advanced/",
        },
        {
          text: "02 响应式原理",
          link: "/web/vue-ecosystem/vue3/02-reactivity/",
        },
        {
          text: "03 新特性与迁移",
          link: "/web/vue-ecosystem/vue3/03-new-features/",
        },
      ],
    },
    {
      text: "Vue 源码",
      collapsed: true,
      items: [
        { text: "源码学习指南", link: "/web/vue-ecosystem/source-code/" },
        {
          text: "01 响应式源码",
          link: "/web/vue-ecosystem/source-code/01-reactivity/",
        },
        {
          text: "02 虚拟 DOM 与 Diff",
          link: "/web/vue-ecosystem/source-code/02-virtual-dom/",
        },
        {
          text: "03 编译器原理",
          link: "/web/vue-ecosystem/source-code/03-compiler/",
        },
      ],
    },
    {
      text: "Vue Router",
      collapsed: true,
      items: [
        {
          text: "Vue Router 路由管理",
          link: "/web/vue-ecosystem/vue-router/",
        },
      ],
    },
    {
      text: "Pinia",
      collapsed: true,
      items: [{ text: "Pinia 状态管理", link: "/web/vue-ecosystem/pinia/" }],
    },
    {
      text: "Vuex",
      collapsed: true,
      items: [{ text: "Vuex 状态管理", link: "/web/vue-ecosystem/vuex/" }],
    },
    {
      text: "VueUse",
      collapsed: true,
      items: [
        { text: "VueUse 组合式工具库", link: "/web/vue-ecosystem/vueuse/" },
      ],
    },
  ],

  "/web/react-ecosystem/": [
    {
      text: "React 生态",
      items: [{ text: "生态总览", link: "/web/react-ecosystem/" }],
    },
    {
      text: "React Router",
      collapsed: false,
      items: [
        { text: "React Router", link: "/web/react-ecosystem/react-router/" },
        {
          text: "01 基础",
          link: "/web/react-ecosystem/react-router/01-basics/",
        },
        {
          text: "02 嵌套路由",
          link: "/web/react-ecosystem/react-router/02-nested/",
        },
        {
          text: "03 导航",
          link: "/web/react-ecosystem/react-router/03-navigation/",
        },
        {
          text: "04 路由守卫",
          link: "/web/react-ecosystem/react-router/04-guards/",
        },
      ],
    },
    {
      text: "Redux",
      collapsed: true,
      items: [
        { text: "Redux", link: "/web/react-ecosystem/redux/" },
        { text: "01 基础", link: "/web/react-ecosystem/redux/01-basics/" },
        {
          text: "02 Redux Toolkit",
          link: "/web/react-ecosystem/redux/02-toolkit/",
        },
        {
          text: "03 异步操作",
          link: "/web/react-ecosystem/redux/03-async/",
        },
        {
          text: "04 最佳实践",
          link: "/web/react-ecosystem/redux/04-best-practices/",
        },
      ],
    },
    {
      text: "Zustand",
      collapsed: true,
      items: [
        { text: "Zustand", link: "/web/react-ecosystem/zustand/" },
        { text: "01 基础", link: "/web/react-ecosystem/zustand/01-basics/" },
        {
          text: "02 进阶",
          link: "/web/react-ecosystem/zustand/02-advanced/",
        },
      ],
    },
    {
      text: "React Query",
      collapsed: true,
      items: [
        { text: "React Query", link: "/web/react-ecosystem/react-query/" },
        {
          text: "01 基础",
          link: "/web/react-ecosystem/react-query/01-basics/",
        },
        {
          text: "02 查询",
          link: "/web/react-ecosystem/react-query/02-queries/",
        },
        {
          text: "03 变更",
          link: "/web/react-ecosystem/react-query/03-mutations/",
        },
        {
          text: "04 最佳实践",
          link: "/web/react-ecosystem/react-query/04-best-practices/",
        },
      ],
    },
    {
      text: "Next.js",
      collapsed: true,
      items: [
        { text: "Next.js", link: "/web/react-ecosystem/nextjs/" },
        { text: "01 基础", link: "/web/react-ecosystem/nextjs/01-basics/" },
        { text: "02 路由", link: "/web/react-ecosystem/nextjs/02-routing/" },
        {
          text: "03 数据获取",
          link: "/web/react-ecosystem/nextjs/03-data-fetching/",
        },
        {
          text: "04 部署",
          link: "/web/react-ecosystem/nextjs/04-deployment/",
        },
      ],
    },
  ],

  // 前端架构-首页
  "/web/architecture/": [
    {
      text: "前端架构",
      items: [{ text: "总览与学习路线", link: "/web/architecture/" }],
    },
    {
      text: "设计模式",
      collapsed: false,
      items: [
        { text: "设计模式总览", link: "/web/architecture/design-patterns/" },
        {
          text: "01 创建型模式",
          link: "/web/architecture/design-patterns/01-creational/",
        },
        {
          text: "02 结构型模式",
          link: "/web/architecture/design-patterns/02-structural/",
        },
        {
          text: "03 行为型模式",
          link: "/web/architecture/design-patterns/03-behavioral/",
        },
        {
          text: "04 前端应用",
          link: "/web/architecture/design-patterns/04-frontend-application/",
        },
      ],
    },
    {
      text: "架构模式",
      collapsed: true,
      items: [
        {
          text: "架构模式总览",
          link: "/web/architecture/architecture-patterns/",
        },
        {
          text: "01 MVC/MVP/MVVM",
          link: "/web/architecture/architecture-patterns/01-mvc-mvp-mvvm/",
        },
        {
          text: "02 组件化架构",
          link: "/web/architecture/architecture-patterns/02-component-based/",
        },
        {
          text: "03 微前端",
          link: "/web/architecture/architecture-patterns/03-micro-frontends/",
        },
        {
          text: "04 Monorepo",
          link: "/web/architecture/architecture-patterns/04-monorepo/",
        },
        {
          text: "05 Islands 架构",
          link: "/web/architecture/architecture-patterns/05-islands/",
        },
      ],
    },
    {
      text: "代码规范",
      collapsed: true,
      items: [
        { text: "代码规范总览", link: "/web/architecture/code-standards/" },
        {
          text: "01 ESLint",
          link: "/web/architecture/code-standards/01-eslint/",
        },
        {
          text: "02 Prettier",
          link: "/web/architecture/code-standards/02-prettier/",
        },
        {
          text: "03 Git Commit 规范",
          link: "/web/architecture/code-standards/03-git-commit/",
        },
        {
          text: "04 TypeScript 规范",
          link: "/web/architecture/code-standards/04-typescript/",
        },
        {
          text: "05 代码审查",
          link: "/web/architecture/code-standards/05-code-review/",
        },
      ],
    },
    {
      text: "测试",
      collapsed: true,
      items: [
        { text: "测试总览", link: "/web/architecture/testing/" },
        {
          text: "01 单元测试",
          link: "/web/architecture/testing/01-unit-testing/",
        },
        {
          text: "02 集成测试",
          link: "/web/architecture/testing/02-integration-testing/",
        },
        {
          text: "03 E2E 测试",
          link: "/web/architecture/testing/03-e2e-testing/",
        },
        {
          text: "04 Mock 与 Stub",
          link: "/web/architecture/testing/04-mock-stub/",
        },
        {
          text: "05 测试覆盖率",
          link: "/web/architecture/testing/05-coverage/",
        },
      ],
    },
  ],

  // 网络相关
  "/web/network/": [
    {
      text: "网络相关",
      items: [{ text: "总览与学习路线", link: "/web/network/" }],
    },
    {
      text: "HTTP 协议",
      collapsed: false,
      items: [{ text: "01 HTTP 协议", link: "/web/network/01-http/" }],
    },
    {
      text: "HTTPS",
      collapsed: true,
      items: [{ text: "02 HTTPS 原理", link: "/web/network/02-https/" }],
    },
    {
      text: "WebSocket",
      collapsed: true,
      items: [
        { text: "03 WebSocket 实时通信", link: "/web/network/03-websocket/" },
      ],
    },
    {
      text: "网络安全",
      collapsed: true,
      items: [{ text: "04 网络安全基础", link: "/web/network/04-security/" }],
    },
  ],

  // 浏览器相关
  "/web/browser/": [
    {
      text: "浏览器相关",
      items: [{ text: "总览与学习路线", link: "/web/browser/" }],
    },
    {
      text: "浏览器原理",
      collapsed: false,
      items: [{ text: "01 浏览器原理", link: "/web/browser/01-principle/" }],
    },
    {
      text: "Web API",
      collapsed: true,
      items: [{ text: "02 Web API", link: "/web/browser/02-web-api/" }],
    },
    {
      text: "性能优化",
      collapsed: true,
      items: [{ text: "03 性能优化", link: "/web/browser/03-performance/" }],
    },
    {
      text: "浏览器存储",
      collapsed: true,
      items: [{ text: "04 浏览器存储", link: "/web/browser/04-storage/" }],
    },
  ],

  // 前端工程化
  "/web/engineering/": [
    {
      text: "前端工程化",
      items: [{ text: "总览与学习路线", link: "/web/engineering/" }],
    },
    {
      text: "构建工具",
      collapsed: false,
      items: [
        { text: "01 Webpack", link: "/web/engineering/01-webpack/" },
        { text: "02 Vite", link: "/web/engineering/02-vite/" },
        { text: "03 Rollup", link: "/web/engineering/03-rollup/" },
      ],
    },
    {
      text: "工程化实践",
      collapsed: true,
      items: [
        {
          text: "04 包管理器",
          link: "/web/engineering/04-package-manager/",
        },
        { text: "05 CI/CD", link: "/web/engineering/05-ci-cd/" },
        {
          text: "06 代码规范与工具链",
          link: "/web/engineering/06-code-quality/",
        },
      ],
    },
  ],
};
