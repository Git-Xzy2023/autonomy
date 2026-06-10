---
title: 浏览器存储
---

# 浏览器存储方案详解

> 浏览器提供了多种存储方案，包括 Cookie、Web Storage（LocalStorage/SessionStorage）、IndexedDB、Cache API 等。本章深入探讨每种存储方案的特点、使用场景和最佳实践。

---

## 一、浏览器存储概述

### 1.1 存储方案对比

| 特性 | Cookie | LocalStorage | SessionStorage | IndexedDB | Cache API |
|------|--------|-------------|----------------|-----------|-----------|
| **容量** | ~4KB | ~5-10MB | ~5-10MB | >50MB | 取决于磁盘 |
| **持久化** | 可设置过期时间 | 永久 | 当前会话 | 永久 | 永久 |
| **跨标签页** | ✅ 是 | ✅ 是 | ❌ 否 | ✅ 是 | ✅ 是 |
| **随请求发送** | ✅ 自动发送 | ❌ 否 | ❌ 否 | ❌ 否 | ❌ 否 |
| **数据结构** | 字符串 | key-value | key-value | 结构化数据 | Request/Response |
| **API 类型** | 同步 | 同步 | 同步 | 异步 | 异步 |
| **Web Worker** | ❌ 否 | ✅ 是 | ✅ 是 | ✅ 是 | ✅ 是 |

### 1.2 选择指南

| 需求 | 推荐方案 |
|------|---------|
| 小量数据，需要服务端访问 | Cookie |
| 小量数据，纯客户端使用 | LocalStorage |
| 会话级数据，标签页关闭即清除 | SessionStorage |
| 大量结构化数据，需要查询索引 | IndexedDB |
| 缓存网络请求，离线应用 | Cache API |
| 临时状态管理 | 内存变量 |

---

## 二、Cookie

### 2.1 基础使用

```javascript
// 1. 设置 Cookie
document.cookie = 'username=张三';

// 2. 带过期时间（7 天后过期）
const expires = new Date();
expires.setDate(expires.getDate() + 7);
document.cookie = `sessionId=abc123; expires=${expires.toUTCString()}; path=/`;

// 3. 使用 max-age（相对时间，秒）
document.cookie = 'rememberMe=true; max-age=3600; path=/';

// 4. 安全 Cookie（HTTPS 下才发送，HttpOnly 禁止 JS 访问）
document.cookie = 'token=xyz; Secure; HttpOnly; SameSite=Strict';

// 5. 读取 Cookie
console.log(document.cookie);

// 6. 解析 Cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
}

const username = getCookie('username');

// 7. 删除 Cookie（设置过期时间为过去）
document.cookie = 'username=; path=/; max-age=0';
```

### 2.2 Cookie 属性

| 属性 | 说明 | 示例 |
|------|------|------|
| name=value | 键值对 | `username=张三` |
| expires | 绝对过期时间（UTC） | `expires=Wed, 21 Oct 2026 07:28:00 GMT` |
| max-age | 最大有效期（秒） | `max-age=3600` |
| domain | 可访问域名 | `domain=example.com` |
| path | 可访问路径 | `path=/` |
| Secure | 仅 HTTPS 发送 | `Secure` |
| HttpOnly | 禁止 JS 访问 | `HttpOnly` |
| SameSite | 跨站请求策略 | `SameSite=Strict` |

### 2.3 SameSite 策略

| 值 | 说明 | 适用场景 |
|----|------|---------|
| **Strict** | 完全禁止第三方 Cookie | 敏感操作（登录、支付） |
| **Lax** | 允许顶级导航携带，禁止 POST 自动携带 | 默认值，平衡安全和体验 |
| **None** | 允许所有跨站请求（必须同时 Secure） | 需要跨站认证的场景 |

---

## 三、Web Storage

### 3.1 LocalStorage & SessionStorage

两者 API 完全相同，区别仅在于生命周期：

**LocalStorage**：永久存储，跨标签页共享

**SessionStorage**：标签页关闭即清除，每个标签页独立

### 3.2 基本 API

```javascript
// ========== LocalStorage ==========

// 存储
localStorage.setItem('username', '张三');
localStorage.setItem('age', '25');

// 读取
const username = localStorage.getItem('username');
const notFound = localStorage.getItem('nonexistent'); // null

// 删除
localStorage.removeItem('age');

// 清空
localStorage.clear();

// 存储对象（需要 JSON 序列化）
localStorage.setItem('user', JSON.stringify({ name: '张三', age: 25 }));
const user = JSON.parse(localStorage.getItem('user'));

// 遍历
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}

// ========== SessionStorage ==========
// API 完全相同
sessionStorage.setItem('cart', JSON.stringify({ items: [] }));
const cart = JSON.parse(sessionStorage.getItem('cart'));
sessionStorage.removeItem('cart');
sessionStorage.clear();

// 监听存储变化（跨标签页通信）
window.addEventListener('storage', (event) => {
  console.log('Key:', event.key);
  console.log('旧值:', event.oldValue);
  console.log('新值:', event.newValue);
  console.log('来源:', event.url);
});
```

### 3.3 实用模式

**带过期时间的存储**：

```javascript
const StorageWithExpiry = {
  set(key, value, ttlSeconds) {
    const item = {
      value: value,
      expiry: Date.now() + ttlSeconds * 1000
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    try {
      const item = JSON.parse(itemStr);
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (e) {
      return itemStr;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  }
};

// 使用
StorageWithExpiry.set('token', 'abc123', 3600); // 1 小时
const token = StorageWithExpiry.get('token');
```

**用户偏好设置**：

```javascript
const UserPreferences = {
  defaults: {
    theme: 'light',
    language: 'zh-CN',
    fontSize: 'medium'
  },
  
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem('preferences') || '{}');
      return { ...this.defaults, ...saved };
    } catch (e) {
      return { ...this.defaults };
    }
  },
  
  save(prefs) {
    const current = this.load();
    const updated = { ...current, ...prefs };
    localStorage.setItem('preferences', JSON.stringify(updated));
    this.apply(updated);
    return updated;
  },
  
  apply(prefs) {
    document.documentElement.setAttribute('data-theme', prefs.theme);
    document.documentElement.setAttribute('lang', prefs.language);
    document.documentElement.setAttribute('data-font-size', prefs.fontSize);
  }
};

// 使用
const prefs = UserPreferences.load();
UserPreferences.apply(prefs);
```

### 3.4 安全注意

**⚠️ 不要存储敏感数据**：

- ❌ 密码、信用卡号
- ❌ 私钥、Token（除非加密）
- ❌ 个人身份信息

**XSS 风险**：LocalStorage 可被 JavaScript 访问，如果网站有 XSS 漏洞，攻击者可以窃取数据。

---

## 四、IndexedDB

### 4.1 IndexedDB 概述

IndexedDB 是浏览器提供的事务型 NoSQL 数据库，适合存储大量结构化数据。

**特点**：

- ✅ 大容量（通常 > 50MB）
- ✅ 异步 API，不阻塞主线程
- ✅ 支持索引查询
- ✅ 支持事务
- ✅ 可存储 JavaScript 对象
- ✅ Service Worker 可访问（离线应用）

### 4.2 基本操作

**打开数据库**：

```javascript
function openDatabase() {
  return new Promise((resolve, reject) => {
    // indexedDB.open(数据库名, 版本号)
    const request = indexedDB.open('MyAppDB', 1);
    
    // 数据库升级（首次创建或版本增加时触发）
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // 创建对象仓库（类似于表）
      if (!db.objectStoreNames.contains('users')) {
        const store = db.createObjectStore('users', {
          keyPath: 'id',
          autoIncrement: true
        });
        
        // 创建索引（用于查询）
        store.createIndex('email', 'email', { unique: true });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('age', 'age', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}
```

**CRUD 操作**：

```javascript
// 1. 添加数据
function addUser(db, user) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add(user);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 2. 根据主键查询
function getUser(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// 3. 获取所有数据
function getAllUsers(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// 4. 使用索引查询
function getUserByEmail(db, email) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('email');
    const request = index.get(email);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// 5. 范围查询
function getUsersInAgeRange(db, minAge, maxAge) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('age');
    
    // 创建范围：bound(下限, 上限, 排除下限?, 排除上限?)
    const range = IDBKeyRange.bound(minAge, maxAge, true, true);
    const users = [];
    const request = index.openCursor(range);
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        users.push(cursor.value);
        cursor.continue();
      } else {
        resolve(users);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

// 6. 更新数据
function updateUser(db, user) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.put(user); // 存在则更新，不存在则添加
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 7. 删除数据
function deleteUser(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

// 使用示例
async function main() {
  const db = await openDatabase();
  
  // 添加用户
  const userId = await addUser(db, {
    name: '张三',
    email: 'zhang@example.com',
    age: 25,
    createdAt: new Date().toISOString()
  });
  console.log('添加成功 ID:', userId);
  
  // 查询用户
  const user = await getUser(db, userId);
  console.log('查询到:', user);
  
  // 通过索引查询
  const userByEmail = await getUserByEmail(db, 'zhang@example.com');
  console.log('通过邮箱查询:', userByEmail);
  
  // 范围查询
  const youngUsers = await getUsersInAgeRange(db, 18, 30);
  console.log('18-30 岁用户:', youngUsers);
  
  // 获取所有用户
  const allUsers = await getAllUsers(db);
  console.log('所有用户:', allUsers);
}

main();
```

### 4.3 推荐使用库

原生 IndexedDB API 较繁琐，推荐使用以下库：

**idb（轻量级封装）**：

```javascript
// npm install idb
import { openDB } from 'idb';

const db = await openDB('MyAppDB', 1, {
  upgrade(db) {
    const store = db.createObjectStore('users', {
      keyPath: 'id',
      autoIncrement: true
    });
    store.createIndex('email', 'email', { unique: true });
  }
});

await db.add('users', { name: '张三', email: 'zhang@example.com' });
const user = await db.get('users', 1);
const allUsers = await db.getAll('users');
```

**Dexie.js（高级 ORM）**：

```javascript
// npm install dexie
import Dexie from 'dexie';

const db = new Dexie('MyAppDB');
db.version(1).stores({
  users: '++id, email, name, age',
  products: '++id, category, price'
});

await db.users.add({ name: '张三', email: 'zhang@example.com', age: 25 });

// 链式查询
const adults = await db.users
  .where('age')
  .above(18)
  .toArray();

const user = await db.users
  .where('email')
  .equals('zhang@example.com')
  .first();
```

---

## 五、Cache API（Service Worker 缓存）

### 5.1 概述

Cache API 是 Service Worker 提供的缓存机制，专门用于缓存 HTTP 请求和响应。

**特点**：

- ✅ 完全由开发者控制缓存策略
- ✅ 支持离线应用（PWA）
- ✅ 可缓存任何类型资源
- ✅ 精细的版本管理

### 5.2 基本操作

```javascript
// 1. 打开或创建缓存
const cache = await caches.open('my-cache-v1');

// 2. 添加请求和响应
await cache.add('/style.css');
await cache.addAll(['/', '/script.js', '/logo.png']);

// 3. 手动指定请求和响应
await cache.put(
  new Request('/api/data'),
  new Response(JSON.stringify({ data: '缓存数据' }), {
    headers: { 'Content-Type': 'application/json' }
  })
);

// 4. 查找缓存
const response = await cache.match('/style.css');
if (response) {
  const content = await response.text();
}

// 5. 删除缓存
await cache.delete('/style.css');

// 6. 获取所有缓存名称
const cacheNames = await caches.keys();

// 7. 删除整个缓存
await caches.delete('my-cache-v1');
```

### 5.3 Service Worker 缓存策略

```javascript
// service-worker.js

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/offline.html'
];

// 安装阶段：预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// 拦截请求，实现缓存策略
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  if (PRECACHE_URLS.includes(url.pathname)) {
    // 核心静态资源：Cache First
    event.respondWith(cacheFirst(event.request));
  } else if (url.pathname.startsWith('/api/')) {
    // API 请求：Stale While Revalidate
    event.respondWith(staleWhileRevalidate(event.request));
  } else {
    // 其他：Network First
    event.respondWith(networkFirst(event.request));
  }
});

// 策略 1: Cache First（缓存优先）
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return caches.match('/offline.html');
  }
}

// 策略 2: Network First（网络优先）
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return caches.match(request) || caches.match('/offline.html');
  }
}

// 策略 3: Stale While Revalidate（返回缓存，后台更新）
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const networkFetch = fetch(request).then(response => {
    caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone()));
    return response;
  });
  
  return cached || networkFetch;
}
```

---

## 六、总结

### 存储方案选择

| 方案 | 容量 | 持久化 | 服务端访问 | 适用场景 |
|------|------|--------|-----------|---------|
| **Cookie** | ~4KB | 可配置 | ✅ | 会话管理、跟踪 |
| **LocalStorage** | ~5-10MB | 永久 | ❌ | 用户偏好、缓存 |
| **SessionStorage** | ~5-10MB | 会话 | ❌ | 表单草稿、临时状态 |
| **IndexedDB** | >50MB | 永久 | ❌ | 大量结构化数据、离线应用 |
| **Cache API** | 取决于磁盘 | 永久 | ❌ | HTTP 请求缓存、PWA |

### 最佳实践

1. **不要在 LocalStorage 存储敏感数据**（易受 XSS 攻击）
2. **设置合理的 Cookie 属性**（Secure、HttpOnly、SameSite）
3. **使用 IndexedDB 存储大量数据**，而不是 LocalStorage
4. **为缓存设置过期时间**，定期清理过期数据
5. **使用 Service Worker + Cache API 实现离线功能**
6. **在隐私模式下处理存储失败**（某些浏览器限制存储）
7. **使用命名空间**避免数据冲突（如 `myapp:user`）

---

> **💡 提示**：选择存储方案时，先评估数据大小、敏感性、是否需要服务端访问等因素。对于复杂应用，通常会组合使用多种存储方案。
