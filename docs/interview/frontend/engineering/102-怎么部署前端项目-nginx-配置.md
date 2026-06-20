---
title: "你是怎么部署前端项目的？Nginx 里有哪些关键配置？"
---

# 你是怎么部署前端项目的？Nginx 里有哪些关键配置？

**核心考察点**：是否理解"构建产物到底怎么变成用户能访问的页面"。

**一个典型 Nginx 配置**：

```nginx
server {
  listen 80;
  server_name app.example.com;
  root /var/www/app;
  index index.html;

  # SPA 路由 fallback —— 非常重要！否则刷新 /users/123 会 404
  location / {
    try_files $uri $uri/ /index.html;
  }

  # 静态资源长期缓存（因为文件名带 contenthash）
  location ~* \.(js|css|png|jpg|jpeg|webp|svg|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
  }

  # HTML 不缓存，保证每次发布用户能拿到最新
  location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # 接口代理
  location /api/ {
    proxy_pass http://backend-service:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # 开启 gzip
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
  gzip_min_length 1024;
}
```

**容易忽略的点**：

- **SPA fallback**：`try_files $uri /index.html`。
- **HTML 不缓存**：否则用户永远拿旧页面。
- **静态资源强缓存**：带 hash 的资源文件可以一年不失效。
- **gzip / brotli**：文本类资源体积减 60%+。
- **HTTPS / HSTS**：生产环境必须。
- **安全头**：`X-Content-Type-Options: nosniff`、`X-Frame-Options`、`Content-Security-Policy`。
