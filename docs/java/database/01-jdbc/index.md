---
title: 01 JDBC
---

# JDBC 基础

> JDBC（Java Database Connectivity）是 Java 访问数据库的标准 API，所有 ORM 框架底层都基于 JDBC。

## 核心接口

```
DriverManager     管理驱动
Connection        数据库连接
Statement         静态 SQL
PreparedStatement 预编译 SQL（防注入，推荐）
ResultSet         结果集
```

## 基本流程

```java
// 1. 加载驱动（JDBC 4.0+ 自动加载，可省略）
Class.forName("com.mysql.cj.jdbc.Driver");

// 2. 获取连接
String url = "jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC";
Connection conn = DriverManager.getConnection(url, "root", "123456");

// 3. 创建 Statement
String sql = "SELECT id, name, age FROM users WHERE id = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setLong(1, 1L);

// 4. 执行查询
ResultSet rs = ps.executeQuery();

// 5. 处理结果
while (rs.next()) {
  Long id = rs.getLong("id");
  String name = rs.getString("name");
  int age = rs.getInt("age");
  System.out.println(id + " " + name + " " + age);
}

// 6. 释放资源（逆序）
rs.close();
ps.close();
conn.close();
```

## 增删改

```java
// 新增
String insert = "INSERT INTO users(name, age) VALUES(?, ?)";
try (PreparedStatement ps = conn.prepareStatement(insert, Statement.RETURN_GENERATED_KEYS)) {
  ps.setString(1, "Tom");
  ps.setInt(2, 20);
  int rows = ps.executeUpdate();   // 返回影响行数

  // 获取自增主键
  try (ResultSet keys = ps.getGeneratedKeys()) {
    if (keys.next()) {
      long id = keys.getLong(1);
    }
  }
}

// 更新
String update = "UPDATE users SET age = ? WHERE id = ?";
try (PreparedStatement ps = conn.prepareStatement(update)) {
  ps.setInt(1, 21);
  ps.setLong(2, 1L);
  ps.executeUpdate();
}

// 删除
String delete = "DELETE FROM users WHERE id = ?";
try (PreparedStatement ps = conn.prepareStatement(delete)) {
  ps.setLong(1, 1L);
  ps.executeUpdate();
}
```

## Statement vs PreparedStatement

| 特性        | Statement         | PreparedStatement       |
| ----------- | ----------------- | ----------------------- |
| SQL         | 字符串拼接         | 预编译 + 占位符         |
| SQL 注入    | 有风险             | 安全                    |
| 性能        | 每次编译           | 可复用执行计划          |
| 使用        | DDL               | DML（增删改查）          |

```java
// ❌ 危险：SQL 注入
String name = "'; DROP TABLE users; --";
Statement stmt = conn.createStatement();
stmt.executeQuery("SELECT * FROM users WHERE name = '" + name + "'");

// ✅ 安全
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE name = ?");
ps.setString(1, name);
```

## 事务

```java
Connection conn = DriverManager.getConnection(url, user, pwd);
try {
  conn.setAutoCommit(false);      // 开启事务

  // 业务操作
  ps1.executeUpdate();
  ps2.executeUpdate();

  conn.commit();                  // 提交
} catch (Exception e) {
  conn.rollback();                // 回滚
  throw e;
} finally {
  conn.setAutoCommit(true);       // 恢复
  conn.close();
}
```

### 事务隔离级别

```java
conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
```

| 常量                           | 隔离级别         |
| ------------------------------ | ---------------- |
| TRANSACTION_NONE               | 不支持事务       |
| TRANSACTION_READ_UNCOMMITTED   | 读未提交         |
| TRANSACTION_READ_COMMITTED     | 读已提交         |
| TRANSACTION_REPEATABLE_READ    | 可重复读         |
| TRANSACTION_SERIALIZABLE       | 串行化           |

## 批量操作

```java
conn.setAutoCommit(false);
try (PreparedStatement ps = conn.prepareStatement("INSERT INTO users(name) VALUES(?)")) {
  for (int i = 0; i < 1000; i++) {
    ps.setString(1, "user" + i);
    ps.addBatch();                // 加入批
    if (i % 100 == 0) {
      ps.executeBatch();          // 每 100 条执行一次
      ps.clearBatch();
    }
  }
  ps.executeBatch();
  conn.commit();
}
```

## 封装工具类

```java
public class JdbcUtil {
  private static final String URL = "jdbc:mysql://localhost:3306/test";
  private static final String USER = "root";
  private static final String PWD = "123456";

  public static Connection getConnection() throws SQLException {
    return DriverManager.getConnection(URL, USER, PWD);
  }

  public static void close(Connection conn, Statement stmt, ResultSet rs) {
    if (rs != null) try { rs.close(); } catch (Exception e) {}
    if (stmt != null) try { stmt.close(); } catch (Exception e) {}
    if (conn != null) try { conn.close(); } catch (Exception e) {}
  }
}
```

## 小结

| 知识点       | 要点                              |
| ------------ | --------------------------------- |
| 核心 API     | Connection / PreparedStatement    |
| 防注入       | 用 PreparedStatement             |
| 事务         | setAutoCommit(false) + commit/rollback |
| 批量         | addBatch + executeBatch           |
| 资源释放     | try-with-resources 自动关闭       |
