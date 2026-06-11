---
title: 异步编程
---

# 异步编程

> **异步编程**是 JavaScript 的核心特性，允许在不阻塞主线程的情况下执行耗时操作。

---

## 一、同步与异步

### 1. 同步执行

```javascript
console.log('Start');
console.log('Middle');
console.log('End');
// 输出顺序：Start -> Middle -> End
```

### 2. 异步执行

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Async');
}, 1000);

console.log('End');
// 输出顺序：Start -> End -> Async
```

---

## 二、回调函数

### 1. 基本概念

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: 'Alice', age: 25 };
    callback(null, data);
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', data);
  }
});
```

### 2. 回调地狱（Callback Hell）

```javascript
// 多层嵌套，难以维护
fetchUser((err, user) => {
  if (err) throw err;
  
  fetchOrders(user.id, (err, orders) => {
    if (err) throw err;
    
    fetchProducts(orders[0].productId, (err, product) => {
      if (err) throw err;
      
      console.log(product);
    });
  });
});
```

---

## 三、Promise

### 1. Promise 基础

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve({ name: 'Alice', age: 25 });
    } else {
      reject(new Error('Failed to fetch data'));
    }
  }, 1000);
});

promise
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

### 2. Promise 状态

```javascript
// Promise 有三种状态：
// 1. Pending（待定）：初始状态
// 2. Fulfilled（已兑现）：操作成功完成
// 3. Rejected（已拒绝）：操作失败

// 状态一旦改变就不可逆转
```

### 3. Promise 链式调用

```javascript
fetchUser()
  .then(user => fetchOrders(user.id))
  .then(orders => fetchProducts(orders[0].productId))
  .then(product => console.log(product))
  .catch(error => console.error('Error:', error));
```

### 4. Promise.all()

```javascript
const promise1 = fetch('/api/users');
const promise2 = fetch('/api/orders');
const promise3 = fetch('/api/products');

Promise.all([promise1, promise2, promise3])
  .then(responses => {
    const [users, orders, products] = responses;
    console.log('All data fetched');
  })
  .catch(error => console.error('One of the promises failed'));
```

### 5. Promise.race()

```javascript
const fastPromise = new Promise(resolve => setTimeout(resolve, 100));
const slowPromise = new Promise(resolve => setTimeout(resolve, 1000));

Promise.race([fastPromise, slowPromise])
  .then(() => console.log('Fast promise won'));
```

### 6. Promise.allSettled()（ES2020）

```javascript
const promises = [
  fetch('/api/users'),
  fetch('/api/invalid')
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Success:', result.value);
      } else {
        console.error('Failed:', result.reason);
      }
    });
  });
```

---

## 四、async/await（ES2017）

### 1. 基本用法

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// 使用
fetchData().then(data => console.log(data));
```

### 2. 并行执行

```javascript
async function fetchAllData() {
  const [users, orders] = await Promise.all([
    fetch('/api/users').then(res => res.json()),
    fetch('/api/orders').then(res => res.json())
  ]);
  
  return { users, orders };
}
```

### 3. 错误处理

```javascript
async function safeFetch() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error('Caught error:', error);
  }
}

// 或者使用 .catch()
fetchData().catch(error => console.error(error));
```

---

## 五、事件循环（Event Loop）

### 1. 调用栈（Call Stack）

```javascript
function greet() {
  console.log('Hello');
}

function sayGoodbye() {
  console.log('Goodbye');
}

greet();
sayGoodbye();
// 调用栈：[greet] -> [sayGoodbye] -> []
```

### 2. 任务队列（Task Queue）

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 输出顺序：1 -> 4 -> 3 -> 2
```

### 3. 宏任务与微任务

```javascript
// 宏任务（Macro Task）：setTimeout, setInterval, I/O
// 微任务（Micro Task）：Promise.then, MutationObserver, queueMicrotask

console.log('Start');

setTimeout(() => {
  console.log('Timeout'); // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('Promise'); // 微任务
});

queueMicrotask(() => {
  console.log('Microtask'); // 微任务
});

console.log('End');

// 输出顺序：Start -> End -> Promise -> Microtask -> Timeout
```

### 4. 事件循环流程

```text
┌─────────────────────────────────────────────────────────────┐
│                    Event Loop 流程                          │
├─────────────────────────────────────────────────────────────┤
│  1. 执行同步代码（调用栈）                                   │
│  2. 清空微任务队列（Microtask Queue）                        │
│  3. 执行一个宏任务（Macrotask Queue）                       │
│  4. 清空微任务队列                                          │
│  5. 重复步骤 3-4                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 六、异步迭代器（ES2018）

### 1. for await...of

```javascript
async function* generateNumbers() {
  yield 1;
  yield 2;
  yield 3;
}

async function process() {
  for await (const num of generateNumbers()) {
    console.log(num); // 1, 2, 3
  }
}
```

### 2. Promise.all 与异步迭代

```javascript
const urls = ['/api/a', '/api/b', '/api/c'];

async function fetchAll(urls) {
  const promises = urls.map(url => fetch(url).then(res => res.json()));
  const results = await Promise.all(promises);
  return results;
}
```

---

## 七、实用技巧

### 1. 延迟执行

```javascript
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function doSomething() {
  await delay(1000);
  console.log('Delayed');
}
```

### 2. 超时控制

```javascript
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
  return Promise.race([promise, timeout]);
}

// 使用
withTimeout(fetch('/api/data'), 5000)
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 3. 重试机制

```javascript
async function fetchWithRetry(url, retries = 3) {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    if (retries > 0) {
      await delay(1000);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}
```

---

## 八、本章小结与最佳实践

✅ **推荐做法**：

1. **使用 Promise 或 async/await** 替代回调函数；
2. **使用 async/await 编写更可读的异步代码**；
3. **使用 Promise.all() 并行执行多个异步操作**；
4. **在 async 函数中使用 try/catch 处理错误**；
5. **理解宏任务和微任务的执行顺序**；
6. **使用 Promise.allSettled() 处理需要全部完成的场景**。

❌ **避免做法**：

1. 嵌套多层回调函数（回调地狱）；
2. 忽略 Promise 的错误处理；
3. 在循环中串行执行可以并行的异步操作；
4. 不理解事件循环就编写复杂的异步代码。

下一章我们将学习 **ES6+ 新特性**，掌握现代 JavaScript 的核心语法。