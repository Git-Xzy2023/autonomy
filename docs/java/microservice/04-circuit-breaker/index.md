---
title: 04 熔断限流
---

# 熔断与限流

> 分布式系统中，下游服务故障会引发雪崩：请求堆积 → 线程池耗尽 → 上游也挂。熔断限流是服务治理的核心。本章涵盖 Sentinel 和 Resilience4j。

## 雪崩效应

```
用户请求 → 网关 → 订单服务 → 用户服务（故障）
                  ↓
        线程等待 → 池满 → 订单服务也挂 → 网关也挂
```

**解决方案**：
- **超时**：调用快速失败，不堆积
- **熔断**：失败到阈值后直接拒绝，保护下游
- **限流**：控制 QPS，保护自己
- **降级**：返回兜底数据

## Sentinel

阿里巴巴开源，国内主流，集流控、熔断、系统保护于一体。

### 依赖

```xml
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

### 配置

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080    # 控制台地址
        port: 8719                    # 与控制台通信端口
      eager: true                      # 立即初始化
```

### 启动控制台

```bash
docker run -d --name sentinel-dashboard \
  -p 8080:8080 \
  -e JAVA_OPTS="-Dserver.port=8080 -Dcsp.sentinel.dashboard.server=localhost:8080" \
  bladex/sentinel-dashboard:1.8.6
```

账号密码默认 `sentinel / sentinel`。

### 流控规则

```java
@SentinelResource(
  value = "getUser",
  blockHandler = "blockHandler",
  fallback = "fallback"
)
public User getUser(Long id) {
  return userClient.getById(id);   // 可能抛异常
}

// 限流/熔断时调用
public User blockHandler(Long id, BlockException ex) {
  return new User(0L, "限流降级用户");
}

// 业务异常时调用
public User fallback(Long id, Throwable e) {
  return new User(0L, "异常降级用户");
}
```

### 流控策略

| 策略         | 说明                                   |
| ------------ | -------------------------------------- |
| 直接         | 当前资源限流                           |
| 关联         | 关联资源达到阈值时限流自己              |
| 链路         | 只限制从入口资源来的调用                |

### 流控效果

| 效果         | 说明                                   |
| ------------ | -------------------------------------- |
| 快速失败     | 直接抛 FlowException                   |
| Warm Up      | 冷启动，阈值逐步提升                    |
| 排队等待     | 匀速通过，多余的排队                    |

### 熔断规则

| 策略           | 触发条件                              |
| -------------- | ------------------------------------- |
| 慢调用比例     | RT > 阈值 的比例超阈值                |
| 异常比例       | 异常比例超阈值                        |
| 异常数         | 异常次数超阈值                        |

```
熔断器状态：
Closed（正常） → 达到阈值 → Open（熔断，拒绝请求）
                              ↓ 等待时间窗口
                          Half-Open（半开，放一个请求试探）
                              ↓ 成功 → Closed
                              ↓ 失败 → Open
```

### 热点参数限流

```java
@SentinelResource("queryOrder")
public Order queryOrder(@RequestParam Long orderId) { ... }
```

控制台配置：参数索引 0，单值限流 10 QPS，但 `orderId=100` 例外（限流 100）。

### 系统规则

基于整体负载保护，防止系统被拖垮。

| 类型           | 说明                          |
| -------------- | ----------------------------- |
| Load           | Linux 系统负载                |
| RT             | 平均响应时间                  |
| 线程数         | 入口并发线程数                |
| 入口 QPS       | 总 QPS                        |
| CPU 使用率     | > 阈值触发                    |

## Resilience4j

Spring 官方推荐的熔断限流库，轻量、函数式。

### 依赖

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

### 熔断器

```yaml
resilience4j:
  circuitbreaker:
    instances:
      user-service:
        register-health-indicator: true
        sliding-window-size: 10           # 滑动窗口大小
        minimum-number-of-calls: 5        # 最少调用次数
        failure-rate-threshold: 50        # 失败率阈值 50%
        wait-duration-in-open-state: 10s  # 熔断开启后等待时间
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
```

```java
@Service
public class OrderService {
  @CircuitBreaker(name = "user-service", fallbackMethod = "fallback")
  public User getUser(Long id) {
    return userClient.getById(id);   // 失败率 > 50% 触发熔断
  }

  private User fallback(Long id, Throwable e) {
    return new User(0L, "降级用户");
  }
}
```

### 限流器（RateLimiter）

```yaml
resilience4j:
  ratelimiter:
    instances:
      user-service:
        limit-for-period: 10            # 每周期许可数
        limit-refresh-period: 1s        # 周期
        timeout-duration: 0             # 获取许可超时
```

```java
@RateLimiter(name = "user-service", fallbackMethod = "rateFallback")
public User getUser(Long id) { ... }
```

### 重试（Retry）

```yaml
resilience4j:
  retry:
    instances:
      user-service:
        max-attempts: 3
        wait-duration: 500ms
        retry-exceptions:
          - java.io.IOException
```

```java
@Retry(name = "user-service")
public User getUser(Long id) { ... }
```

### 组合使用

```java
@CircuitBreaker(name = "user-service", fallbackMethod = "cb")
@RateLimiter(name = "user-service")
@Retry(name = "user-service")
public User getUser(Long id) { ... }
```

## Sentinel vs Resilience4j

| 特性         | Sentinel                  | Resilience4j           |
| ------------ | ------------------------- | ---------------------- |
| 语言         | Java                      | Java                   |
| 控制台       | 有，功能强                | 无内置                 |
| 动态规则     | 支持（推送）              | 配置文件               |
| 流控         | QPS / 线程数 / 热点        | 令牌桶                 |
| 熔断         | 慢调用 / 异常比例 / 异常数 | 失败率                 |
| 限流算法     | 滑动窗口 + 令牌桶          | 令牌桶                 |
| 系统保护     | 有（Load / CPU / RT）     | 无                     |
| 国内使用     | 主流                      | 一般                   |
| 学习成本     | 中                        | 低                     |

> **选型**：
> - 国内项目 / 需要监控 / 需要动态规则 → **Sentinel**
> - 轻量 / Spring 官方推荐 / 无监控需求 → **Resilience4j**

## 降级策略

| 策略       | 适用                           | 示例                          |
| ---------- | ------------------------------ | ----------------------------- |
| 返回默认值 | 非核心数据                     | 用户头像返回默认图            |
| 返回缓存   | 数据可容忍过期                 | 商品信息读 Redis              |
| 返回部分   | 列表只返回首页                 | 商品列表只返回 10 条          |
| 写入异步   | 可延迟处理                     | 日志、统计                    |
| 限流排队   | 可等待                         | 排队等待，超时再失败          |

```java
public Product getProduct(Long id) {
  try {
    return productClient.getById(id);
  } catch (Exception e) {
    Product cached = redisTemplate.opsForValue().get("product:" + id);
    return cached != null ? cached : Product.defaultProduct();
  }
}
```

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| 雪崩         | 故障扩散 → 线程耗尽 → 整体宕机      |
| 熔断         | Closed → Open → Half-Open          |
| 限流         | QPS 控制，保护自己                 |
| 降级         | 兜底返回，保证可用                 |
| Sentinel     | 国内主流，监控 + 动态规则          |
| Resilience4j | 轻量函数式，Spring 官方            |
