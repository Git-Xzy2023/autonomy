---
title: 测试
---

# 测试

## 一、测试类型

| 类型 | 说明 | 工具 |
|------|------|------|
| 单元测试 | 测试单个函数/模块 | Jest |
| 集成测试 | 测试多个模块协作 | Jest + Supertest |
| E2E 测试 | 端到端测试 | Playwright / Cypress |

---

## 二、Jest 单元测试

### 1. 安装

```bash
npm install -D jest @types/jest ts-jest
```

### 2. 配置

`jest.config.js`：

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
```

### 3. 编写测试

```typescript
// utils/math.ts
export function add(a: number, b: number) {
  return a + b;
}

export function divide(a: number, b: number) {
  if (b === 0) throw new Error('除数不能为 0');
  return a / b;
}
```

```typescript
// __tests__/math.test.ts
import { add, divide } from '../utils/math';

describe('Math', () => {
  test('add', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
  });

  test('divide', () => {
    expect(divide(10, 2)).toBe(5);
    expect(() => divide(1, 0)).toThrow('除数不能为 0');
  });
});
```

### 4. Mock

```typescript
// 模拟模块
jest.mock('../utils/database');
import { db } from '../utils/database';

test('getUser', async () => {
  db.find.mockResolvedValue({ id: 1, name: 'Alice' });
  const user = await getUser(1);
  expect(user.name).toBe('Alice');
  expect(db.find).toHaveBeenCalledWith(1);
});

// 模拟函数
const mockFn = jest.fn();
mockFn.mockReturnValue(10);
mockFn.mockResolvedValue('async');

// 监视 spy
const spy = jest.spyOn(console, 'log');
spy.mockRestore();
```

---

## 三、集成测试（Supertest）

```bash
npm install -D supertest @types/supertest
```

```typescript
// __tests__/users.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Users API', () => {
  test('GET /api/users', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/users', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@test.com' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Alice');
  });

  test('GET /api/users/:id - 404', async () => {
    const res = await request(app).get('/api/users/9999');
    expect(res.status).toBe(404);
  });
});
```

---

## 四、NestJS 测试

```typescript
// users.controller.spec.ts
import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  test('findAll', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });
});
```

### E2E 测试

```typescript
// users.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/users (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/users');
    expect(res.status).toBe(200);
  });
});
```

---

## 五、运行测试

```bash
# 运行所有测试
npm test

# 监听模式
npm test -- --watch

# 生成覆盖率报告
npm test -- --coverage

# 运行特定文件
npm test -- users.test.ts
```

`package.json`：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

---

## 六、下一步

- 上一章：[Docker 部署](/web/nodejs/engineering/02-docker/)
- 下一章：[安全](/web/nodejs/engineering/04-security/)
