---
title: 数组方法与高阶函数
---

# 数组方法与高阶函数

> **高阶函数**是指接受函数作为参数或返回函数的函数。数组方法是函数式编程的核心工具。

---

## 一、数组基础方法

### 1. 添加/删除元素

```javascript
const arr = [1, 2, 3];

// push：在末尾添加
arr.push(4); // [1, 2, 3, 4]

// pop：删除末尾元素
arr.pop(); // 4，arr = [1, 2, 3]

// unshift：在开头添加
arr.unshift(0); // [0, 1, 2, 3]

// shift：删除开头元素
arr.shift(); // 0，arr = [1, 2, 3]

// splice：删除/插入元素
arr.splice(1, 1); // 删除索引1开始的1个元素，arr = [1, 3]
arr.splice(1, 0, 2); // 在索引1处插入2，arr = [1, 2, 3]
```

### 2. 连接与截取

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];

// concat：连接数组
const combined = arr1.concat(arr2); // [1, 2, 3, 4]

// slice：截取数组（不修改原数组）
const sliced = combined.slice(1, 3); // [2, 3]

// join：转换为字符串
combined.join('-'); // '1-2-3-4'
```

### 3. 查找元素

```javascript
const arr = [1, 2, 3, 4, 5];

// indexOf：查找索引
arr.indexOf(3); // 2
arr.indexOf(6); // -1

// lastIndexOf：从后查找
arr.lastIndexOf(3); // 2

// includes：检查是否包含
arr.includes(3); // true
arr.includes(6); // false
```

---

## 二、高阶函数概念

### 1. 什么是高阶函数

```javascript
// 接受函数作为参数
function applyOperation(numbers, operation) {
  return numbers.map(operation);
}

const doubled = applyOperation([1, 2, 3], x => x * 2); // [2, 4, 6]

// 返回函数
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
double(5); // 10
```

### 2. 纯函数

```javascript
// 纯函数：相同输入总是产生相同输出，无副作用
function add(a, b) {
  return a + b;
}

// 非纯函数：有副作用（修改外部状态）
let total = 0;
function addToTotal(value) {
  total += value;
  return total;
}
```

---

## 三、常用数组高阶方法

### 1. forEach

```javascript
const arr = [1, 2, 3];

// 遍历数组，无返回值
arr.forEach((item, index, array) => {
  console.log(`Index ${index}: ${item}`);
});
// Index 0: 1
// Index 1: 2
// Index 2: 3
```

### 2. map

```javascript
const arr = [1, 2, 3];

// 转换数组，返回新数组
const doubled = arr.map(x => x * 2); // [2, 4, 6]

// 对象数组转换
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];
const names = users.map(user => user.name); // ['Alice', 'Bob']
```

### 3. filter

```javascript
const arr = [1, 2, 3, 4, 5];

// 过滤数组，返回满足条件的元素
const evens = arr.filter(x => x % 2 === 0); // [2, 4]

// 对象数组过滤
const adults = users.filter(user => user.age >= 18);
```

### 4. reduce

```javascript
const arr = [1, 2, 3, 4, 5];

// 累加求和
const sum = arr.reduce((acc, curr) => acc + curr, 0); // 15

// 累乘
const product = arr.reduce((acc, curr) => acc * curr, 1); // 120

// 找出最大值
const max = arr.reduce((acc, curr) => Math.max(acc, curr), -Infinity); // 5

// 转换为对象
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
const userById = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});
// { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' } }
```

### 5. find

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// 查找第一个满足条件的元素
const alice = users.find(user => user.name === 'Alice');
// { id: 1, name: 'Alice' }

// 找不到返回 undefined
const charlie = users.find(user => user.name === 'Charlie'); // undefined
```

### 6. findIndex

```javascript
const arr = [10, 20, 30, 40];

// 查找第一个满足条件的索引
const index = arr.findIndex(x => x > 25); // 2

// 找不到返回 -1
const notFound = arr.findIndex(x => x > 100); // -1
```

### 7. some

```javascript
const arr = [1, 2, 3, 4, 5];

// 是否有至少一个满足条件
const hasEven = arr.some(x => x % 2 === 0); // true
const hasNegative = arr.some(x => x < 0); // false
```

### 8. every

```javascript
const arr = [1, 2, 3, 4, 5];

// 是否所有元素都满足条件
const allPositive = arr.every(x => x > 0); // true
const allEven = arr.every(x => x % 2 === 0); // false
```

### 9. sort

```javascript
const arr = [3, 1, 4, 2, 5];

// 默认按字符串排序（不推荐）
arr.sort(); // [1, 2, 3, 4, 5]（偶然正确）

// 数字排序
arr.sort((a, b) => a - b); // 升序 [1, 2, 3, 4, 5]
arr.sort((a, b) => b - a); // 降序 [5, 4, 3, 2, 1]

// 对象数组排序
const users = [
  { name: 'Bob', age: 30 },
  { name: 'Alice', age: 25 }
];
users.sort((a, b) => a.age - b.age); // 按年龄升序
```

---

## 四、链式调用

```javascript
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true },
  { name: 'David', age: 20, active: false }
];

// 链式调用：过滤活跃用户 -> 提取名字 -> 转换为大写
const activeUserNames = users
  .filter(user => user.active)
  .map(user => user.name)
  .map(name => name.toUpperCase());

// ['ALICE', 'CHARLIE']
```

---

## 五、函数式编程思想

### 1. 声明式编程

```javascript
// 命令式：告诉计算机怎么做
const numbers = [1, 2, 3, 4, 5];
const evenSquares = [];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    evenSquares.push(numbers[i] * numbers[i]);
  }
}

// 声明式：告诉计算机要什么
const evenSquares2 = numbers
  .filter(x => x % 2 === 0)
  .map(x => x * x);
```

### 2. 不可变性

```javascript
// 避免直接修改原数组
const arr = [1, 2, 3];

// 错误：直接修改
arr[0] = 0;

// 正确：返回新数组
const newArr = arr.map((val, index) => index === 0 ? 0 : val);
```

### 3. 组合函数

```javascript
// 小函数组合成大函数
const double = x => x * 2;
const addOne = x => x + 1;

// 组合：先加1再翻倍
const addOneThenDouble = x => double(addOne(x));

addOneThenDouble(5); // 12
```

---

## 六、实用示例

### 1. 数据转换

```javascript
const rawData = [
  { id: '1', name: 'Alice', age: '25' },
  { id: '2', name: 'Bob', age: '30' }
];

// 转换为规范化的数据
const normalized = rawData.map(item => ({
  id: parseInt(item.id),
  name: item.name,
  age: parseInt(item.age)
}));
```

### 2. 数据统计

```javascript
const orders = [
  { product: 'A', price: 100, quantity: 2 },
  { product: 'B', price: 50, quantity: 3 },
  { product: 'A', price: 100, quantity: 1 }
];

// 计算总销售额
const totalSales = orders.reduce((acc, order) => {
  return acc + order.price * order.quantity;
}, 0); // 200 + 150 + 100 = 450

// 按产品分组统计
const salesByProduct = orders.reduce((acc, order) => {
  acc[order.product] = (acc[order.product] || 0) + order.price * order.quantity;
  return acc;
}, {}); // { A: 300, B: 150 }
```

### 3. 数组去重

```javascript
const arr = [1, 2, 2, 3, 3, 3];

// 方法1：使用 Set
const unique = [...new Set(arr)]; // [1, 2, 3]

// 方法2：使用 filter
const unique2 = arr.filter((val, index, self) => {
  return self.indexOf(val) === index;
});
```

### 4. 扁平化数组

```javascript
const nested = [1, [2, [3, [4]]]];

// 方法1：使用 flat()
const flat = nested.flat(Infinity); // [1, 2, 3, 4]

// 方法2：使用 reduce
function flatten(arr) {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val);
  }, []);
}
```

---

## 七、本章小结与最佳实践

✅ **推荐做法**：

1. **优先使用高阶数组方法**（map, filter, reduce）替代 for 循环；
2. **使用链式调用**提高代码可读性；
3. **编写纯函数**，避免副作用；
4. **保持函数简洁**，单一职责；
5. **使用 const 声明不变的引用**；
6. **组合小函数**实现复杂逻辑。

❌ **避免做法**：

1. 在 forEach 中使用 return（不会提前退出）；
2. 直接修改原数组（使用 map/filter 返回新数组）；
3. 嵌套多层回调函数；
4. 在 sort 中不提供比较函数（默认按字符串排序）；
5. 使用 reduce 实现简单逻辑（能用 map/filter 就不用 reduce）。

下一章我们将学习 **模块化**，掌握代码组织和依赖管理。