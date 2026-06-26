---
title: MongoDB 文档型数据库
---

# MongoDB 文档型数据库

> MongoDB 是最流行的文档型 NoSQL 数据库，用 BSON 存储 JSON 风格数据，schema 灵活、易于水平扩展。

---

## 一、MongoDB 概述

### 1.1 特点

- 📄 **文档存储**：BSON（二进制 JSON）
- 🔄 **Schema 灵活**：同一集合可存不同结构文档
- 🔍 **丰富查询**：支持嵌套、数组、地理查询
- ⚖️ **水平扩展**：原生分片支持
- 🔗 **聚合管道**：强大的数据处理能力

### 1.2 与 MySQL 对比

| 概念     | MySQL       | MongoDB      |
| -------- | ----------- | ------------ |
| 数据库   | database    | database     |
| 表/集合  | table       | collection   |
| 行/文档  | row         | document     |
| 列/字段  | column      | field        |
| 主键     | PRIMARY KEY | _id（默认）  |
| Join     | JOIN        | $lookup      |
| 事务     | 原生支持    | 4.0+ 支持    |

---

## 二、基础操作

### 2.1 连接

```bash
# Shell
mongosh "mongodb://localhost:27017"

# Docker
docker run -d --name mongo -p 27017:27017 mongo:6
```

### 2.2 数据库与集合

```js
use shop;                    // 切换/创建数据库
db                           // 当前数据库
show dbs                     // 显示所有数据库
db.createCollection('users') // 创建集合
show collections             // 显示集合
db.users.drop()              // 删除集合
db.dropDatabase()            // 删除数据库
```

### 2.3 插入文档

```js
// 插入单个
db.users.insertOne({
  name: 'tom',
  age: 18,
  email: 'tom@test.com',
  address: { city: '北京', zip: '100000' },
  tags: ['vue', 'react'],
  createdAt: new Date()
});

// 插入多个
db.users.insertMany([
  { name: 'jerry', age: 20 },
  { name: 'spike', age: 25 }
]);
```

### 2.4 查询

```js
// 基础查询
db.users.find()                          // 所有
db.users.find({ name: 'tom' })           // 条件
db.users.findOne({ name: 'tom' })        // 单个
db.users.find().count()                  // 数量

// 投影（只返回指定字段）
db.users.find({}, { name: 1, age: 1, _id: 0 })

// 比较运算符
db.users.find({ age: { $gt: 18 } })      // >
db.users.find({ age: { $gte: 18, $lte: 30 } })  // >= <=
db.users.find({ age: { $ne: 18 } })      // !=
db.users.find({ age: { $in: [18, 20] } }) // in

// 逻辑运算符
db.users.find({ $and: [{ age: { $gt: 18 } }, { age: { $lt: 30 } }] })
db.users.find({ $or: [{ name: 'tom' }, { name: 'jerry' }] })

// 嵌套文档
db.users.find({ 'address.city': '北京' })

// 数组
db.users.find({ tags: 'vue' })                      // 包含
db.users.find({ tags: { $all: ['vue', 'react'] } }) // 全包含
db.users.find({ tags: { $size: 2 } })               // 长度

// 正则
db.users.find({ name: /^t/ })

// 排序、分页
db.users.find().sort({ age: 1 })        // 升序
db.users.find().sort({ age: -1 })       // 降序
db.users.find().skip(10).limit(10)      // 分页
```

### 2.5 更新

```js
// 更新单个
db.users.updateOne({ name: 'tom' }, { $set: { age: 19 } })

// 更新多个
db.users.updateMany({ status: 'active' }, { $set: { status: 'inactive' } })

// 替换整个文档
db.users.replaceOne({ name: 'tom' }, { name: 'tom', age: 20 })

// 常用操作符
db.users.updateOne({ _id: 1 }, { $inc: { age: 1 } })           // 自增
db.users.updateOne({ _id: 1 }, { $push: { tags: 'angular' } }) // 数组添加
db.users.updateOne({ _id: 1 }, { $pull: { tags: 'angular' } }) // 数组移除
db.users.updateOne({ _id: 1 }, { $rename: { name: 'username' } }) // 重命名字段
db.users.updateOne({ _id: 1 }, { $unset: { age: '' } })       // 删除字段
```

### 2.6 删除

```js
db.users.deleteOne({ name: 'tom' })
db.users.deleteMany({ status: 'inactive' })
db.users.deleteMany({})  // 清空集合
```

---

## 三、索引

### 3.1 创建索引

```js
db.users.createIndex({ name: 1 })           // 升序索引
db.users.createIndex({ email: 1 }, { unique: true })  // 唯一索引
db.users.createIndex({ name: 1, age: -1 })   // 复合索引
db.users.createIndex({ desc: 'text' })        // 文本索引
db.users.createIndex({ location: '2dsphere' })  // 地理索引

db.users.getIndexes()                        // 查看索引
db.users.dropIndex('name_1')                 // 删除索引
```

### 3.2 explain

```js
db.users.find({ name: 'tom' }).explain('executionStats')
```

关注 `executionStats.totalDocsExamined`，越小说明索引越有效。

---

## 四、聚合管道

### 4.1 管道阶段

| 阶段       | 说明           |
| ---------- | -------------- |
| `$match`   | 过滤           |
| `$group`   | 分组           |
| `$project` | 字段投影       |
| `$sort`    | 排序           |
| `$limit`   | 限制           |
| `$skip`    | 跳过           |
| `$lookup`  | 关联           |
| `$unwind`  | 展开数组       |
| `$count`   | 计数           |

### 4.2 示例

```js
// 统计每个城市的用户数，按数量降序
db.users.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$address.city', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
]);

// 关联查询
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $unwind: '$user' },
  { $project: { orderNo: 1, 'user.name': 1, total: 1 } }
]);

// 展开数组
db.users.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

---

## 五、Schema 设计

### 5.1 嵌套 vs 引用

```js
// 嵌套：一对一或一对少量（如用户的地址）
{
  _id: 1,
  name: 'tom',
  address: { city: '北京', zip: '100000' }
}

// 引用：一对多或多对多（如用户的订单）
// users
{ _id: 1, name: 'tom' }
// orders
{ _id: 101, userId: 1, amount: 100 }
```

### 5.2 设计原则

- 一起读的数据放一起（嵌套）
- 频繁更新的子文档用引用
- 避免无限制增长的数组（用引用）
- 读多写少可适当反范式化

---

## 六、Node.js 集成

### 6.1 Mongoose

```js
const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/shop');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  age: { type: Number, min: 0, max: 150 },
  tags: [String],
  address: {
    city: String,
    zip: String
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ name: 1 });
userSchema.virtual('emailDomain').get(function() {
  return this.email?.split('@')[1];
});

const User = mongoose.model('User', userSchema);

// 使用
const user = new User({ name: 'tom', email: 'tom@test.com', age: 18 });
await user.save();
const found = await User.find({ age: { $gte: 18 } }).sort({ age: -1 });
```

---

## 七、学习建议

1. **文档模型**：理解嵌套 vs 引用的取舍
2. **聚合管道**：类似 SQL 的 GROUP BY + JOIN
3. **索引**：与 MySQL 类似，EXPLAIN 分析
4. **Mongoose**：Node.js 生态主流 ODM

---

## 参考

- [MongoDB 官方文档](https://www.mongodb.com/docs/)
- [Mongoose 文档](https://mongoosejs.com/docs/)
