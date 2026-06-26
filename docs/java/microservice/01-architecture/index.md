---
title: 01 架构设计
---

# 微服务架构设计

> 微服务不是银弹，拆分前先理解：为什么拆、怎么拆、拆完的代价。本章涵盖拆分原则、CAP/BASE 理论、分布式事务、数据一致性。

## 单体 vs 微服务

### 单体架构

```
┌─────────────────────────────────┐
│         单体应用                │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ 用户 │ │ 订单 │ │ 商品 │    │
│  └──────┘ └──────┘ └──────┘    │
│         共享数据库              │
└─────────────────────────────────┘
```

- **优点**：开发简单、部署方便、调试容易
- **缺点**：代码膨胀、技术栈固定、扩展按整体、发布风险高

### 微服务架构

```
┌────────┐  ┌────────┐  ┌────────┐
│ 用户服务│  │ 订单服务│  │ 商品服务│
│  + DB  │  │  + DB  │  │  + DB  │
└───┬────┘  └───┬────┘  └────────┘
    │           │
    └──── API 网关 ────── 客户端
```

- **优点**：独立部署、技术栈灵活、按需扩展、故障隔离
- **缺点**：分布式复杂度、数据一致性、调试困难、运维成本高

## 拆分原则

### 1. 单一职责（SRP）

一个服务只做一件事，按业务能力划分。

```
✅ 按业务能力：用户服务、订单服务、商品服务
❌ 按技术分层：DAO 服务、Service 服务、Controller 服务
```

### 2. 限界上下文（DDD）

借鉴领域驱动设计，按业务边界拆分。

```java
// 订单上下文
public class Order {
  private OrderId id;
  private List<OrderItem> items;   // 订单项属于订单上下文
  private CustomerRef customer;    // 只引用客户 ID，不持有客户对象
}

// 客户上下文
public class Customer {
  private CustomerId id;
  private String name;
}
```

### 3. 数据库独立

每个服务独占数据库，不直连他人数据库。

```
✅ 订单服务 → order_db
✅ 用户服务 → user_db
❌ 订单服务直连 user_db 查用户信息   → 应通过 API 调用
```

### 4. 合理粒度

- **过粗**：失去微服务优势
- **过细**：分布式开销大，一个接口一个服务不可取

**经验**：初期按业务域拆，粒度偏粗；后续按高负载点再细分。

## CAP 理论

分布式系统三选二：
- **C** Consistency 一致性：所有节点同一时刻数据一致
- **A** Availability 可用性：请求总能收到响应
- **P** Partition tolerance 分区容错：网络分区时仍能工作

```
CP  ZooKeeper / etcd / Consul   强一致，注册中心首选
AP  Nacos / Eureka              高可用，注册中心常见
CA  单机数据库                  不存在分布式场景
```

> **P 在分布式必选**，剩下是 C 与 A 的权衡。注册中心通常选 AP（可用性优先）。

## BASE 理论

CAP 的工程妥协，是大规模互联网的实践准则：

- **B**asically Available 基本可用：允许部分功能降级
- **S**oft state 软状态：允许中间状态存在
- **E**ventually consistent 最终一致性：最终数据一致，不要求实时

## 分布式事务

### 2PC（两阶段提交）

```
协调者 → 参与者：预提交（prepare）
        ← 参与者：可以 / 不行
协调者 → 参与者：commit / rollback
```

- **缺点**：同步阻塞、协调者单点、不一致风险
- **场景**：强一致场景，少用于微服务

### TCC（Try-Confirm-Cancel）

```java
// Try：预留资源
@TwoPhaseBusinessAction
public boolean tryDeduct(Account account, BigDecimal amount) {
  return account.freeze(amount);   // 冻结金额
}

// Confirm：确认
public boolean confirmDeduct(Account account, BigDecimal amount) {
  return account.deductFrozen(amount);   // 扣减冻结
}

// Cancel：回滚
public boolean cancelDeduct(Account account, BigDecimal amount) {
  return account.unfreeze(amount);   // 解冻
}
```

- **优点**：性能高、最终一致
- **缺点**：业务侵入大、需保证幂等
- **框架**：Seata TCC 模式

### 本地消息表（最终一致）

```
订单服务                                    库存服务
1. 扣减订单
2. 写消息表（同事务）  → MQ →  消费消息扣库存
3. 定时扫描发送
```

- **优点**：无需强一致、可靠性高
- **缺点**：延迟、需保证消费幂等

### Saga 模式

长事务拆分为一系列本地事务，每步有对应补偿。

```
T1 订单创建 → T2 扣库存 → T3 扣余额
失败时反向补偿：
C3 退余额 → C2 回库存 → C1 取消订单
```

- **适合**：流程长、参与方多
- **框架**：Seata Saga 模式

## 数据一致性

### 幂等设计

同一请求执行多次结果一致。

```java
// 用唯一键防重
@Transactional
public void pay(String requestId, Long orderId) {
  if (requestRepo.existsByRequestId(requestId)) {
    return;   // 已处理，直接返回
  }
  Order order = orderRepo.findById(orderId);
  order.pay();
  requestRepo.save(new RequestLog(requestId));
}
```

### 分布式锁

```java
// Redis 分布式锁（Redisson）
RLock lock = redissonClient.getLock("order:lock:" + orderId);
try {
  if (lock.tryLock(5, 30, TimeUnit.SECONDS)) {
    // 业务逻辑
  }
} finally {
  lock.unlock();
}

// ZooKeeper 临时顺序节点
// etcd lease + compare-and-swap
```

## 服务间通信

### 同步

| 方式     | 说明                          | 框架                |
| -------- | ----------------------------- | ------------------- |
| HTTP     | RESTful，通用                 | OpenFeign           |
| RPC      | 二进制，性能高                | Dubbo / gRPC        |

```java
// OpenFeign 声明式调用
@FeignClient(name = "user-service")
public interface UserClient {
  @GetMapping("/users/{id}")
  User getUser(@PathVariable Long id);
}

// Dubbo RPC
@DubboReference
private UserService userService;
```

### 异步

| 方式       | 场景                           |
| ---------- | ------------------------------ |
| MQ         | 解耦、削峰、最终一致           |
| 事件总线   | 服务内事件传递                 |

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| 拆分         | 按业务能力 + 限界上下文             |
| 数据         | 每服务独立数据库                    |
| CAP          | 注册中心选 AP                       |
| BASE         | 最终一致、软状态、基本可用          |
| 分布式事务   | TCC / 本地消息表 / Saga             |
| 幂等         | 唯一键防重                          |
| 通信         | 同步 OpenFeign、异步 MQ            |
