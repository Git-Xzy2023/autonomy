---
title: Nginx 反向代理与负载均衡
---

# Nginx 反向代理与负载均衡

> 反向代理与负载均衡是 Nginx 最常用的功能。本章涵盖 proxy_pass 配置、upstream 负载均衡算法、WebSocket 代理与跨域处理。

---

## 一、反向代理

### 1.1 正向 vs 反向代理

```
正向代理（代理客户端）：
客户端 → 代理服务器 → 目标服务器
（服务器不知道真实客户端是谁，如 VPN）

反向代理（代理服务端）：
客户端 → 反向代理 → 后端服务器集群
（客户端不知道真实后端是谁，如 Nginx）
```

### 1.2 基础反向代理

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:8080;
    }
}
```

### 1.3 传递请求信息

```nginx
location /api/ {
    proxy_pass http://localhost:8080;

    # 传递真实客户端 IP
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # 超时设置
    proxy_connect_timeout 5s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;

    # 缓冲区
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
}
```

### 1.4 代理路径处理

```nginx
# 不带斜杠：完整路径传递
location /api/ {
    proxy_pass http://backend;  # 请求 /api/users → http://backend/api/users
}

# 带斜杠：替换 location 部分
location /api/ {
    proxy_pass http://backend/;  # 请求 /api/users → http://backend/users
}

# 带路径
location /api/ {
    proxy_pass http://backend/v1/;  # 请求 /api/users → http://backend/v1/users
}
```

---

## 二、负载均衡

### 2.1 upstream 基础

```nginx
http {
    upstream backend {
        server 192.168.1.10:8080;
        server 192.168.1.11:8080;
        server 192.168.1.12:8080;
    }

    server {
        listen 80;
        location / {
            proxy_pass http://backend;
        }
    }
}
```

### 2.2 负载均衡算法

#### 轮询（默认）

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    # 依次轮流
}
```

#### 加权轮询

```nginx
upstream backend {
    server 192.168.1.10:8080 weight=3;  # 分配 3/5 的请求
    server 192.168.1.11:8080 weight=2;  # 分配 2/5 的请求
}
```

#### ip_hash（会话保持）

```nginx
upstream backend {
    ip_hash;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}
# 同一 IP 始终访问同一台后端
```

#### least_conn（最少连接）

```nginx
upstream backend {
    least_conn;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}
# 请求转发到连接数最少的服务器
```

#### 一致性哈希

```nginx
upstream backend {
    hash $request_uri consistent;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}
```

### 2.3 健康检查

```nginx
upstream backend {
    server 192.168.1.10:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 max_fails=3 fail_timeout=30s;
}
# 30 秒内失败 3 次，标记为不可用 30 秒
```

### 2.4 备用服务器

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080 backup;   # 仅当其他都不可用时启用
    server 192.168.1.13:8080 down;      # 永久不可用（维护中）
}
```

---

## 三、WebSocket 代理

```nginx
server {
    listen 80;
    server_name ws.example.com;

    location /ws/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;  # 长连接超时
    }
}
```

---

## 四、跨域处理

```nginx
server {
    listen 80;
    server_name api.example.com;

    # CORS 预检请求
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization";
        add_header Access-Control-Max-Age 86400;
        return 204;
    }

    location / {
        # 简单请求添加 CORS 头
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE" always;
        proxy_pass http://localhost:8080;
    }
}
```

---

## 五、动静分离

```nginx
server {
    listen 80;
    server_name example.com;

    # 静态资源：Nginx 直接服务
    location /static/ {
        root /var/www;
        expires 30d;
        access_log off;
    }

    # 动态请求：转发到后端
    location /api/ {
        proxy_pass http://backend;
    }

    # 前端 SPA
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 六、灰度发布

### 6.1 按 IP 灰度

```nginx
upstream stable {
    server 192.168.1.10:8080;
}

upstream canary {
    server 192.168.1.20:8080;
}

split_clients "${remote_addr}" $upstream_group {
    10% canary;   # 10% 流量到灰度
    * stable;
}

server {
    listen 80;
    location / {
        proxy_pass http://$upstream_group;
    }
}
```

### 6.2 按 Cookie 灰度

```nginx
map $cookie_version $upstream_group {
    default stable;
    "canary" canary;
}

server {
    location / {
        proxy_pass http://$upstream_group;
    }
}
```

---

## 七、常见配置模板

### 7.1 前端 + API 部署

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # SPA 前端
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 7.2 多域名 HTTPS

```nginx
server {
    listen 443 ssl http2;
    server_name app.example.com;
    ssl_certificate     /etc/ssl/app.pem;
    ssl_certificate_key /etc/ssl/app.key;

    location / {
        root /var/www/app;
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl http2;
    server_name admin.example.com;
    ssl_certificate     /etc/ssl/admin.pem;
    ssl_certificate_key /etc/ssl/admin.key;

    location / {
        root /var/www/admin;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 八、学习建议

1. **proxy_pass**：注意带不带斜杠的路径差异
2. **负载均衡算法**：根据场景选择（会话保持用 ip_hash）
3. **动静分离**：静态资源 Nginx 直接服务，动态请求转发
4. **健康检查**：max_fails + fail_timeout 是基本保障

---

## 参考

- [Nginx 反向代理文档](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Nginx 负载均衡](https://nginx.org/en/docs/http/load_balancing.html)
