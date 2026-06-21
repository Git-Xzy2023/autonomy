---
title: 中间件 / 守卫 / 拦截器
---

# 中间件 / 守卫 / 拦截器 / 管道 / 过滤器

NestJS 有多种处理横切关注点的机制，执行顺序如下：

```
请求 → 中间件 → 守卫 → 拦截器（前）→ 管道 → 控制器
                                                        ↓
响应 ← 拦截器（后） ← 异常过滤器 ←─────────────────────┘
```

---

## 一、Middleware 中间件

中间件在路由处理之前执行，类似 Express 中间件。

### 1. 类中间件

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}
```

### 2. 在模块中应用

```typescript
@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users');  // 应用到 /users 路由
      // .forRoutes({ path: 'users', method: RequestMethod.GET });
      // .forRoutes('*');  // 所有路由
  }
}
```

### 3. 函数中间件

```typescript
consumer
  .apply((req, res, next) => {
    console.log('函数中间件');
    next();
  })
  .forRoutes('*');
```

---

## 二、Guard 守卫

守卫决定请求是否应该被处理（鉴权）。

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.headers.authorization === 'Bearer valid-token';
  }
}
```

### 使用守卫

```typescript
// 控制器级别
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {}

// 方法级别
@Get()
@UseGuards(AuthGuard)
findAll() {}

// 全局
app.useGlobalGuards(new AuthGuard());
// 或在模块中
@Module({
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
```

### 基于角色的守卫

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user?.roles?.includes('admin');
  }
}

// 自定义装饰器
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// 使用
@Get('admin')
@Roles('admin')
@UseGuards(RolesGuard)
adminOnly() {}
```

---

## 三、Interceptor 拦截器

拦截器在方法执行前后添加逻辑（日志、缓存、转换响应等）。

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    console.log('请求前...');

    return next
      .handle()
      .pipe(
        tap(() => console.log(`请求后... ${Date.now() - start}ms`))
      );
  }
}
```

### 响应转换

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }))
    );
  }
}
```

### 超时拦截器

```typescript
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException();
        }
        throw err;
      })
    );
  }
}
```

### 使用拦截器

```typescript
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {}

// 全局
app.useGlobalInterceptors(new LoggingInterceptor());
```

---

## 四、Pipe 管道

管道用于数据转换和验证。

### 1. 内置管道

| 管道 | 说明 |
|------|------|
| `ValidationPipe` | 验证 DTO |
| `ParseIntPipe` | 转换为整数 |
| `ParseFloatPipe` | 转换为浮点数 |
| `ParseBoolPipe` | 转换为布尔值 |
| `ParseArrayPipe` | 转换为数组 |
| `ParseUUIDPipe` | 验证 UUID |

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
// 如果 id 不是数字，自动返回 400 错误
```

### 2. 全局验证管道

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
}));
```

### 3. 自定义管道

```typescript
@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('参数必须是数字');
    }
    return val;
  }
}
```

---

## 五、Exception Filter 异常过滤器

异常过滤器处理未捕获的异常，返回自定义响应。

### 1. 内置异常

```typescript
throw new BadRequestException('参数错误');
throw new UnauthorizedException('未授权');
throw new NotFoundException('资源不存在');
throw new ForbiddenException('禁止访问');
throw new ConflictException('冲突');
throw new InternalServerErrorException('服务器错误');
```

### 2. 自定义异常过滤器

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 3. 使用

```typescript
@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UsersController {}

// 全局
app.useGlobalFilters(new HttpExceptionFilter());
```

---

## 六、执行顺序总结

```
请求
  ↓
中间件（Middleware）
  ↓
守卫（Guard）—— 返回 false 则拒绝请求
  ↓
拦截器（Interceptor）—— 前置
  ↓
管道（Pipe）—— 参数转换/验证
  ↓
控制器方法（Controller）
  ↓
拦截器（Interceptor）—— 后置
  ↓
异常过滤器（Exception Filter）—— 如果有异常
  ↓
响应
```

---

## 七、下一步

- 上一章：[Controller / Provider](/web/nodejs/nestjs/03-providers/)
- 下一章：[最佳实践](/web/nodejs/nestjs/05-best-practices/)
