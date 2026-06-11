# ES6+ 实战应用

本章通过实际案例展示 ES6+ 特性在日常开发中的应用。

## 1. 异步编程实战

### 1.1 并发控制

```javascript
// 限制并发请求数量
async function asyncPool(limit, items, iteratorFn) {
  const results = [];
  const executing = new Set();

  for (const [index, item] of items.entries()) {
    const p = Promise.resolve().then(() => iteratorFn(item, index));
    results.push(p);
    executing.add(p);

    const clean = () => executing.delete(p);
    p.then(clean, clean);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// 使用：最多同时 3 个请求
const urls = ["/api/1", "/api/2", "/api/3", "/api/4", "/api/5"];
const results = await asyncPool(3, urls, url => fetch(url).then(r => r.json()));
```

### 1.2 带超时的请求

```javascript
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("请求超时")), timeout)
    ),
  ]);
}

// 使用
try {
  const data = await fetchWithTimeout("/api/data", {}, 3000);
} catch (err) {
  console.error(err.message); // "请求超时"
}
```

### 1.3 重试机制

```javascript
async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2); // 指数退避
  }
}

// 使用
const data = await retry(
  () => fetch("/api/data").then(r => r.json()),
  3,
  1000
);
```

---

## 2. 数据处理实战

### 2.1 数组方法链式调用

```javascript
const employees = [
  { name: "Alice", department: "Engineering", salary: 90000 },
  { name: "Bob", department: "Engineering", salary: 85000 },
  { name: "Charlie", department: "Marketing", salary: 75000 },
  { name: "Diana", department: "Marketing", salary: 80000 },
  { name: "Eve", department: "Engineering", salary: 95000 },
];

// 工程部门薪资统计
const engineeringStats = employees
  .filter(emp => emp.department === "Engineering")
  .map(emp => emp.salary)
  .reduce((stats, salary) => {
    stats.total += salary;
    stats.count++;
    stats.avg = stats.total / stats.count;
    stats.max = Math.max(stats.max ?? 0, salary);
    stats.min = Math.min(stats.min ?? Infinity, salary);
    return stats;
  }, { total: 0, count: 0, avg: 0, max: null, min: null });

// 按部门分组
const byDepartment = Object.groupBy(employees, emp => emp.department);
// {
//   Engineering: [{ name: "Alice", ... }, { name: "Bob", ... }, { name: "Eve", ... }],
//   Marketing: [{ name: "Charlie", ... }, { name: "Diana", ... }]
// }
```

### 2.2 深拷贝

```javascript
// 利用结构化克隆（现代浏览器）
const original = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
const clone = structuredClone(original);

// 递归深拷贝
function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (cache.has(obj)) return cache.get(obj);

  const result = Array.isArray(obj) ? [] : {};
  cache.set(obj, result);

  for (const key of Reflect.ownKeys(obj)) {
    result[key] = deepClone(obj[key], cache);
  }

  return result;
}
```

### 2.3 防抖和节流

```javascript
// 防抖 - 延迟执行，重复调用重置计时器
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流 - 固定间隔执行
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用
const handleSearch = debounce(query => {
  fetch(`/api/search?q=${query}`);
}, 500);

const handleScroll = throttle(() => {
  console.log("滚动位置:", window.scrollY);
}, 200);
```

---

## 3. 对象操作实战

### 3.1 对象深度合并

```javascript
function deepMerge(target, ...sources) {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        target[key] = target[key] ?? {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

const defaults = {
  api: { baseURL: "/api", timeout: 3000 },
  ui: { theme: "light", lang: "zh" },
};

const userConfig = {
  api: { timeout: 5000 },
  ui: { theme: "dark" },
};

const config = deepMerge({}, defaults, userConfig);
// { api: { baseURL: "/api", timeout: 5000 }, ui: { theme: "dark", lang: "zh" } }
```

### 3.2 对象路径访问

```javascript
// 安全访问嵌套属性
function get(obj, path, defaultValue = undefined) {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }
  return result ?? defaultValue;
}

const data = {
  user: {
    name: "Alice",
    address: {
      city: "Beijing",
    },
    tags: ["admin", "user"],
  },
};

get(data, "user.name");          // "Alice"
get(data, "user.address.city");  // "Beijing"
get(data, "user.tags[0]");      // "admin"
get(data, "user.phone", "N/A"); // "N/A"

// 设置嵌套属性
function set(obj, path, value) {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] ??= isNaN(keys[i + 1]) ? {} : [];
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return obj;
}
```

---

## 4. 函数式编程实践

### 4.1 组合与管道

```javascript
// compose - 从右到左执行
const compose = (...fns) =>
  fns.reduce((f, g) => (...args) => f(g(...args)));

// pipe - 从左到右执行
const pipe = (...fns) =>
  fns.reduce((f, g) => (...args) => g(f(...args)));

// 使用
const add10 = x => x + 10;
const multiply2 = x => x * 2;
const subtract3 = x => x - 3;

const calculate = pipe(add10, multiply2, subtract3);
calculate(5); // (5 + 10) * 2 - 3 = 27

const calculate2 = compose(subtract3, multiply2, add10);
calculate2(5); // 27（结果相同，执行方向相反）
```

### 4.2 柯里化

```javascript
// 通用柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// 使用
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);    // 6
add(1, 2)(3);    // 6
add(1)(2, 3);    // 6
add(1, 2, 3);    // 6

// 实际用途：创建可复用的函数
const filter = curry((predicate, arr) => arr.filter(predicate));
const map = curry((fn, arr) => arr.map(fn));

const getAdults = filter(user => user.age >= 18);
const getNames = map(user => user.name);

const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 16 },
  { name: "Charlie", age: 30 },
];

const adultNames = pipe(getAdults, getNames)(users);
// ["Alice", "Charlie"]
```

---

## 5. 模块化实战

### 5.1 动态导入

```javascript
// 按需加载模块
async function loadEditor() {
  const { Editor } = await import("./editor.js");
  return new Editor();
}

// 条件加载
async function loadPolyfill() {
  if (!window.IntersectionObserver) {
    await import("intersection-observer-polyfill");
  }
}

// 路由懒加载
const routes = {
  "/home": () => import("./pages/home.js"),
  "/about": () => import("./pages/about.js"),
  "/contact": () => import("./pages/contact.js"),
};

async function navigate(path) {
  const loader = routes[path];
  if (loader) {
    const page = await loader();
    page.render();
  }
}
```

### 5.2 模块模式

```javascript
// config.js - 配置模块
const config = Object.freeze({
  api: {
    baseURL: import.meta.env.VITE_API_URL ?? "/api",
    timeout: 5000,
  },
  features: {
    darkMode: true,
    i18n: true,
  },
});

export default config;

// logger.js - 日志模块
class Logger {
  #level = "info";

  constructor(level = "info") {
    this.#level = level;
  }

  #log(level, ...args) {
    const levels = ["debug", "info", "warn", "error"];
    if (levels.indexOf(level) >= levels.indexOf(this.#level)) {
      console[level](`[${level.toUpperCase()}]`, ...args);
    }
  }

  debug(...args) { this.#log("debug", ...args); }
  info(...args) { this.#log("info", ...args); }
  warn(...args) { this.#log("warn", ...args); }
  error(...args) { this.#log("error", ...args); }
}

export const logger = new Logger();
```

---

## 小结

| 实战场景 | 使用的 ES6+ 特性 |
|---------|------------------|
| 并发控制 | Promise.all/race, async/await |
| 数据处理 | 解构, 展开运算符, 可选链, 空值合并 |
| 防抖节流 | 箭头函数, 闭包, 剩余参数 |
| 函数式编程 | 箭头函数, 高阶函数, 柯里化 |
| 模块化 | import/export, 动态导入, 私有字段 |

返回：[ES6+ 入门 →](/web/JavaScript/es6/)
