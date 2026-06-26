---
title: 02 连接池
---

# 数据库连接池

> 连接池预先建立一批数据库连接并复用，避免每次请求都创建/销毁连接（TCP 三次握手 + 认证开销），是高并发应用的基础组件。本章涵盖连接池原理、HikariCP、Druid 的使用与调优。

## 为什么需要连接池

```
无连接池：
请求 → 创建连接（TCP + 认证）→ 执行 SQL → 关闭连接（TCP 四次挥手）
       ↑ 每次 50~200ms 开销                                    ↑ 资源浪费

有连接池：
请求 → 从池中借连接 → 执行 SQL → 归还到池（不关闭） → 下次复用
       ↑ 几乎 0 开销                                  ↑ 复用
```

| 对比项     | 无连接池     | 有连接池         |
| ---------- | ------------ | ---------------- |
| 创建开销   | 每次创建     | 启动时批量创建   |
| 响应时间   | 50~200ms     | < 1ms            |
| 并发支持   | 受限于 DB    | 可控（池大小）   |
| 资源占用   | 频繁波动     | 稳定             |

## 核心参数

| 参数             | 说明                              | 推荐值          |
| ---------------- | --------------------------------- | --------------- |
| minimumIdle      | 最小空闲连接数                    | 与 maximum 同   |
| maximumPoolSize  | 最大连接数                        | CPU 核数 × 2 + 1 |
| connectionTimeout| 获取连接等待超时（ms）            | 30000           |
| idleTimeout      | 空闲连接超时（ms）                | 600000          |
| maxLifetime      | 连接最大存活时间（ms）            | 1800000         |
| connectionTestQuery | 连接有效性检测 SQL             | SELECT 1        |

> **池大小经验公式**（PostgreSQL 官方推荐）：`连接数 = (CPU 核数 × 2) + 有效磁盘数`。并非越大越好，过多连接会导致上下文切换开销。

## HikariCP

Spring Boot 2.x+ 默认连接池，性能最佳、代码精简。

### 依赖

```xml
<dependency>
  <groupId>com.zaxxer</groupId>
  <artifactId>HikariCP</artifactId>
  <version>5.1.0</version>
</dependency>
```

### Spring Boot 配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      pool-name: MyHikariPool
      minimum-idle: 10
      maximum-pool-size: 20
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      connection-test-query: SELECT 1
```

### 纯 Java 使用

```java
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:mysql://localhost:3306/test");
config.setUsername("root");
config.setPassword("123456");
config.setMaximumPoolSize(20);
config.setMinimumIdle(10);

HikariDataSource ds = new HikariDataSource(config);

try (Connection conn = ds.getConnection()) {
  try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
    ps.setLong(1, 1L);
    try (ResultSet rs = ps.executeQuery()) {
      while (rs.next()) {
        System.out.println(rs.getString("name"));
      }
    }
  }
}

ds.close();   // 应用关闭时关闭池
```

### 为什么 HikariCP 快

- **字节码优化**：用 Javassist 生成代理类，避免反射
- **ConcurrentBag**：自定义无锁并发集合，减少锁竞争
- **FastList**：替代 ArrayList，去掉范围检查
- **精简设计**：源码不到 2000 行，GC 友好

## Druid

阿里巴巴开源，国内使用率高，强在监控和 SQL 防火墙。

### 依赖

```xml
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>druid-spring-boot-starter</artifactId>
  <version>1.2.20</version>
</dependency>
```

### Spring Boot 配置

```yaml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      url: jdbc:mysql://localhost:3306/test
      username: root
      password: 123456
      driver-class-name: com.mysql.cj.jdbc.Driver
      initial-size: 5
      min-idle: 10
      max-active: 20
      max-wait: 60000
      time-between-eviction-runs-millis: 60000
      min-evictable-idle-time-millis: 300000
      validation-query: SELECT 1
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false
      pool-prepared-statements: true
      max-pool-prepared-statement-per-connection-size: 20
      filters: stat,wall,slf4j
      connection-properties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=1000
```

### 关键参数

| 参数                  | 说明                         |
| --------------------- | ---------------------------- |
| initialSize           | 初始连接数                   |
| minIdle               | 最小空闲                     |
| maxActive             | 最大活跃                     |
| maxWait               | 获取连接最大等待             |
| timeBetweenEvictionRunsMillis | 检测间隔              |
| minEvictableIdleTimeMillis    | 最小空闲时间          |
| testWhileIdle         | 空闲时检测连接有效性          |
| validationQuery       | 检测 SQL                     |
| filters               | 插件（stat 监控 / wall 防火墙） |

### 监控页面

```java
@WebServlet("/druid/*")
public class StatViewServlet extends ResourceServlet {}

@Bean
public ServletRegistrationBean<StatViewServlet> druidStatViewServlet() {
  ServletRegistrationBean<StatViewServlet> bean = new ServletRegistrationBean<>(new StatViewServlet(), "/druid/*");
  Map<String, String> params = new HashMap<>();
  params.put("loginUsername", "admin");
  params.put("loginPassword", "admin");
  params.put("allow", "");    // IP 白名单
  bean.setInitParameters(params);
  return bean;
}
```

访问 `http://localhost:8080/druid/` 查看：
- **DataSource**：连接池状态（活跃、空闲、等待）
- **SQL**：执行 SQL 列表、慢查询
- **Wall**：SQL 防火墙拦截记录
- **Web 应用**：URI 访问统计

## 连接池对比

| 特性          | HikariCP           | Druid              | DBCP2        | Tomcat JDBC   |
| ------------- | ------------------ | ------------------ | ------------ | ------------- |
| 性能          | 最高               | 高                 | 一般         | 高            |
| 稳定性        | 极好               | 好                 | 好           | 好            |
| 监控          | 弱（JMX）          | 强（Web 控制台）   | 弱           | 一般          |
| SQL 防火墙    | 无                 | 有                 | 无           | 无            |
| 代码量        | ~2000 行           | ~2 万行            | 中           | 中            |
| Spring Boot   | 默认               | 需引入 starter     | 需配置       | 需配置        |
| 国内使用      | 主流               | 主流               | 较少         | 一般          |

> **选型建议**：
> - 性能优先 / 无监控需求 → **HikariCP**
> - 需要监控 / SQL 审计 / 国内团队 → **Druid**

## 连接泄漏排查

借了连接未归还，池逐渐耗尽。

### 常见原因

```java
// ❌ 异常导致 close 未执行
Connection conn = ds.getConnection();
PreparedStatement ps = conn.prepareStatement(sql);
ResultSet rs = ps.executeQuery();
if (rs.next()) {
  throw new RuntimeException("业务异常");   // conn 没关！
}
conn.close();   // 不会执行
```

### 正确写法

```java
// ✅ try-with-resources 自动关闭（逆序）
try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql);
     ResultSet rs = ps.executeQuery()) {
  while (rs.next()) {
    // 处理结果
  }
}   // 自动 close，即使抛异常也会执行
```

### Druid 泄漏检测

```yaml
spring:
  datasource:
    druid:
      remove-abandoned: true
      remove-abandoned-timeout: 300   # 超过 300 秒视为泄漏
      log-abandoned: true              # 打印泄漏堆栈
```

## 调优建议

### 池大小

```
小规模应用：10~20
中等应用：20~50
高并发应用：50~100（配合 DB 连接数上限）
```

**不是越大越好**：连接过多会导致
- DB 端内存占用高
- 上下文切换开销
- 锁竞争激烈

### 连接有效性检测

- `testWhileIdle: true`：空闲时检测，避免拿到失效连接
- `validationQuery: SELECT 1`：MySQL 用 SELECT 1，Oracle 用 SELECT 1 FROM DUAL
- `testOnBorrow: false`：借出时不检测（性能优先），依靠 testWhileIdle

### 超时设置

```yaml
hikari:
  connection-timeout: 30000    # 借连接等待 30s
  idle-timeout: 600000         # 空闲 10min 回收
  max-lifetime: 1800000        # 30min 强制重建（避免 DB 端超时）
  leak-detection-threshold: 60000   # 60s 未归还视为泄漏
```

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| 作用         | 复用连接，避免反复创建              |
| HikariCP     | Spring Boot 默认，性能最佳          |
| Druid        | 国内主流，监控 + SQL 防火墙         |
| 池大小       | CPU × 2 + 1，不是越大越好           |
| 资源释放     | try-with-resources                  |
| 调优         | testWhileIdle + 合理超时            |
