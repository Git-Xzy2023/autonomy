---
title: 03 服务网关
---

# Spring Cloud Gateway

> 网关是微服务统一入口，承担路由转发、鉴权、限流、日志。Spring Cloud Gateway 基于 Spring WebFlux + Reactor，性能优于 Zuul。

## 架构

```
客户端 → Gateway → ┌─ user-service
                   ├─ order-service
                   └─ product-service
```

```
Route（路由）     = Predicate（断言） + Filter（过滤器）
Predicate        匹配条件（Path / Host / Header / Method）
Filter           请求/响应处理（鉴权 / 改写 / 限流）
```

## 依赖

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

## 启动

```java
@SpringBootApplication
public class GatewayApplication {
  public static void main(String[] args) {
    SpringApplication.run(GatewayApplication.class, args);
  }
}
```

> **注意**：Gateway 基于 WebFlux，不能与 spring-boot-starter-web 共存。

## 配置路由

### YAML 配置

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service          # lb 表示从注册中心负载
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1               # 去掉前缀 /api
            - AddResponseHeader=X-Gateway, gateway

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
            - Method=GET,POST
            - Header=X-Version, \d+
          filters:
            - StripPrefix=1
```

### Java 配置

```java
@Configuration
public class RouteConfig {

  @Bean
  public RouteLocator routes(RouteLocatorBuilder builder) {
    return builder.routes()
      .route("user-service", r -> r
        .path("/api/users/**")
        .filters(f -> f.stripPrefix(1))
        .uri("lb://user-service"))
      .build();
  }
}
```

## 断言（Predicate）

| 断言         | 示例                              | 说明              |
| ------------ | --------------------------------- | ----------------- |
| Path         | Path=/api/users/**               | 路径匹配          |
| Method       | Method=GET,POST                  | HTTP 方法          |
| Header       | Header=X-Token, \w+              | 请求头            |
| Host         | Host=**.example.com             | 域名              |
| After        | After=2024-01-01T00:00:00+08:00  | 某时间后          |
| Before       | Before=2024-12-31T23:59:59+08:00 | 某时间前          |
| Between      | Between=t1,t2                    | 区间              |
| Query        | Query=token, \w+                | 查询参数          |
| Cookie       | Cookie=session, \w+             | Cookie            |
| Weight       | Weight=group1, 8                | 权重路由          |

```yaml
predicates:
  - Path=/api/**
  - Method=GET,POST
  - Header=X-Request-Id, \d+
  - Query=token
```

## 过滤器（Filter）

### 内置过滤器

| 过滤器                  | 作用                          |
| ----------------------- | ----------------------------- |
| StripPrefix             | 去掉路径前缀                  |
| AddRequestHeader        | 添加请求头                    |
| AddResponseHeader       | 添加响应头                    |
| RewritePath             | 重写路径                      |
| PrefixPath              | 添加前缀                      |
| SetStatus               | 设置响应状态码                |
| RequestRateLimiter      | 限流                          |
| Retry                   | 重试                          |
| Hystrix / CircuitBreaker| 熔断                          |

```yaml
filters:
  - StripPrefix=1
  - AddRequestHeader=X-Gateway, gateway
  - AddResponseHeader=X-Response-Time, 100
  - RewritePath=/api/(?<segment>.*), /$\{segment}
  - SetStatus=200
```

### 全局过滤器

```java
@Component
public class AuthFilter implements GlobalFilter, Ordered {

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    ServerHttpRequest req = exchange.getRequest();
    String path = req.getURI().getPath();

    // 白名单
    if (path.contains("/login") || path.contains("/register")) {
      return chain.filter(exchange);
    }

    String token = req.getHeaders().getFirst("Authorization");
    if (token == null || !token.startsWith("Bearer ")) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }

    // 校验 token
    try {
      String userId = JwtUtil.verify(token.substring(7));
      ServerHttpRequest mutated = req.mutate()
        .header("X-User-Id", userId)
        .build();
      return chain.filter(exchange.mutate().request(mutated).build());
    } catch (Exception e) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }
  }

  @Override
  public int getOrder() { return -100; }   // 越小越先执行
}
```

## 限流

基于 Redis + Lua 实现令牌桶。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10   # 令牌填充速率 10/s
                redis-rate-limiter.burstCapacity: 20   # 桶容量 20
                key-resolver: "#{@ipKeyResolver}"     # 限流 key
```

```java
@Bean
public KeyResolver ipKeyResolver() {
  return exchange -> Mono.just(
    exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
  );
}

@Bean
public KeyResolver userKeyResolver() {
  return exchange -> Mono.just(
    exchange.getRequest().getHeaders().getFirst("X-User-Id")
  );
}
```

## 跨域

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowed-origins: "https://example.com"
            allowed-methods: "*"
            allowed-headers: "*"
            allow-credentials: true
            max-age: 3600
```

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| 路由         | Predicate 匹配 + Filter 处理        |
| 断言         | Path / Method / Header / Host      |
| 过滤器       | 内置 + 自定义 GlobalFilter          |
| 鉴权         | GlobalFilter 拦截 token             |
| 限流         | RequestRateLimiter + Redis          |
| 跨域         | globalcors 配置                     |
