---
title: MongoDB
---

# MongoDB

## 一、安装与连接

### 1. 安装驱动

```bash
npm install mongodb
```

### 2. 连接

```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

await client.connect();
const db = client.db('mydb');
const users = db.collection('users');
```

---

## 二、基本操作

### 1. 插入

```javascript
// 插入一条
const result = await users.insertOne({
  name: 'Alice',
  email: 'alice@test.com',
  age: 30
});
console.log(result.insertedId);

// 插入多条
const result = await users.insertMany([
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
]);
```

### 2. 查询

```javascript
// 查询所有
const allUsers = await users.find().toArray();

// 条件查询
const adults = await users.find({ age: { $gt: 18 } }).toArray();

// 单条查询
const user = await users.findOne({ name: 'Alice' });

// 投影（只返回指定字段）
const users = await users.find({}, { projection: { name: 1, _id: 0 } }).toArray();

// 排序、分页
const users = await users.find()
  .sort({ age: -1 })   // 按年龄降序
  .skip(10)            // 跳过 10 条
  .limit(5)            // 取 5 条
  .toArray();
```

### 3. 更新

```javascript
// 更新一条
await users.updateOne(
  { name: 'Alice' },
  { $set: { age: 31 } }
);

// 更新多条
await users.updateMany(
  { age: { $lt: 18 } },
  { $set: { status: 'minor' } }
);

// 替换
await users.replaceOne(
  { name: 'Alice' },
  { name: 'Alice', age: 31, email: 'alice@test.com' }
);
```

### 4. 删除

```javascript
await users.deleteOne({ name: 'Alice' });
await users.deleteMany({ status: 'inactive' });
```

---

## 三、常用操作符

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `$eq` | 等于 | `{ age: { $eq: 30 } }` |
| `$gt` / `$gte` | 大于 / 大于等于 | `{ age: { $gt: 18 } }` |
| `$lt` / `$lte` | 小于 / 小于等于 | `{ age: { $lt: 60 } }` |
| `$ne` | 不等于 | `{ status: { $ne: 'deleted' } }` |
| `$in` | 在数组中 | `{ age: { $in: [20, 30, 40] } }` |
| `$nin` | 不在数组中 | `{ age: { $nin: [20, 30] } }` |
| `$and` | 与 | `{ $and: [{...}, {...}] }` |
| `$or` | 或 | `{ $or: [{...}, {...}] }` |
| `$regex` | 正则 | `{ name: { $regex: /^A/ } }` |

---

## 四、聚合

```javascript
const result = await users.aggregate([
  { $match: { age: { $gt: 18 } } },           // 过滤
  { $group: { _id: '$city', count: { $sum: 1 } } },  // 分组
  { $sort: { count: -1 } },                   // 排序
  { $limit: 10 }                              // 限制
]).toArray();
```

---

## 五、索引

```javascript
// 创建索引
await users.createIndex({ email: 1 }, { unique: true });
await users.createIndex({ name: 1, age: -1 });

// 查看索引
const indexes = await users.indexes();
```

---

## 六、下一步

- 上一章：[MySQL](/web/nodejs/database/01-mysql/)
- 下一章：[Redis](/web/nodejs/database/03-redis/)
