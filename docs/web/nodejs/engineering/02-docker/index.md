---
title: Docker 部署
---

# Docker 部署

## 一、Dockerfile

### 1. 基础 Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源码
COPY . .

# 构建（TypeScript 项目）
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动
CMD ["node", "dist/app.js"]
```

### 2. 多阶段构建（减小镜像体积）

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

---

## 二、.dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
*.md
test
tests
__tests__
coverage
.nyc_output
```

---

## 三、构建与运行

```bash
# 构建镜像
docker build -t my-node-app .

# 运行容器
docker run -d \
  --name my-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=mysql://... \
  my-node-app

# 查看日志
docker logs my-app

# 进入容器
docker exec -it my-app sh

# 停止 / 删除
docker stop my-app
docker rm my-app
```

---

## 四、Docker Compose

`docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://root:password@db:3306/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: always

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: mydb
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  db_data:
  redis_data:
```

### 命令

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 停止
docker-compose down

# 重新构建
docker-compose up -d --build
```

---

## 五、最佳实践

### 1. 使用 Alpine 镜像

```dockerfile
FROM node:20-alpine  # 体积小（~50MB vs ~400MB）
```

### 2. 非 root 用户运行

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node . .
USER node
CMD ["node", "dist/app.js"]
```

### 3. 健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
```

### 4. 利用缓存优化构建

```dockerfile
# 先复制 package.json，利用缓存层
COPY package*.json ./
RUN npm ci
# 再复制源码（频繁变化）
COPY . .
```

---

## 六、下一步

- 上一章：[PM2 进程管理](/web/nodejs/engineering/01-pm2/)
- 下一章：[测试](/web/nodejs/engineering/03-testing/)
