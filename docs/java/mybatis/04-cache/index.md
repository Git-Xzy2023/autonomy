---
title: 04 缓存
---

# MyBatis 缓存

> MyBatis 提供两级缓存机制，减少数据库访问。一级缓存为 SqlSession 级别，二级缓存为 Mapper 级别（跨 SqlSession）。

## 缓存层次

```
查询请求
   ↓
二级缓存（Mapper 级别，跨 SqlSession）── 命中 → 返回
   ↓ 未命中
一级缓存（SqlSession 级别）──────── 命中 → 返回
   ↓ 未命中
数据库 ────→ 写入一级缓存 ────→ 写入二级缓存
```

## 一级缓存

**默认开启**，SqlSession 范围。同一个 SqlSession 中相同查询走缓存。

```java
SqlSession session = sqlSessionFactory.openSession();
UserMapper mapper = session.getMapper(UserMapper.class);

User u1 = mapper.findById(1L);   // 查数据库，存一级缓存
User u2 = mapper.findById(1L);   // 命中一级缓存，不查数据库
System.out.println(u1 == u2);    // true，同一对象

mapper.update(...);              // 执行增删改，清空一级缓存
User u3 = mapper.findById(1L);   // 再次查数据库
```

### 失效条件

- 调用 `sqlSession.commit()`
- 执行增删改操作
- 调用 `sqlSession.clearCache()`
- 不同 SqlSession 之间不共享

### Spring 整合下的一级缓存

Spring 默认每次 Mapper 调用创建新的 SqlSession，**一级缓存基本失效**。但在 `@Transactional` 方法内，多次调用同一查询会命中一级缓存。

## 二级缓存

**Mapper（namespace）级别**，跨 SqlSession 共享。需手动开启。

### 开启方式

```yaml
mybatis:
  configuration:
    cache-enabled: true   # 全局开关（默认 true）
```

```xml
<!-- 在 Mapper XML 中开启 -->
<mapper namespace="com.example.mapper.UserMapper">
  <cache/>    <!-- 开启本 namespace 的二级缓存 -->
</mapper>
```

### cache 配置

```xml
<cache
  eviction="LRU"        <!-- 淘汰策略：LRU / FIFO / SOFT / WEAK -->
  flushInterval="60000" <!-- 刷新间隔（毫秒）-->
  size="512"             <!-- 最多缓存对象数 -->
  readOnly="false"       <!-- 只读，true 性能高但不安全 -->
/>
```

### 实体需 Serializable

二级缓存的对象会被序列化存储，实体类必须实现 `Serializable`。

```java
public class User implements Serializable {
  private static final long serialVersionUID = 1L;
  ...
}
```

### 使用注解开启

```java
@CacheNamespace   // 等价于 XML 的 <cache/>
public interface UserMapper { ... }
```

## 二级缓存的失效

- 该 namespace 执行了增删改，清空整个 namespace 的二级缓存
- 多表联查时，若关联表更新，缓存不会自动失效（脏数据风险）

## 第三方缓存：Redis

MyBatis 自带缓存实现简单，分布式场景需用 Redis 等替代。

```xml
<dependency>
  <groupId>org.mybatis.caches</groupId>
  <artifactId>mybatis-redis</artifactId>
  <version>1.0.0-beta2</version>
</dependency>
```

```xml
<cache type="org.mybatis.caches.redis.RedisCache"/>
```

## 缓存使用建议

| 场景             | 建议                          |
| ---------------- | ----------------------------- |
| 单机、读多写少   | 二级缓存                      |
| 分布式           | Redis / Caffeine              |
| 实时性要求高     | 不用缓存或短 TTL              |
| 关联查询多表     | 慎用二级缓存（脏数据）        |

> **生产实践**：MyBatis 二级缓存实际使用较少，多数团队在 Service 层用 Spring Cache + Redis 做缓存控制。

## 小结

| 缓存     | 范围          | 默认   | 跨 Session |
| -------- | ------------- | ------ | ---------- |
| 一级缓存 | SqlSession    | 开启   | 否         |
| 二级缓存 | namespace     | 关闭   | 是         |
| 第三方   | Redis / Caffeine | -    | 是         |
