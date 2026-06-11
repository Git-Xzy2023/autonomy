# 前端需要注意哪些 HTTP？

## 缓存策略

- **强缓存**：`Expires`、`Cache-Control`（HTTP 1.1）
- **协商缓存**：`ETag`、`If-None-Match`、`Last-Modified`、`If-Modified-Since`
- 离线缓存：Service Worker

## 请求优化

- 减少请求数量：合并文件、CSS Sprites、内联图片
- 使用 CDN
- 预加载：`<link rel="preload">`

## 安全

- HTTPS：防止中间人攻击
- CSP（Content Security Policy）
- 设置正确的 CORS 响应头

## 性能优化

- 使用 HTTP/2
- 启用压缩：Accept-Encoding
- 图片优化：合适的格式与尺寸
