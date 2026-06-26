---
title: HTTPS 原理详解
---

# HTTPS 原理详解

> HTTPS（HTTP Secure）= HTTP + SSL/TLS，通过加密、认证、完整性保护，解决 HTTP 明文传输的安全问题。本章系统讲解 HTTPS 的工作原理、TLS 握手、证书机制与优化实践。

---

## 一、为什么需要 HTTPS

### 1.1 HTTP 的三大缺陷

| 缺陷       | 说明                                | 风险            |
| ---------- | ----------------------------------- | --------------- |
| **明文传输** | 数据未加密，中间人可嗅探           | 窃听、泄露       |
| **无认证** | 无法验证服务器/客户端身份          | 钓鱼、中间人攻击 |
| **无完整性** | 无法验证数据是否被篡改            | 篡改、注入       |

### 1.2 HTTPS 解决的问题

```
HTTP（明文）
Client ──明文──► 窃听者 ──明文──► Server

HTTPS（加密）
Client ──加密──► 窃听者（看不懂）──加密──► Server
         ↑ 防窃听
         ↑ 防篡改
         ↑ 防伪造（证书认证）
```

---

## 二、加密基础

### 2.1 对称加密

加密和解密使用**同一把密钥**。

```
明文 ──[密钥 K]──► 密文 ──[密钥 K]──► 明文
```

| 算法         | 类型     | 说明                    |
| ------------ | -------- | ----------------------- |
| AES-128/256  | 分组密码 | 主流，性能好            |
| ChaCha20     | 流密码   | 移动端优                |
| DES/3DES     | 分组密码 | 已过时，不安全          |

**优点**：速度快。
**缺点**：密钥分发困难（如何安全传密钥？）。

### 2.2 非对称加密

加密和解密使用**一对密钥**（公钥 + 私钥）。

```
公钥加密 ──► 私钥解密  （加密通信）
私钥签名 ──► 公钥验证  （数字签名）
```

| 算法   | 说明                              |
| ------ | --------------------------------- |
| RSA    | 主流，2048 位以上才安全           |
| ECC    | 椭圆曲线，密钥短、性能好          |
| DH     | 密钥交换                          |

**优点**：解决密钥分发问题。
**缺点**：速度慢，不适合加密大数据。

### 2.3 HTTPS 的混合加密策略

```
1. 用非对称加密交换「会话密钥」
2. 用对称加密传输实际数据（性能）
```

兼得安全与性能。

---

## 三、数字证书与 CA

### 3.1 中间人攻击

```
Client ──公钥──► 攻击者 ──自己的公钥──► Server
                  ↑ 替换公钥，双方都察觉不到
```

### 3.2 证书的作用

证书 = **公钥 + 持有者信息 + CA 签名**，由可信第三方 CA 签发，解决公钥信任问题。

### 3.3 证书链验证

```
根证书（CA，自签）
    ↓ 签发
中间证书（Intermediate CA）
    ↓ 签发
网站证书（example.com）
```

浏览器内置根证书列表，逐级验证签名。

### 3.4 证书类型

| 类型       | 验证等级                | 适用场景          |
| ---------- | ----------------------- | ----------------- |
| DV         | 仅域名                  | 个人站点          |
| OV         | 域名 + 组织             | 企业站点          |
| EV         | 严格审核                | 金融、银行（绿色地址栏） |
| 通配符证书 | *.example.com           | 多子域名          |
| 多域名证书 | 多个 SAN                | 多站点            |

### 3.5 证书格式与命令

```bash
# 生成私钥
openssl genrsa -out server.key 2048

# 生成 CSR（证书签名请求）
openssl req -new -key server.key -out server.csr

# 自签名证书（仅测试用）
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

# 查看证书信息
openssl x509 -in server.crt -text -noout
```

---

## 四、TLS 握手过程

### 4.1 TLS 1.2 握手（2-RTT）

```
Client                                          Server
  │                                               │
  │ ──────── ClientHello ──────────────────────►  │
  │   (TLS 版本, 支持的密码套件, 客户端随机数)    │
  │                                               │
  │ ◄──────── ServerHello ────────────────────── │
  │   (选定套件, 服务器随机数)                    │
  │ ◄──────── Certificate ───────────────────── │
  │   (服务器证书)                               │
  │ ◄──────── ServerKeyExchange ──────────────── │
  │   (DH 参数)                                  │
  │ ◄──────── ServerHelloDone ────────────────── │
  │                                               │
  │ ──────── ClientKeyExchange ────────────────► │
  │   (预主密钥用服务器公钥加密)                  │
  │ ──────── ChangeCipherSpec ─────────────────► │
  │ ──────── Finished ─────────────────────────►│
  │                                               │
  │ ◄──────── ChangeCipherSpec ─────────────── │
  │ ◄──────── Finished ─────────────────────────│
  │                                               │
  │            === 应用数据 ===                   │
```

### 4.2 TLS 1.3 握手（1-RTT，甚至 0-RTT）

TLS 1.3 精简了握手流程：

```
Client                                          Server
  │                                               │
  │ ──── ClientHello + KeyShare ────────────────► │
  │                                               │
  │ ◄── ServerHello + KeyShare ─────────────────│
  │ ◄── EncryptedExtensions ─────────────────────│
  │ ◄── Certificate ─────────────────────────────│
  │ ◄── Finished ────────────────────────────────│
  │                                               │
  │ ──── Finished ──────────────────────────────►│
  │                                               │
  │            === 应用数据 ===                   │
```

### 4.3 密钥推导

```
客户端随机数 + 服务器随机数 + 预主密钥
            ↓ HKDF
        主密钥 Master Secret
            ↓
    会话密钥（双向各一组）
    ├── 写密钥
    ├── 写 IV
    └── MAC 密钥
```

---

## 五、HTTPS 优化实践

### 5.1 性能开销分析

| 环节          | 开销                     |
| ------------- | ------------------------ |
| TCP 握手      | 1-RTT                    |
| TLS 1.2 握手  | 2-RTT                    |
| TLS 1.3 握手  | 1-RTT                    |
| 证书验证      | 1-RTT（OCSP）            |
| 密钥计算      | 非对称运算 CPU 开销      |

### 5.2 优化手段

| 手段               | 说明                                  |
| ------------------ | ------------------------------------- |
| **启用 TLS 1.3**   | 1-RTT 握手，支持 0-RTT               |
| **Session 复用**   | Session ID / Session Ticket           |
| **OCSP Stapling**  | 服务器代客户端查 OCSP 状态            |
| **HTTP/2**         | 多路复用，弥补握手开销                |
| **ECC 证书**       | 比 RSA 密钥短，握手更快               |
| **HSTS**           | 强制浏览器后续都走 HTTPS，避免重定向  |
| **证书透明度 CT**  | 监控证书签发                          |

### 5.3 HSTS 配置

```http
# 告诉浏览器一年内只走 HTTPS
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

加入 [HSTS Preload List](https://hstspreload.org/) 可避免首次请求被劫持。

---

## 六、常见问题

### 6.1 混合内容（Mixed Content）

HTTPS 页面加载 HTTP 资源会被浏览器拦截：

- **被动混合内容**（图片、视频）：警告但可加载
- **主动混合内容**（脚本、iframe）：直接阻止

解决：所有资源都走 HTTPS，或用 `upgrade-insecure-requests`：

```http
Content-Security-Policy: upgrade-insecure-requests
```

### 6.2 证书过期

Let's Encrypt 证书有效期 90 天，推荐自动续期：

```bash
certbot renew --dry-run
```

### 6.3 自签名证书开发

开发环境可用 `mkcert` 生成本地信任的证书：

```bash
brew install mkcert
mkcert -install
mkcert localhost 127.0.0.1
```

---

## 七、学习建议

1. **加密基础**：理解对称/非对称加密的取舍
2. **TLS 握手**：能画出 TLS 1.2 与 1.3 的时序图
3. **证书机制**：知道证书链如何验证，CSR 如何生成
4. **实战配置**：会用 Nginx 配置 HTTPS，启用 TLS 1.3、HSTS

---

## 参考

- [RFC 8446 - TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)
- [Let's Encrypt](https://letsencrypt.org/)
- [SSL Labs - SSL Server Test](https://www.ssllabs.com/ssltest/)
