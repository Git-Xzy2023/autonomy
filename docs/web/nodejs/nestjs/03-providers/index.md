---
title: Controller 与 Provider
---

# Controller 与 Provider

## 一、Controller 控制器

控制器处理传入的 HTTP 请求，返回响应。

### 1. 基本控制器

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [];
  }
}
// 路由：GET /users
```

### 2. 路由装饰器

| 装饰器 | HTTP 方法 |
|--------|-----------|
| `@Get()` | GET |
| `@Post()` | POST |
| `@Put()` | PUT |
| `@Patch()` | PATCH |
| `@Delete()` | DELETE |
| `@All()` | ALL |

```typescript
@Controller('users')
export class UsersController {
  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Post()
  create(@Body() dto: CreateUserDto) {}

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
```

---

## 二、参数提取

### 1. 路径参数

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  return { id };
}

// 多个参数
@Get(':userId/posts/:postId')
findPost(@Param('userId') userId: string, @Param('postId') postId: string) {
  return { userId, postId };
}
```

### 2. 查询参数

```typescript
@Get()
findAll(@Query('page') page: number, @Query('limit') limit: number) {
  return { page, limit };
}

// 所有查询参数
@Get()
findAll(@Query() query: { page: number; limit: number }) {
  return query;
}
```

### 3. 请求体

```typescript
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return createUserDto;
}
```

### 4. 请求头

```typescript
@Get()
findAll(@Headers('authorization') auth: string) {
  console.log(auth);
}

// 所有请求头
@Get()
findAll(@Headers() headers: Record<string, string>) {}
```

### 5. 其他

```typescript
@Get()
findAll(
  @Req() req: Request,        // 原生请求
  @Res() res: Response,       // 原生响应（注意：使用后失去 NestJS 的响应处理）
  @Session() session: any,    // Session
  @Ip() ip: string,           // IP
  @HostParam('name') host: string,  // Host 参数
) {}
```

---

## 三、DTO（数据传输对象）

DTO 用于定义请求体结构，配合 `class-validator` 进行校验：

```bash
npm install class-validator class-transformer
```

```typescript
// dto/create-user.dto.ts
import { IsString, IsEmail, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(0)
  age: number;
}
```

### 启用全局校验

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,        // 去除未定义的属性
  forbidNonWhitelisted: true,  // 抛出错误
  transform: true,        // 自动类型转换
}));
```

---

## 四、响应处理

### 1. 状态码

```typescript
@Post()
@HttpCode(204)  // 自定义状态码
create() {}

@Get()
@HttpCode(HttpStatus.OK)
findAll() {}
```

### 2. 响应头

```typescript
@Get()
@Header('Cache-Control', 'none')
findAll() {}
```

### 3. 重定向

```typescript
@Get()
@Redirect('https://example.com', 301)
redirect() {}
```

---

## 五、Provider 服务

Provider 负责业务逻辑，用 `@Injectable()` 装饰。

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(u => u.id === id);
  }

  create(createUserDto: CreateUserDto) {
    const user = { id: Date.now(), ...createUserDto };
    this.users.push(user);
    return user;
  }

  remove(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }
}
```

### 在控制器中使用

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.usersService.remove(id);
  }
}
```

---

## 六、异步处理

NestJS 支持 async/await，返回 Promise 或 Observable 会自动处理：

```typescript
@Injectable()
export class UsersService {
  async findAll() {
    return await this.userRepository.find();
  }
}
```

---

## 七、下一步

- 上一章：[模块与依赖注入](/web/nodejs/nestjs/02-modules/)
- 下一章：[中间件 / 守卫 / 拦截器](/web/nodejs/nestjs/04-middleware/)
