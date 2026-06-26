---
title: Nginx 基础与配置
---

# Nginx 基础与配置

> 本章介绍 Nginx 的安装、配置文件结构、location 匹配规则、变量与常用指令，是上手 Nginx 的基础。

---

## 一、Nginx 概述

### 1.1 什么是 Nginx

Nginx 是高性能的 HTTP 服务器与反向代理，特点是：
- 🚀 **事件驱动**：异步非阻塞，单机数万并发
- 💾 **内存占用低**：相比 Apache 更省资源
- 🔧 **配置简单**：声明式配置
- 📦 **模块化**：功能通过模块扩展

### 1.2 Nginx vs Apache

| 对比项     | Nginx              | Apache            |
| ---------- | ------------------ | ----------------- |
| 架构       | 事件驱动           | 进程/线程         |
| 并发       | 数万               | 数百              |
| 内存       | 低                 | 高                |
| 动态内容   | 反向代理           | 原生支持          |
| 静态资源   | 强                 | 一般              |
| 配置       | 简单               | 较复杂            |

---

## 二、安装

### 2.1 各平台安装

```bash
# macOS
brew install nginx
nginx                   # 启动
brew services start nginx  # 后台启动

# Ubuntu
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Docker
docker run -d --name nginx -p 80:80 nginx:latest

# 检查
nginx -v                # 版本
nginx -t                # 测试配置
nginx -s reload         # 重新加载
nginx -s stop            # 停止
```

### 2.2 目录结构

```
/etc/nginx/
├── nginx.conf          # 主配置
├── sites-available/     # 站点配置（Debian 系）
├── sites-enabled/       # 启用的站点（软链）
├── conf.d/             # 额外配置（RHEL 系）
├── mime.types          # MIME 类型
└── modules/            # 模块
```

---

## 三、配置文件结构

### 3.1 整体结构

```nginx
# 全局块
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /var/run/nginx.pid;

# events 块
events {
    worker_connections 1024;
}

# http 块
http {
    include       mime.types;
    default_type  application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';

    sendfile        on;
    keepalive_timeout  65;

    # server 块（虚拟主机）
    server {
        listen 80;
        server_name example.com;

        location / {
            root /usr/share/nginx/html;
            index index.html;
        }
    }

    # 可以有多个 server
    server {
        listen 80;
        server_name api.example.com;
        # ...
    }
}
```

### 3.2 配置层级

```
main（全局）
├── events
└── http
    ├── upstream（负载均衡组）
    ├── server（虚拟主机）
    │   └── location（URL 匹配）
    │       └── upstream
    └── server
```

---

## 四、location 匹配规则

### 4.1 匹配优先级

```nginx
location = / {
    # 精确匹配，优先级最高
}

location ^~ /static/ {
    # 前缀匹配，匹配后不再正则
}

location ~ \.(gif|jpg|png)$ {
    # 正则匹配（区分大小写）
}

location ~* \.(gif|jpg|png)$ {
    # 正则匹配（不区分大小写）
}

location / {
    # 普通前缀匹配，优先级最低
}
```

### 4.2 匹配顺序

```
1. =  精确匹配（命中即停止）
2. ^~ 前缀匹配（命中即停止，不走正则）
3. ~ / ~* 正则匹配（按配置顺序，先匹配先停止）
4. 无修饰符前缀匹配（最长匹配优先）
```

### 4.3 实战示例

```nginx
server {
    listen 80;
    server_name example.com;

    # 首页精确匹配
    location = / {
        proxy_pass http://localhost:3000;
    }

    # 静态资源（不走正则）
    location ^~ /static/ {
        root /var/www;
        expires 30d;
    }

    # 图片（正则）
    location ~* \.(gif|jpg|jpeg|png|css|js|ico)$ {
        root /var/www;
        expires 7d;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://localhost:8080;
    }

    # 其他请求
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 五、root 与 alias

### 5.1 root

```nginx
location /static/ {
    root /var/www;
}
# 请求 /static/img/logo.png → /var/www/static/img/logo.png
# root 拼接完整路径（含 location）
```

### 5.2 alias

```nginx
location /static/ {
    alias /var/www/assets/;
}
# 请求 /static/img/logo.png → /var/www/assets/img/logo.png
# alias 替换 location 部分
```

> 区别：root 把 location 追加到 root 路径；alias 用 alias 替换 location。

---

## 六、try_files

### 6.1 SPA 单页应用

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
# 1. 查找 $uri 对应文件
# 2. 查找 $uri/ 对应目录
# 3. 都没有则返回 index.html（前端路由接管）
```

### 6.2 其他用法

```nginx
# 指定默认文件
try_files $uri =404;

# 多个 fallback
try_files $uri $uri/index.html /default.html;
```

---

## 七、常用变量

### 7.1 内置变量

| 变量                 | 说明               |
| -------------------- | ------------------ |
| `$host`              | 请求的 Host         |
| `$remote_addr`       | 客户端 IP           |
| `$request_uri`       | 完整 URI（含参数）  |
| `$uri`               | URI（不含参数）     |
| `$args`              | 查询参数            |
| `$http_user_agent`   | User-Agent         |
| `$http_referer`      | Referer             |
| `$scheme`            | http / https       |
| `$request_method`    | GET / POST 等       |
| `$status`            | 响应状态码          |

### 7.2 if 判断

```nginx
location / {
    if ($request_method = POST) {
        return 405;
    }

    if ($http_user_agent ~* "spider") {
        return 403;
    }

    if ($scheme = http) {
        return 301 https://$host$request_uri;
    }
}
```

---

## 八、日志

### 8.1 访问日志

```nginx
log_format main '$remote_addr - $remote_user [$time_local] '
                '"$request" $status $body_bytes_sent '
                '"$http_referer" "$http_user_agent" '
                '$request_time $upstream_response_time';

access_log /var/log/nginx/access.log main;
```

### 8.2 错误日志

```nginx
error_log /var/log/nginx/error.log warn;
# 级别：debug | info | notice | warn | error | crit
```

### 8.3 日志切割

```bash
# logrotate 配置 /etc/logrotate.d/nginx
/var/log/nginx/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    missingok
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

---

## 九、学习建议

1. **配置结构**：理解 main/events/http/server/location 层级
2. **location 匹配**：这是 Nginx 配置的核心
3. **root vs alias**：最容易混淆的概念
4. **try_files**：SPA 部署必备

---

## 参考

- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Nginx 中文文档](https://nginx.org/cn/docs/)
