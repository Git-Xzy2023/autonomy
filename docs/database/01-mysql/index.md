---
title: MySQL 基础与进阶
---

# MySQL 基础与进阶

> MySQL 是最流行的关系型数据库。本章涵盖 SQL 语法、表设计、索引原理、事务隔离级别、锁机制与性能优化。

---

## 一、MySQL 基础

### 1.1 安装与连接

```bash
# macOS
brew install mysql
mysql.server start

# Docker
docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:8

# 连接
mysql -h 127.0.0.1 -P 3306 -u root -p
```

### 1.2 数据库与表操作

```sql
-- 数据库
CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shop;
DROP DATABASE shop;
SHOW DATABASES;

-- 表
CREATE TABLE users (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  username    VARCHAR(50) NOT NULL UNIQUE,
  email       VARCHAR(100) NOT NULL,
  age         TINYINT UNSIGNED DEFAULT 0,
  status      ENUM('active', 'inactive', 'banned') DEFAULT 'active',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users DROP COLUMN age;
ALTER TABLE users MODIFY username VARCHAR(100) NOT NULL;

DROP TABLE users;
SHOW TABLES;
DESC users;
```

### 1.3 CRUD

```sql
-- 插入
INSERT INTO users (username, email) VALUES ('tom', 'tom@test.com');
INSERT INTO users (username, email) VALUES ('jerry', 'jerry@test.com'), ('spike', 'spike@test.com');

-- 查询
SELECT id, username, email FROM users WHERE status = 'active' ORDER BY created_at DESC LIMIT 10;
SELECT * FROM users WHERE age BETWEEN 18 AND 60;
SELECT * FROM users WHERE username IN ('tom', 'jerry');
SELECT * FROM users WHERE email LIKE '%@test.com';
SELECT * FROM users WHERE created_at >= '2026-01-01';

-- 更新
UPDATE users SET status = 'banned' WHERE id = 1;

-- 删除
DELETE FROM users WHERE id = 1;
TRUNCATE TABLE users;  -- 清空表（重置自增）
```

---

## 二、数据类型

### 2.1 数值类型

| 类型         | 字节  | 范围                          | 用途         |
| ------------ | ----- | ----------------------------- | ------------ |
| `TINYINT`    | 1     | -128~127 / 0~255(UNSIGNED)    | 状态、布尔  |
| `SMALLINT`   | 2     | -32768~32767                  |              |
| `INT`        | 4     | -21亿~21亿                    | 普通整数     |
| `BIGINT`     | 8     | ±9.2×10^18                   | 主键、时间戳 |
| `DECIMAL`    | 变长  | 精确小数                      | 金额         |
| `FLOAT`      | 4     | 近似小数                      | 不推荐存金额 |
| `DOUBLE`     | 8     | 近似小数                      | 科学计算     |

```sql
-- 金额必须用 DECIMAL
price DECIMAL(10, 2)  -- 共 10 位，2 位小数

-- 布尔用 TINYINT(1)
is_deleted TINYINT(1) DEFAULT 0
```

### 2.2 字符串类型

| 类型         | 最大长度       | 用途           |
| ------------ | -------------- | -------------- |
| `CHAR(n)`    | 255 字符       | 定长（如性别）|
| `VARCHAR(n)` | 65535 字节    | 变长字符串    |
| `TEXT`       | 64KB           | 长文本         |
| `MEDIUMTEXT` | 16MB           | 文章正文       |
| `LONGTEXT`   | 4GB            | 超长文本       |
| `BLOB`       | 64KB           | 二进制         |
| `ENUM`       | 65535 个值     | 枚举           |
| `JSON`       | 1GB            | JSON 数据      |

```sql
-- VARCHAR(n)：n 是字符数，不是字节数
username VARCHAR(50)  -- 最多 50 个字符（中文也算 1 个字符）

-- CHAR vs VARCHAR
-- CHAR(10)：固定占 10 字符空间，不足补空格
-- VARCHAR(10)：实际长度 + 1-2 字节长度前缀
```

### 2.3 时间类型

| 类型        | 格式                | 范围                            |
| ----------- | ------------------- | ------------------------------- |
| `DATE`      | YYYY-MM-DD          | 1000-01-01 ~ 9999-12-31        |
| `TIME`      | HH:MM:SS            | -838:59:59 ~ 838:59:59         |
| `DATETIME`  | YYYY-MM-DD HH:MM:SS | 1000-01-01 ~ 9999-12-31        |
| `TIMESTAMP` | YYYY-MM-DD HH:MM:SS | 1970-01-01 ~ 2038-01-19        |
| `YEAR`      | YYYY                | 1901 ~ 2155                    |

```sql
-- 推荐
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- 或用 BIGINT 存毫秒时间戳（跨时区友好）
created_at BIGINT
```

---

## 三、索引

### 3.1 索引类型

| 类型         | 关键字          | 说明                       |
| ------------ | --------------- | -------------------------- |
| 主键索引     | PRIMARY KEY     | 唯一 + 非空                |
| 唯一索引     | UNIQUE          | 唯一                       |
| 普通索引     | INDEX / KEY     | 加速查询                   |
| 联合索引     | INDEX(a, b, c)  | 多列组合                   |
| 全文索引     | FULLTEXT        | 全文搜索                   |

```sql
CREATE INDEX idx_email ON users(email);
CREATE UNIQUE INDEX uk_username ON users(username);
CREATE INDEX idx_status_created ON users(status, created_at);

ALTER TABLE users ADD INDEX idx_age (age);
ALTER TABLE users DROP INDEX idx_email;
```

### 3.2 B+ 树索引原理

```
                [30 | 60]
               /     |     \
        [10|20]  [40|50]  [70|80]
        /  |  \   /  |  \   /  |  \
 叶子: → 10→20→30→40→50→60→70→80 →
              （叶子节点形成双向链表）
```

特点：
- 非叶子节点只存索引，不存数据
- 叶子节点存数据（聚簇索引）或主键（二级索引）
- 叶子节点用双向链表连接，范围查询高效

### 3.3 聚簇索引 vs 二级索引

| 类型       | 叶子存什么 | 数量     | 说明                       |
| ---------- | ---------- | -------- | -------------------------- |
| 聚簇索引   | 完整行数据 | 1 个     | 主键索引（默认）           |
| 二级索引   | 主键值     | 多个     | 非主键索引，需回表查询     |

```
-- 聚簇索引（按主键）
SELECT * FROM users WHERE id = 1;  -- 直接命中

-- 二级索引（需回表）
SELECT * FROM users WHERE email = 'a@b.com';
-- 1. 在 idx_email 找到主键 id=5
-- 2. 回表到聚簇索引取完整行
```

### 3.4 联合索引与最左前缀

```sql
CREATE INDEX idx_a_b_c ON t(a, b, c);

-- ✅ 命中
WHERE a = 1
WHERE a = 1 AND b = 2
WHERE a = 1 AND b = 2 AND c = 3

-- ❌ 不命中
WHERE b = 2
WHERE c = 3
WHERE b = 2 AND c = 3

-- ✅ 部分命中（a 走索引，b/c 不走）
WHERE a = 1 AND c = 3
```

### 3.5 覆盖索引

```sql
CREATE INDEX idx_name_age ON users(username, age);

-- ✅ 覆盖索引（无需回表）
SELECT username, age FROM users WHERE username = 'tom';

-- ❌ 需要回表（查询了非索引列 email）
SELECT username, age, email FROM users WHERE username = 'tom';
```

### 3.6 EXPLAIN 执行计划

```sql
EXPLAIN SELECT * FROM users WHERE email = 'tom@test.com';
```

| 字段         | 含义                             |
| ------------ | -------------------------------- |
| `type`       | 访问类型（system > const > eq_ref > ref > range > index > ALL） |
| `key`        | 实际使用的索引                   |
| `rows`       | 预估扫描行数                     |
| `Extra`      | 额外信息                         |

重点关注：
- `type` 至少达到 `range`，最好是 `const`/`ref`
- `rows` 越小越好
- `Extra` 出现 `Using filesort`（文件排序）、`Using temporary`（临时表）需优化

---

## 四、事务

### 4.1 ACID

| 特性         | 说明                                   |
| ------------ | -------------------------------------- |
| 原子性 A     | 事务内操作要么全成功，要么全回滚        |
| 一致性 C     | 事务前后数据一致                        |
| 隔离性 I     | 并发事务互不干扰                        |
| 持久性 D     | 提交后永久保存                          |

### 4.2 事务操作

```sql
BEGIN;
-- 或 START TRANSACTION;

UPDATE account SET balance = balance - 100 WHERE id = 1;
UPDATE account SET balance = balance + 100 WHERE id = 2;

COMMIT;   -- 提交
-- ROLLBACK;  -- 回滚
```

### 4.3 隔离级别

| 隔离级别         | 脏读 | 不可重复读 | 幻读 |
| ---------------- | ---- | ---------- | ---- |
| READ UNCOMMITTED | ✅   | ✅         | ✅   |
| READ COMMITTED   | ❌   | ✅         | ✅   |
| REPEATABLE READ  | ❌   | ❌         | ✅→❌(InnoDB MVCC) |
| SERIALIZABLE     | ❌   | ❌         | ❌   |

```sql
-- 查看隔离级别
SELECT @@transaction_isolation;

-- 设置（MySQL 默认 REPEATABLE READ）
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

并发问题：
- **脏读**：读到其他事务未提交的数据
- **不可重复读**：同一事务两次读同一行，结果不同（其他事务修改了）
- **幻读**：同一事务两次查询，行数不同（其他事务插入/删除了）

### 4.4 MVCC 多版本并发控制

InnoDB 通过 MVCC 实现 REPEATABLE READ 下避免幻读：

- 每行数据有隐藏列：`trx_id`（事务ID）、`roll_pointer`（指向 undo log）
- 读取时根据 Read View 判断版本可见性
- 实现非阻塞读，读写不冲突

---

## 五、锁

### 5.1 锁分类

```
按粒度：
├── 表锁
│   ├── 表读锁（共享锁）
│   └── 表写锁（排他锁）
├── 行锁（InnoDB）
│   ├── 共享锁（S）：SELECT ... LOCK IN SHARE MODE
│   └── 排他锁（X）：SELECT ... FOR UPDATE
└── 间隙锁（Gap Lock）：锁定范围，防止幻读

按思想：
├── 乐观锁：版本号/CAS，适用于读多写少
└── 悲观锁：FOR UPDATE，适用于写多
```

### 5.2 行锁示例

```sql
-- 事务 A
BEGIN;
SELECT * FROM account WHERE id = 1 FOR UPDATE;  -- 加排他锁
-- 此时事务 B 想修改 id=1 会被阻塞

UPDATE account SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

### 5.3 死锁

```sql
-- 事务 A
BEGIN;
UPDATE account SET balance = balance - 100 WHERE id = 1;  -- 锁住 id=1
UPDATE account SET balance = balance + 100 WHERE id = 2;  -- 等待 id=2

-- 事务 B
BEGIN;
UPDATE account SET balance = balance - 100 WHERE id = 2;  -- 锁住 id=2
UPDATE account SET balance = balance + 100 WHERE id = 1;  -- 等待 id=1

-- 死锁！InnoDB 会检测并回滚其中一个
```

预防：
- 按固定顺序加锁
- 保持事务简短
- 使用低隔离级别（如 READ COMMITTED）

---

## 六、SQL 优化

### 6.1 慢查询日志

```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- 超过 1 秒记录
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';

-- 查看慢查询
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

### 6.2 优化原则

```sql
-- ❌ 避免 SELECT *
SELECT * FROM users;
-- ✅ 只查需要的列
SELECT id, username FROM users;

-- ❌ 函数导致索引失效
WHERE YEAR(created_at) = 2026
-- ✅ 范围查询
WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'

-- ❌ 类型转换导致索引失效
WHERE phone = 13800000000  -- phone 是 VARCHAR
-- ✅
WHERE phone = '13800000000'

-- ❌ OR 导致索引失效（部分情况）
WHERE id = 1 OR age = 20
-- ✅ UNION ALL
SELECT * FROM t WHERE id = 1
UNION ALL
SELECT * FROM t WHERE age = 20

-- ❌ LIKE 左模糊
WHERE name LIKE '%tom'
-- ✅ 右模糊可走索引
WHERE name LIKE 'tom%'

-- ❌ NOT IN
WHERE id NOT IN (1, 2, 3)
-- ✅ NOT EXISTS 或 LEFT JOIN
```

### 6.3 分页优化

```sql
-- ❌ 深度分页（OFFSET 越大越慢）
SELECT * FROM orders ORDER BY id LIMIT 1000000, 10;

-- ✅ 延迟关联
SELECT * FROM orders o
INNER JOIN (SELECT id FROM orders ORDER BY id LIMIT 1000000, 10) t
ON o.id = t.id;

-- ✅ 游标分页（记住上一页最后的 id）
SELECT * FROM orders WHERE id > 1000000 ORDER BY id LIMIT 10;
```

### 6.4 JOIN 优化

```sql
-- 小表驱动大表
SELECT * FROM small_table s JOIN big_table b ON s.id = b.sid;
-- 优于
SELECT * FROM big_table b JOIN small_table s ON s.id = b.sid;

-- 确保 JOIN 字段有索引
ALTER TABLE big_table ADD INDEX idx_sid (sid);
```

---

## 七、学习建议

1. **索引**：理解 B+ 树、最左前缀、覆盖索引
2. **事务**：四个隔离级别对应的并发问题
3. **EXPLAIN**：学会分析执行计划
4. **避免慢查询**：不使用函数、不左模糊、不 SELECT *

---

## 参考

- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [MySQL 索引原理](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html)
