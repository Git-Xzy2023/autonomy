---
title: Next.js 部署
---

# Next.js 部署

> Next.js 应用的部署和优化。

---

## 一、构建优化

### 1.1 构建命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

### 1.2 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 输出模式
  output: 'standalone',  // 适合 Docker

  // 压缩
  compress: true,

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },

  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['lodash', 'antd']
  },

  // Webpack 配置
  webpack: (config) => {
    return config
  }
}

module.exports = nextConfig
```

---

## 二、环境变量

### 2.1 环境变量文件

```bash
# .env
DATABASE_URL=postgresql://localhost:5432/mydb
API_SECRET=secret

# .env.local（本地开发，不提交到 git）
DATABASE_URL=postgresql://localhost:5432/devdb

# .env.production
DATABASE_URL=postgresql://user:pass@prod-db:5432/proddb

# .env.development
NODE_ENV=development
```

### 2.2 使用环境变量

```typescript
// 服务端
const dbUrl = process.env.DATABASE_URL

# 客户端（必须以 NEXT_PUBLIC_ 开头）
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

### 2.3 类型声明

```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    API_SECRET: string
    NEXT_PUBLIC_API_URL: string
  }
}
```

---

## 三、Vercel 部署

### 3.1 部署步骤

```
┌─────────────────────────────────────────┐
│           Vercel 部署流程               │
├─────────────────────────────────────────┤
│                                         │
│  1. 推送代码到 GitHub                   │
│     ↓                                   │
│  2. 在 Vercel 导入项目                  │
│     ↓                                   │
│  3. 配置环境变量                        │
│     ↓                                   │
│  4. 自动构建和部署                      │
│     ↓                                   │
│  5. 获取部署 URL                        │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 vercel.json

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/$1" }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.example.com"
  }
}
```

### 3.3 CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署预览
vercel

# 部署生产
vercel --prod
```

---

## 四、Docker 部署

### 4.1 Dockerfile

```dockerfile
# 多阶段构建

# 1. 依赖安装
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. 构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. 运行
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### 4.2 next.config.js

```javascript
const nextConfig = {
  output: 'standalone'  // 必须设置
}

module.exports = nextConfig
```

### 4.3 docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://db:5432/mydb
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

### 4.4 构建和运行

```bash
# 构建镜像
docker build -t my-next-app .

# 运行容器
docker run -p 3000:3000 my-next-app

# 使用 docker-compose
docker-compose up -d
```

---

## 五、Node.js 服务器部署

### 5.1 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "my-app" -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs my-app

# 重启
pm2 restart my-app

# 停止
pm2 stop my-app
```

### 5.2 ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'my-next-app',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster'
  }]
}
```

---

## 六、Nginx 反向代理

### 6.1 Nginx 配置

```nginx
server {
    listen 80;
    server_name example.com;

    # 反向代理到 Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # 图片优化
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_cache my_cache;
    }
}
```

---

## 七、性能监控

### 7.1 Bundle 分析

```bash
# 安装
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  // 其他配置
})
```

```bash
# 运行分析
ANALYZE=true npm run build
```

### 7.2 Web Vitals

```typescript
// app/layout.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    // 上报到监控服务
    // analytics.track(metric.name, metric.value)
  })

  return null
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

---

## 八、SEO 优化

### 8.1 sitemap.ts

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())

  const postUrls = posts.map(post => ({
    url: `https://example.com/posts/${post.id}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  return [
    { url: 'https://example.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://example.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...postUrls
  ]
}
```

### 8.2 robots.ts

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/']
    },
    sitemap: 'https://example.com/sitemap.xml'
  }
}
```

---

## 九、总结

### ✅ 关键知识点

1. **构建优化**：next.config.js 配置
2. **环境变量**：.env 文件、NEXT_PUBLIC_
3. **Vercel 部署**：最简单的部署方式
4. **Docker 部署**：output: 'standalone'
5. **PM2**：Node.js 进程管理
6. **Nginx**：反向代理和缓存
7. **性能监控**：Bundle 分析、Web Vitals
8. **SEO**：sitemap.ts、robots.ts

### 🔜 下一章

- 下一章：[React 生态](/web/react-ecosystem/)
- 上一章：[数据获取](/web/react-ecosystem/nextjs/03-data-fetching/)
- 上一级：[Next.js](/web/react-ecosystem/nextjs/)
