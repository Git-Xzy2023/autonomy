---
title: 04 事务
---

# Spring 事务

> Spring 事务管理简化了数据库事务的代码。通过 `@Transactional` 声明式事务，方法执行成功提交，异常回滚。

## 编程式 vs 声明式

```java
// 编程式：手动管理（不推荐）
TransactionStatus tx = txManager.getTransaction(new DefaultTransactionDefinition());
try {
  dao.update(...);
  txManager.commit(tx);
} catch (Exception e) {
  txManager.rollback(tx);
  throw e;
}

// 声明式：注解搞定（推荐）
@Transactional
public void transfer(Long from, Long to, BigDecimal amount) {
  accountDao.deduct(from, amount);
  accountDao.add(to, amount);
}
```

## @Transactional

```java
@Transactional(
  propagation = Propagation.REQUIRED,    // 传播行为
  isolation = Isolation.READ_COMMITTED,  // 隔离级别
  timeout = 30,                           // 超时秒数
  readOnly = false,                       // 只读
  rollbackFor = Exception.class,          // 哪些异常回滚
  noRollbackFor = BusinessException.class // 哪些不回滚
)
public void doBusiness() { ... }
```

### 可加位置

```java
@Transactional
public class UserService { ... }      // 类级别：所有 public 方法

public class UserService {
  @Transactional                       // 方法级别（优先于类级别）
  public void save() { ... }
}
```

## 传播行为

当前方法调用另一个事务方法时，事务如何传播。

| 传播行为          | 说明                                   | 场景                  |
| ----------------- | -------------------------------------- | --------------------- |
| **REQUIRED**（默认）| 有则加入，无则新建                      | 大多数情况            |
| **REQUIRES_NEW**  | 总是新建，挂起当前事务                  | 日志记录（独立提交）  |
| **NESTED**        | 有则创建保存点嵌套，无则新建            | 部分回滚              |
| SUPPORTS          | 有则加入，无则非事务运行                | 查询                  |
| NOT_SUPPORTED     | 非事务运行，挂起当前事务                | 不需要事务的操作      |
| NEVER             | 非事务运行，有事务则抛异常              | 不允许在事务中调用    |
| MANDATORY         | 必须在事务中，无则抛异常                | 强制要求事务          |

```java
@Service
public class OrderService {
  @Transactional                       // 开启事务 T1
  public void createOrder() {
    orderDao.insert(order);
    pointService.addPoint(userId);     // 调用下面方法
  }
}

@Service
public class PointService {
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  // 即使 addPoint 失败，createOrder 的订单插入也不会回滚
  public void addPoint(Long userId) { ... }
}
```

## 隔离级别

对应数据库的四种隔离级别。

| 隔离级别          | 脏读 | 不可重复读 | 幻读 | 说明                |
| ----------------- | ---- | ---------- | ---- | ------------------- |
| READ_UNCOMMITTED  | 可能 | 可能       | 可能 | 读未提交            |
| READ_COMMITTED    | 不   | 可能       | 可能 | Oracle 默认         |
| REPEATABLE_READ   | 不   | 不         | 可能 | MySQL 默认          |
| SERIALIZABLE      | 不   | 不         | 不   | 串行化，性能差      |

## 事务失效场景

```java
@Service
public class UserService {

  // ❌ 1. 自调用：同类中方法直接调用，绕过代理
  public void outer() {
    this.inner();   // 事务不生效（不是代理对象调用）
  }
  @Transactional
  public void inner() { ... }

  // ❌ 2. 方法非 public：默认只对 public 生效
  @Transactional
  void packageMethod() { ... }

  // ❌ 3. 异常被 catch 吞掉
  @Transactional
  public void m() {
    try { dao.update(); throw new RuntimeException(); }
    catch (Exception e) { /* 吞掉，事务不回滚 */ }
  }

  // ❌ 4. 默认只回滚 RuntimeException，受检异常不回滚
  @Transactional
  public void m2() throws IOException {
    dao.update();
    throw new IOException();   // 不回滚（需指定 rollbackFor = Exception.class）
  }

  // ❌ 5. 异常类型不匹配
  @Transactional(rollbackFor = BusinessException.class)
  public void m3() { throw new RuntimeException(); }   // 不回滚

  // ❌ 6. Bean 未被 Spring 管理
  // 类没加 @Service 等注解，new 出来的对象，事务不生效
}
```

### 自调用的解决方案

```java
// 方案 1：注入自己
@Service
public class UserService {
  @Autowired
  private UserService self;   // 注入代理对象
  public void outer() { self.inner(); }
}

// 方案 2：从 AopContext 获取代理
public void outer() {
  ((UserService) AopContext.currentProxy()).inner();
}

// 方案 3：拆分到不同类（推荐）
```

## 实现原理

Spring 事务基于 AOP 动态代理：
1. `@Transactional` 方法被代理拦截
2. 代理在方法前 `getTransaction` 开启事务
3. 执行原方法
4. 正常 → `commit`；异常匹配 → `rollback`

```
代理对象
  ├─ getTransaction()   ← 开启事务
  ├─ target.method()    ← 执行业务
  ├─ commit() / rollback()  ← 提交或回滚
```

底层用 `TransactionInterceptor` 实现，事务管理器 `PlatformTransactionManager`：
- `DataSourceTransactionManager`：JDBC / MyBatis
- `JpaTransactionManager`：JPA / Hibernate
- `JtaTransactionManager`：分布式事务

## 小结

| 知识点       | 要点                                    |
| ------------ | --------------------------------------- |
| 声明式       | @Transactional                          |
| 传播行为     | REQUIRED 默认 / REQUIRES_NEW 独立事务   |
| 隔离级别     | 对应数据库四档                          |
| 失效场景     | 自调用 / 非 public / 吞异常 / 异常不匹配|
| 原理         | AOP 代理 + TransactionInterceptor       |
