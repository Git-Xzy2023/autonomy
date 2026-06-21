---
title: Redis
---

# Redis

## 一、安装与连接

```bash
npm install redis
```

```javascript
const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis 错误:', err));

await client.connect();
```

---

## 二、基本数据类型

### 1. String

```javascript
await client.set('name', 'Alice');
await client.set('count', '0');

const name = await client.get('name');  // 'Alice'

// 自增
await client.incr('count');   // 1
await client.incrBy('count', 5);  // 6

// 设置过期时间
await client.set('token', 'abc', { EX: 3600 });  // 1 小时后过期

// 不存在才设置（分布式锁常用）
await client.set('lock', 'value', { NX: true, EX: 10 });
```

### 2. Hash

```javascript
await client.hSet('user:1', 'name', 'Alice');
await client.hSet('user:1', 'age', '30');

const name = await client.hGet('user:1', 'name');  // 'Alice'
const all = await client.hGetAll('user:1');  // { name: 'Alice', age: '30' }

await client.hDel('user:1', 'age');
```

### 3. List

```javascript
await client.lPush('tasks', 'task1');
await client.lPush('tasks', 'task2');

const task = await client.rPop('tasks');  // 'task1'
const length = await client.lLen('tasks');
```

### 4. Set

```javascript
await client.sAdd('tags', 'node');
await client.sAdd('tags', 'redis');

const isMember = await client.sIsMember('tags', 'node');  // true
const members = await client.sMembers('tags');  // ['node', 'redis']
```

### 5. Sorted Set

```javascript
await client.zAdd('leaderboard', [
  { score: 100, value: 'Alice' },
  { score: 90, value: 'Bob' }
]);

const top10 = await client.zRange('leaderboard', 0, 9, { REV: true });
const score = await client.zScore('leaderboard', 'Alice');
```

---

## 三、过期时间

```javascript
await client.set('key', 'value');

// 设置过期（秒）
await client.expire('key', 60);

// 查看剩余时间
const ttl = await client.ttl('key');  // 秒

// 移除过期
await client.persist('key');
```

---

## 四、常见应用场景

### 1. 缓存

```javascript
async function getUser(id) {
  const cacheKey = `user:${id}`;
  const cached = await client.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);  // 命中缓存
  }

  const user = await db.findUser(id);
  await client.set(cacheKey, JSON.stringify(user), { EX: 300 });  // 缓存 5 分钟
  return user;
}
```

### 2. 分布式锁

```javascript
async function acquireLock(key, ttl = 10) {
  const token = Date.now().toString();
  const acquired = await client.set(key, token, { NX: true, EX: ttl });
  return acquired ? token : null;
}

async function releaseLock(key, token) {
  // 使用 Lua 脚本保证原子性
  const script = `
    if redis.call('get', KEYS[1]) == ARGV[1] then
      return redis.call('del', KEYS[1])
    else
      return 0
    end
  `;
  return client.eval(script, { keys: [key], arguments: [token] });
}
```

### 3. 限流

```javascript
async function rateLimit(userId, maxRequests, windowSec) {
  const key = `rate:${userId}`;
  const count = await client.incr(key);

  if (count === 1) {
    await client.expire(key, windowSec);
  }

  return count <= maxRequests;
}
```

### 4. 排行榜

```javascript
// 添加分数
await client.zAdd('leaderboard', { score: score, value: userId });

// 获取排名
const rank = await client.zRevRank('leaderboard', userId);
const topUsers = await client.zRange('leaderboard', 0, 9, { REV: true });
```

---

## 五、下一步

- 上一章：[MongoDB](/web/nodejs/database/02-mongodb/)
- 下一章：[ORM](/web/nodejs/database/04-orm/)
