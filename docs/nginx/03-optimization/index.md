---
title: Nginx 性能优化与安全
---

# Nginx 性能优化与安全

> 本章涵盖 Nginx 性能调优（worker、keepalive、gzip、缓存）、HTTPS 配置、安全加固（限流、防盗链、DDoS 防护）。

---

## 一、性能优化

### 1.1 worker 进程

```nginx
# 全局配置
worker_processes auto;         # 与 CPU 核心数一致
worker_cpu_affinity auto;      # CPU 亲和性
worker_rlimit_nofile 65535;   # 最大文件描述符

events {
    worker_connections 10240;  # 每个 worker 的连接数
    use epoll;                 # Linux 用 epoll，macOS 用 kqueue
    multi_accept on;           # 一次接受多个连接
}
```

总并发数 = `worker_processes × worker_connections`。

### 1.2 keepalive

```nginx
http {
    # 客户端 keepalive
    keepalive_timeout 65;        # 超时时间
    keepalive_requests 100;     # 单连接最大请求数
    tcp_nodelay on;             # 禁用 Nagle 算法

    # 到后端的 keepalive
    upstream backend {
        server 127.0.0.1:8080;
        keepalive 32;          # 保持 32 个空闲长连接
    }

    server {
        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Connection "";  # 清空，复用连接
        }
    }
}
```

### 1.3 sendfile 与零拷贝

```nginx
http {
    sendfile on;           # 零拷贝，文件直接从内核到 socket
    tcp_nopush on;         # 包合并发送（配合 sendfile）
    tcp_nodelay on;        # 禁用 Nagle，小包立即发送
    aio on;                # 异步 IO
}
```

### 1.4 Gzip 压缩

```nginx
http {
    gzip on;
    gzip_min_length 1k;          # 小于 1k 不压缩
    gzip_comp_level 6;           # 压缩级别（1-9，6 是平衡点）
    gzip_types text/plain
               text/css
               text/javascript
               application/javascript
               application/json
               application/xml
               image/svg+xml;
    gzip_vary on;
    gzip_proxied any;            # 代理请求也压缩

    # Brotli 压缩（更高效，需模块）
    # brotli on;
    # brotli_comp_level 4;
    # brotli_types text/plain text/css application/javascript;
}
```

### 1.5 缓存

```nginx
# 代理缓存
http {
    proxy_cache_path /var/cache/nginx
                     levels=1:2
                     keys_zone=api_cache:10m
                     max_size=1g
                     inactive=60m
                     use_temp_path=off;

    server {
        location /api/ {
            proxy_cache api_cache;
            proxy_cache_key "$scheme$request_method$host$request_uri";
            proxy_cache_valid 200 10m;       # 200 响应缓存 10 分钟
            proxy_cache_valid 404 1m;
            proxy_cache_use_stale error timeout updating;  # 后端异常时用旧缓存
            add_header X-Cache-Status $upstream_cache_status;
            proxy_pass http://backend;
        }
    }
}
```

`$upstream_cache_status` 值：
- `MISS`：未命中，请求后端
- `HIT`：命中缓存
- `EXPIRED`：过期，请求后端
- `STALE`：用旧缓存
- `UPDATING`：正在更新

### 1.6 浏览器缓存

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
    expires 30d;
    add_header Cache-Control "public, no-transform";
    access_log off;
}

# HTML 不缓存
location ~* \.html$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## 二、HTTPS 配置

### 2.1 基础 HTTPS

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate     /etc/ssl/fullchain.pem;
    ssl_certificate_key /etc/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    location / {
        proxy_pass http://backend;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

### 2.2 Let's Encrypt 免费证书

```bash
# 安装 certbot
brew install certbot

# 申请证书（Nginx 插件自动修改配置）
sudo certbot --nginx -d example.com -d www.example.com

# 自动续期
sudo crontab -e
0 12 * * * /usr/local/bin/certbot renew --quiet
```

### 2.3 HSTS

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

强制浏览器使用 HTTPS，防止降级攻击。

---

## 三、安全加固

### 3.1 限流

```nginx
http {
    # 按 IP 限流：每秒 10 个请求
    limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;

    # 并发连接数限制：每 IP 20 个连接
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    server {
        # 请求限流（突发排队）
        location /api/ {
            limit_req zone=req_limit burst=20 nodelay;
            proxy_pass http://backend;
        }

        # 连接数限流
        location / {
            limit_conn conn_limit 20;
            proxy_pass http://backend;
        }
    }
}
```

### 3.2 防盗链

```nginx
location ~* \.(jpg|jpeg|png|gif|mp4)$ {
    valid_referers none blocked server_names
                   *.example.com example.*;

    if ($invalid_referer) {
        return 403;
        # 或返回一张防盗链图片
        # rewrite ^/ https://example.com/no-hotlink.jpg;
    }
}
```

### 3.3 隐藏版本号

```nginx
server_tokens off;
```

### 3.4 防止恶意请求

```nginx
server {
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }

    # 禁止访问备份文件
    location ~ ~$ {
        deny all;
    }

    # 限制请求体大小
    client_max_body_size 10m;

    # 限制请求方法
    if ($request_method !~ ^(GET|POST|PUT|DELETE|HEAD|OPTIONS)$ ) {
        return 405;
    }

    # 阻止 User-Agent 中的爬虫
    if ($http_user_agent ~* (bot|spider|crawler|scanner)) {
        return 403;
    }
}
```

### 3.5 IP 白名单/黑名单

```nginx
# 白名单
location /admin/ {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
    proxy_pass http://backend;
}

# 黑名单
location / {
    deny 1.2.3.4;
    deny 5.6.0.0/16;
    allow all;
    proxy_pass http://backend;
}
```

### 3.6 DDoS 防护

```nginx
# 限制连接数
limit_conn_zone $binary_remote_addr zone=addr:10m;

# 限制请求速率
limit_req_zone $binary_remote_addr zone=req:10m rate=5r/s;

# 限制请求体大小
client_body_buffer_size 1k;
client_header_buffer_size 1k;
client_max_body_size 1m;
large_client_header_buffers 2 1k;

server {
    limit_conn addr 10;        # 每 IP 最多 10 个连接
    limit_req zone=req burst=10;

    # 超时设置
    client_body_timeout 10;
    client_header_timeout 10;
    keepalive_timeout 5 5;
    send_timeout 10;
}
```

---

## 四、监控

### 4.1 状态页

```nginx
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}
```

访问 `/nginx_status` 输出：

```
Active connections: 15
server accepts handled requests
 8456 8456 32891
Reading: 0 Writing: 3 Waiting: 12
```

### 4.2 Prometheus 监控

```nginx
# nginx-prometheus-exporter
location /metrics {
    prometheus_metrics on;
}
```

---

## 五、常用配置速查

```nginx
# 完整生产配置示例
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 10240;
    use epoll;
    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    keepalive_timeout 65;
    keepalive_requests 100;

    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/javascript application/json;

    server_tokens off;

    limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;

    server {
        listen 80;
        server_name example.com;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name example.com;

        ssl_certificate     /etc/ssl/fullchain.pem;
        ssl_certificate_key /etc/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;

        client_max_body_size 10m;

        location / {
            limit_req zone=req_limit burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

---

## 六、学习建议

1. **worker 配置**：worker_processes 与 CPU 核心数匹配
2. **gzip**：压缩是前端性能优化利器
3. **HTTPS**：现代网站标配，Let's Encrypt 免费
4. **限流**：保护后端，防止恶意请求
5. **监控**：stub_status 简单实用

---

## 参考

- [Nginx 性能调优](https://nginx.org/en/docs/http/ngx_http_core_module.html)
- [Mozilla SSL 配置生成器](https://ssl-config.mozilla.org/)
