---
title: NestJS 模块与依赖注入
---

# 模块与依赖注入

## 一、模块（Module）

模块是组织应用的基本单元，用 `@Module()` 装饰器声明。

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],  // 控制器
  providers: [UsersService],        // 提供者（服务）
  imports: [DatabaseModule],        // 导入其他模块
  exports: [UsersService],          // 导出（供其他模块使用）
})
export class UsersModule {}
```

### 在根模块注册

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

---

## 二、依赖注入（DI）

NestJS 内置 IoC 容器，通过**构造函数注入**依赖：

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  private users = [{ id: 1, name: 'Alice' }];

  findAll() {
    return this.users;
  }
}

// users.controller.ts
@Controller('users')
export class UsersController {
  // 构造函数注入
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

### 依赖注入的类型

```typescript
// 1. 构造函数注入（推荐）
constructor(private readonly service: UsersService) {}

// 2. 属性注入
@Injectable()
export class UsersController {
  @Inject(UsersService)
  private readonly service: UsersService;
}
```

---

## 三、Provider 提供者

Provider 是可以被注入的服务，用 `@Injectable()` 装饰。

### 1. 标准提供者

```typescript
@Injectable()
export class UsersService {}

@Module({
  providers: [UsersService],
})
export class UsersModule {}
```

### 2. 自定义 Token

```typescript
// 使用字符串作为 Token
@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: { port: 3000 },
    },
  ],
})
export class AppModule {}

// 注入
@Injectable()
export class AppService {
  constructor(@Inject('CONFIG') private config: { port: number }) {}
}
```

### 3. useValue / useFactory

```typescript
@Module({
  providers: [
    // 静态值
    {
      provide: 'DB_CONFIG',
      useValue: { host: 'localhost', port: 5432 },
    },
    // 工厂函数
    {
      provide: 'CONNECTION',
      useFactory: (config: ConfigService) => {
        return createConnection(config.get('DB_URL'));
      },
      inject: [ConfigService],
    },
    // useClass（根据条件选择实现）
    {
      provide: 'PAYMENT_GATEWAY',
      useClass: process.env.NODE_ENV === 'production'
        ? StripeGateway
        : MockGateway,
    },
  ],
})
export class AppModule {}
```

---

## 四、模块共享与导出

### 1. 导出 Provider

```typescript
// users.module.ts
@Module({
  providers: [UsersService],
  exports: [UsersService],  // 导出后其他模块可使用
})
export class UsersModule {}
```

### 2. 在其他模块使用

```typescript
// posts.module.ts
@Module({
  imports: [UsersModule],  // 导入 UsersModule
  providers: [PostsService],
})
export class PostsModule {}

// posts.service.ts
@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}  // 可以注入
}
```

---

## 五、全局模块

`@Global()` 让模块全局可用，无需在每个模块导入：

```typescript
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

---

## 六、动态模块

动态模块允许在导入时配置：

```typescript
// config.module.ts
import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class ConfigModule {
  static forRoot(options: { env: string }): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG',
          useValue: loadConfig(options.env),
        },
      ],
      exports: ['CONFIG'],
    };
  }
}

// 使用
@Module({
  imports: [ConfigModule.forRoot({ env: 'production' })],
})
export class AppModule {}
```

### 常见的动态模块

```typescript
// TypeORM
TypeOrmModule.forRoot({ type: 'mysql', ... })
TypeOrmModule.forFeature([UserEntity])

// Mongoose
MongooseModule.forRoot('mongodb://localhost:27017/test')
MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])

// Config
ConfigModule.forRoot({ isGlobal: true })
```

---

## 七、作用域（Scope）

NestJS 默认是**单例**（Singleton）作用域，整个应用共享一个实例。

```typescript
@Injectable({ scope: Scope.REQUEST })  // 每个请求创建新实例
export class UsersService {}

@Injectable({ scope: Scope.TRANSIENT })  // 每次注入创建新实例
export class UsersService {}
```

> ⚠️ 使用 REQUEST 作用域会影响性能，谨慎使用。

---

## 八、下一步

- 上一章：[入门与 CLI](/web/nodejs/nestjs/01-intro/)
- 下一章：[Controller / Provider](/web/nodejs/nestjs/03-providers/)
