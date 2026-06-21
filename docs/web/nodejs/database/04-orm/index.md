---
title: ORM（Prisma / TypeORM）
---

# ORM（Prisma / TypeORM）

## 一、Prisma

Prisma 是现代化的 Node.js ORM，提供类型安全的数据库访问。

### 1. 安装

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

### 2. Schema 定义

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  age       Int?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String?
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
```

### 3. 生成客户端

```bash
npx prisma generate    # 生成客户端
npx prisma migrate dev # 创建迁移
npx prisma studio      # 可视化管理
```

### 4. 使用

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 查询
const users = await prisma.user.findMany({
  where: { age: { gt: 18 } },
  include: { posts: true },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 10,
});

const user = await prisma.user.findUnique({
  where: { email: 'alice@test.com' }
});

// 创建
const newUser = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@test.com',
    age: 30,
    posts: {
      create: [{ title: 'Hello', content: '...' }]
    }
  },
  include: { posts: true }
});

// 更新
await prisma.user.update({
  where: { id: 1 },
  data: { age: 31 }
});

// 删除
await prisma.user.delete({ where: { id: 1 } });

// 事务
await prisma.$transaction([
  prisma.user.create({ data: { name: 'A' } }),
  prisma.user.create({ data: { name: 'B' } }),
]);
```

---

## 二、TypeORM

TypeORM 是受 Hibernate 启发的 ORM，支持 Active Record 和 Data Mapper 模式。

### 1. 安装

```bash
npm install typeorm mysql2 reflect-metadata
```

### 2. 实体定义

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  age: number;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;
}
```

### 3. 连接配置

```typescript
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'mydb',
  entities: [User, Post],
  synchronize: process.env.NODE_ENV !== 'production',
});

await AppDataSource.initialize();
```

### 4. 使用 Repository

```typescript
const userRepo = AppDataSource.getRepository(User);

// 查询
const users = await userRepo.find({
  where: { age: 10 },  // 简单条件
  order: { createdAt: 'DESC' },
  skip: 0,
  take: 10,
  relations: ['posts'],
});

const user = await userRepo.findOne({ where: { id: 1 } });

// 创建
const newUser = userRepo.create({ name: 'Alice', email: 'alice@test.com' });
await userRepo.save(newUser);

// 更新
await userRepo.update(1, { age: 31 });

// 删除
await userRepo.delete(1);

// QueryBuilder（复杂查询）
const users = await userRepo
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'post')
  .where('user.age > :age', { age: 18 })
  .orderBy('user.createdAt', 'DESC')
  .getMany();
```

### 5. 事务

```typescript
await AppDataSource.transaction(async (manager) => {
  await manager.save(User, { name: 'Alice' });
  await manager.save(Post, { title: 'Hello', authorId: 1 });
});
```

---

## 三、Prisma vs TypeORM 对比

| 特性 | Prisma | TypeORM |
|------|--------|---------|
| Schema 定义 | Prisma Schema（独立文件） | 装饰器 + 实体类 |
| 类型安全 | 极强（自动生成类型） | 一般（需手动类型） |
| 迁移 | 自动生成 | 手动 / 自动 |
| 查询方式 | 链式 API | Repository / QueryBuilder |
| 学习曲线 | 低 | 中 |
| 性能 | 好 | 好 |
| 适用场景 | 新项目 | 大型项目 / Angular 风格 |

---

## 四、下一步

- 上一章：[Redis](/web/nodejs/database/03-redis/)
- 下一级：[PM2 进程管理](/web/nodejs/engineering/01-pm2/)
