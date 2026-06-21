---
title: NestJS 入门与 CLI
---

# NestJS 入门与 CLI

## 一、什么是 NestJS？

NestJS 是一个用于构建高效、可扩展的 Node.js 服务端应用的框架，基于 TypeScript，灵感来自 Angular。

### 核心特性

- 🏗️ **模块化架构**：基于模块组织代码
- 💉 **依赖注入**：内置 IoC 容器
- 🎯 **装饰器**：使用装饰器声明控制器、路由、参数
- 🔌 **平台无关**：底层可切换 Express / Fastify
- 📦 **企业级**：支持微服务、GraphQL、WebSocket

---

## 二、安装与创建项目

### 1. 安装 CLI

```bash
npm install -g @nestjs/cli
```

### 2. 创建项目

```bash
nest new my-nest-app
```

选择包管理器（npm / yarn / pnpm），等待安装完成。

### 3. 启动

```bash
cd my-nest-app

# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run start:prod
```

访问 `http://localhost:3000`。

---

## 三、项目结构

```
src/
├── app.controller.ts        # 控制器
├── app.controller.spec.ts   # 控制器测试
├── app.module.ts            # 根模块
├── app.service.ts           # 服务
├── main.ts                  # 入口文件
└── main.ts
```

### `main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

### `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### `app.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### `app.service.ts`

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

---

## 四、CLI 命令

### 1. 生成资源

```bash
# 生成完整的 CRUD 资源
nest generate resource users

# 生成的内容：
# src/users/
#   ├── dto/
#   │   ├── create-user.dto.ts
#   │   └── update-user.dto.ts
#   ├── entities/
#   │   └── user.entity.ts
#   ├── users.controller.ts
#   ├── users.module.ts
#   └── users.service.ts
```

### 2. 生成单个文件

```bash
nest g controller users      # 控制器
nest g service users         # 服务
nest g module users          # 模块
nest g middleware logger     # 中间件
nest g guard auth            # 守卫
nest g interceptor logging   # 拦截器
nest g pipe validation       # 管道
nest g filter http-exception # 异常过滤器
```

### 3. 其他命令

```bash
# 查看帮助
nest --help

# 指定源目录
nest g service users --path src/modules
```

---

## 五、第一个 Controller

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(@Query('page') page: number) {
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, name: 'Alice' };
  }

  @Post()
  create(@Body() createUserDto: { name: string }) {
    return { id: Date.now(), ...createUserDto };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: { name: string }) {
    return { id, ...updateUserDto };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { deleted: true };
  }
}
```

---

## 六、切换到 Fastify

NestJS 默认使用 Express，可切换到 Fastify 获得更好性能：

```bash
npm install @nestjs/platform-fastify fastify
```

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  await app.listen(3000);
}
bootstrap();
```

---

## 七、下一步

- 下一章：[模块与依赖注入](/web/nodejs/nestjs/02-modules/)
- 上一级：[NestJS 框架](/web/nodejs/nestjs/)
