---
title: 02 Spring Cloud
---

# Spring Cloud Alibaba

> Spring Cloud Alibaba 是国内主流的微服务方案，包含 Nacos（注册 + 配置）、OpenFeign（调用）、Sentinel（流控）、Seata（事务）。本章涵盖 Nacos、OpenFeign、配置中心。

## 依赖

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-alibaba-dependencies</artifactId>
      <version>2022.0.0.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-dependencies</artifactId>
      <version>2022.0.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

## Nacos 注册中心

### 启动 Nacos

```bash
# Docker 启动
docker run -d --name nacos \
  -p 8848:8848 -p 9848:9848 \
  -e MODE=standalone \
  nacos/nacos-server:v2.2.3
```

访问 `http://localhost:8848/nacos`，账号密码默认 `nacos / nacos`。

### 服务注册

```yaml
spring:
  application:
    name: user-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        namespace: public       # 命名空间隔离
        group: DEFAULT_GROUP
```

```java
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(UserServiceApplication.class, args);
  }
}
```

### 服务发现

```java
@Autowired
private DiscoveryClient discoveryClient;

public List<ServiceInstance> getInstances() {
  return discoveryClient.getInstances("order-service");
}
```

### Nacos vs Eureka

| 特性       | Nacos              | Eureka           |
| ---------- | ------------------ | ---------------- |
| 一致性     | AP + CP 可选       | AP               |
| 注册中心   | 支持               | 支持             |
| 配置中心   | 支持               | 不支持           |
| 健康检查   | TCP / HTTP / 心跳 | 心跳             |
| 推送       | 长轮询             | 客户端拉取       |
| 状态       | 活跃               | 2.x 停更         |

## Nacos 配置中心

### bootstrap.yml

```yaml
spring:
  application:
    name: user-service
  profiles:
    active: dev
  cloud:
    nacos:
      config:
        server-addr: localhost:8848
        file-extension: yaml       # 配置文件后缀
        namespace: dev
        group: DEFAULT_GROUP
        refresh-enabled: true      # 自动刷新
```

### 优先级

```
${prefix}-${profile}.${file-extension}    user-service-dev.yaml   ← 最高
${prefix}.${file-extension}               user-service.yaml
application-${profile}.${file-extension}  application-dev.yaml
application.${file-extension}              application.yaml        ← 最低
```

### 动态刷新

```java
@RestController
@RefreshScope      // 配置变更后重新创建 Bean
public class ConfigController {
  @Value("${user.name:default}")
  private String name;

  @GetMapping("/name")
  public String name() { return name; }
}
```

在 Nacos 控制台修改 `user-service-dev.yaml` 中 `user.name`，接口自动返回新值。

## OpenFeign 声明式调用

### 启用

```java
@SpringBootApplication
@EnableFeignClients    // 启用 Feign
public class App { ... }
```

### 声明客户端

```java
@FeignClient(
  name = "user-service",
  path = "/users",
  configuration = FeignConfig.class,
  fallback = UserClientFallback.class
)
public interface UserClient {

  @GetMapping("/{id}")
  User getById(@PathVariable Long id);

  @PostMapping
  User create(@RequestBody UserDto dto);

  @GetMapping
  List<User> list(@RequestParam int page, @RequestParam int size);
}
```

### 调用

```java
@Service
public class OrderService {
  private final UserClient userClient;

  public OrderService(UserClient userClient) { this.userClient = userClient; }

  public Order createOrder(Long userId) {
    User user = userClient.getById(userId);   // 像调用本地方法一样
    // 业务逻辑
  }
}
```

### 降级

```java
@Component
public class UserClientFallback implements UserClient {
  @Override
  public User getById(Long id) {
    return new User(0L, "默认用户");   // 降级返回
  }

  @Override
  public User create(UserDto dto) {
    throw new RuntimeException("用户服务不可用");
  }

  @Override
  public List<User> list(int page, int size) {
    return Collections.emptyList();
  }
}
```

### 配置

```yaml
feign:
  client:
    config:
      default:
        connect-timeout: 5000
        read-timeout: 10000
        logger-level: BASIC    # NONE / BASIC / HEADERS / FULL
  compression:
    request:
      enabled: true
      mime-types: application/json
    response:
      enabled: true
```

### 拦截器

```java
@Component
public class AuthInterceptor implements RequestInterceptor {
  @Override
  public void apply(RequestTemplate template) {
    RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
    if (attrs instanceof ServletRequestAttributes) {
      HttpServletRequest req = ((ServletRequestAttributes) attrs).getRequest();
      String token = req.getHeader("Authorization");
      if (token != null) {
        template.header("Authorization", token);   // 传递 token
      }
    }
  }
}
```

## 负载均衡

Spring Cloud 2020+ 用 Spring Cloud LoadBalancer 替代 Ribbon。

```java
@Configuration
public class LoadBalancerConfig {
  @Bean
  ReactorLoadBalancer<ServiceInstance> randomLB(
      ObjectProvider<List<ServiceInstance>> instances) {
    return new RandomLoadBalancer(instances, "user-service");
  }
}
```

| 策略        | 说明                 |
| ----------- | -------------------- |
| RoundRobin  | 轮询（默认）         |
| Random      | 随机                 |
| BestAvailable | 最少并发           |
| Weighted    | 权重                 |

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| Nacos        | 注册 + 配置一体                     |
| 服务发现     | @EnableDiscoveryClient              |
| 配置刷新     | @RefreshScope                       |
| OpenFeign    | 声明式 HTTP，像调本地方法           |
| 降级         | fallback / fallbackFactory         |
| 负载均衡     | Spring Cloud LoadBalancer           |
