---
title: MySQL
---

# MySQL

## 一、安装与连接

### 1. 安装驱动

```bash
npm install mysql2
```

### 2. 创建连接池

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 使用
const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [1]);
console.log(rows);
```

### 3. 连接池 vs 单连接

```javascript
// ❌ 单连接（不推荐）
const connection = await mysql.createConnection({...});

// ✅ 连接池（推荐）
const pool = mysql.createPool({...});
```

---

## 二、基本操作

### 1. 查询

```javascript
// 查询所有
const [rows] = await pool.query('SELECT * FROM users');

// 条件查询
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE age > ? AND status = ?',
  [18, 'active']
);

// 单条查询
const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [1]);
console.log(rows[0]);
```

### 2. 插入

```javascript
const [result] = await pool.execute(
  'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
  ['Alice', 'alice@test.com', 30]
);
console.log(result.insertId);  // 新增的 ID
```

### 3. 更新

```javascript
const [result] = await pool.execute(
  'UPDATE users SET name = ?, age = ? WHERE id = ?',
  ['Bob', 25, 1]
);
console.log(result.affectedRows);  // 影响的行数
```

### 4. 删除

```javascript
const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [1]);
console.log(result.affectedRows);
```

---

## 三、事务

```javascript
const connection = await pool.getConnection();
try {
  await connection.beginTransaction();

  await connection.execute(
    'INSERT INTO accounts (user_id, balance) VALUES (?, ?)',
    [1, 100]
  );

  await connection.execute(
    'UPDATE accounts SET balance = balance - ? WHERE user_id = ?',
    [50, 2]
  );

  await connection.commit();
} catch (err) {
  await connection.rollback();
  throw err;
} finally {
  connection.release();
}
```

---

## 四、防 SQL 注入

```javascript
// ✅ 使用参数化查询（自动转义）
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE email = ?',
  [userInput]
);

// ❌ 字符串拼接（危险！）
const [rows] = await pool.query(
  `SELECT * FROM users WHERE email = '${userInput}'`
);
```

---

## 五、下一步

- 下一章：[MongoDB](/web/nodejs/database/02-mongodb/)
- 上一级：[数据库](/web/nodejs/database/)
