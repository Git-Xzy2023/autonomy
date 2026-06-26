---
title: Redis 缓存与数据结构
---

# Redis 缓存与数据结构

> Redis 是高性能内存键值数据库，是缓存、分布式锁、限流、排行榜的首选方案。本章涵盖数据结构、持久化、缓存模式与常见问题。

---

## 一、Redis 概述

### 1.1 为什么用 Redis

- ⚡ **快**：内存操作，10 万+ QPS
- 📦 **数据结构丰富**：String/List/Hash/Set/ZSet 等
- 💾 **持久化**：RDB / AOF 两种方式
- 🔑 **单线程**：无锁竞争，命令原子性
- 🌐 **分布式**：主从、哨兵、集群

### 1.2 应用场景

| 场景         | 数据结构         |
| ------------ | ---------------- |
| 缓存         | String           |
| 计数器       | String（INCR）   |
| 分布式锁     | String（SETNX）  |
| 会话存储     | String / Hash    |
| 排行榜        | ZSet             |
| 消息队列     | List（LPUSH/BRPOP）|
| 去重         | Set              |
| 限流         | ZSet / String    |
| 附近的人     | Geo              |
| 布隆过滤器   | Bitmap           |

---

## 二、数据结构

### 2.1 String

```redis
SET name "tom"
GET name
SET counter 0
INCR counter      # 1
INCRBY counter 10 # 11
DECR counter      # 10

# 过期
SET token "abc" EX 3600  # 1 小时过期
TTL token                    # 剩余秒数
PERSIST token                # 取消过期

# 不存在才设置（分布式锁）
SET lock "owner" NX EX 30

# 批量
MSET k1 v1 k2 v2
MGET k1 k2
```

### 2.2 Hash

```redis
HSET user:1 name "tom" age 18
HGET user:1 name
HGETALL user:1
HINCRBY user:1 age 1
HDEL user:1 age
HLEN user:1
```

适合存对象，比 String 存 JSON 更节省内存、可单独修改字段。

### 2.3 List

```redis
LPUSH list "a" "b"      # 左插入
RPUSH list "c"           # 右插入
LRANGE list 0 -1         # 查看全部
LPOP list                # 左弹出
RPOP list                # 右弹出
LLEN list                # 长度

# 阻塞队列
BRPOP queue 0            # 阻塞等待右弹出
```

### 2.4 Set

```redis
SADD tags "vue" "react"
SMEMBERS tags           # 查看所有
SISMEMBER tags "vue"     # 是否存在
SREM tags "react"        # 移除
SCARD tags               # 数量

# 集合运算
SINTER set1 set2         # 交集
SUNION set1 set2         # 并集
SDIFF set1 set2          # 差集
```

### 2.5 ZSet（有序集合）

```redis
ZADD rank 90 "tom" 85 "jerry" 95 "spike"
ZRANGE rank 0 -1 WITHSCORES              # 升序
ZREVRANGE rank 0 -1 WITHSCORES            # 降序
ZRANGEBYSCORE rank 80 90                  # 分数范围
ZINCRBY rank 5 "tom"                      # 增加分数
ZRANK rank "tom"                          # 排名（升序）
ZREVRANK rank "tom"                       # 排名（降序）
```

排行榜首选。

---

## 三、持久化

### 3.1 RDB（快照）

```
# 触发条件（redis.conf）
save 900 1     # 900 秒内 1 次修改
save 300 10    # 300 秒内 10 次修改
save 60 10000  # 60 秒内 10000 次修改
```

- ✅ 文件小、恢复快
- ❌ 可能丢数据（最后一次快照后的修改）

### 3.2 AOF（追加日志）

```
appendonly yes
appendfsync everysec   # always | everysec | no
```

| 策略       | 说明                   | 数据安全 | 性能 |
| ---------- | ---------------------- | -------- | ---- |
| always     | 每条命令都刷盘          | 最高     | 最差 |
| everysec   | 每秒刷盘（默认推荐）    | 较高     | 好   |
| no         | 由 OS 决定              | 最低     | 最好 |

### 3.3 混合持久化（4.0+）

```
aof-use-rdb-preamble yes
```

AOF 重写时先以 RDB 格式写入，再追加增量命令。兼顾恢复速度与数据安全。

---

## 四、缓存模式

### 4.1 Cache Aside（旁路缓存）

```js
// 读
function getUser(id) {
  let user = await redis.get(`user:${id}`);
  if (!user) {
    user = await mysql.query('SELECT * FROM users WHERE id = ?', id);
    await redis.set(`user:${id}`, user, 'EX', 3600);
  }
  return user;
}

// 写
async function updateUser(id, data) {
  await mysql.query('UPDATE users SET ? WHERE id = ?', [data, id]);
  await redis.del(`user:${id}`);  // 删缓存而非更新
}
```

### 4.2 缓存穿透

查询不存在的数据，缓存和数据库都没有，每次都查 DB。

**解决方案：**
- 缓存空值（设短过期）
- 布隆过滤器

```js
const user = await mysql.query(...);
if (!user) {
  await redis.set(`user:${id}`, 'NULL', 'EX', 60);  // 缓存空值 60 秒
  return null;
}
```

### 4.3 缓存击穿

热点 key 过期瞬间，大量请求打到 DB。

**解决方案：**
- 互斥锁（只让一个请求查 DB）
- 热点 key 永不过期，后台异步更新

```js
async function getHotData(key) {
  let data = await redis.get(key);
  if (!data) {
    // 加锁，只有一个请求查 DB
    const lock = await redis.set(`lock:${key}`, '1', 'NX', 'EX', 10);
    if (lock) {
      data = await mysql.query(...);
      await redis.set(key, data, 'EX', 3600);
      await redis.del(`lock:${key}`);
    } else {
      await sleep(50);
      return getHotData(key);  // 重试
    }
  }
  return data;
}
```

### 4.4 缓存雪崩

大量缓存同时过期，或 Redis 宕机，请求全打到 DB。

**解决方案：**
- 过期时间加随机值
- 多级缓存（本地 + Redis）
- 限流降级

```js
const expire = 3600 + Math.floor(Math.random() * 300);  // 1 小时 + 随机 0-5 分钟
await redis.set(key, data, 'EX', expire);
```

---

## 五、分布式锁

### 5.1 基本实现

```js
// 加锁
const lock = await redis.set(`lock:order:${id}`, requestId, 'NX', 'EX', 30);

// 解锁（Lua 保证原子性）
const script = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`;
await redis.eval(script, 1, `lock:order:${id}`, requestId);
```

### 5.2 Redisson（生产推荐）

```java
RLock lock = redisson.getLock("lock:order:" + id);
try {
  if (lock.tryLock(10, 30, TimeUnit.SECONDS)) {
    // 业务逻辑
  }
} finally {
  lock.unlock();
}
```

Redisson 特性：
- 自动续期（看门狗）
- 可重入
- 公平锁
- 读写锁

---

## 六、过期与淘汰策略

### 6.1 过期策略

Redis 采用**惰性删除 + 定期删除**：
- 惰性：访问时检查是否过期
- 定期：每秒扫描部分过期 key

### 6.2 淘汰策略

```
maxmemory 1gb
maxmemory-policy allkeys-lru
```

| 策略              | 说明                          |
| ----------------- | ----------------------------- |
| `noeviction`      | 不淘汰，写入报错（默认）       |
| `allkeys-lru`     | 所有 key 中淘汰最久未使用     |
| `allkeys-lfu`     | 所有 key 中淘汰最少使用       |
| `allkeys-random`  | 随机淘汰                       |
| `volatile-lru`     | 设了过期的 key 中 LRU          |
| `volatile-lfu`     | 设了过期的 key 中 LFU          |
| `volatile-random`  | 设了过期的 key 中随机          |
| `volatile-ttl`     | 淘汰即将过期的                 |

推荐：缓存场景用 `allkeys-lru`。

---

## 七、学习建议

1. **数据结构**：根据场景选对结构是关键
2. **缓存模式**：Cache Aside 是标准做法
3. **三大问题**：穿透、击穿、雪崩的解决方案
4. **分布式锁**：理解为什么需要 Lua 原子性

---

## 参考

- [Redis 官方文档](https://redis.io/docs/)
- [Redis 命令参考](https://redis.io/commands/)
