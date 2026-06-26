---
title: 05 Actuator 监控
---

# Spring Boot Actuator

> Actuator 提供 Spring Boot 应用的生产级监控端点，包括健康检查、指标、环境信息、日志、线程等。

## 引入依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

## 配置

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"           # 暴露所有端点（生产环境慎用）
        exclude: env,beans     # 排除敏感端点
  endpoint:
    health:
      show-details: always     # 显示健康详情
    shutdown:
      enabled: true             # 开启优雅关闭（慎用）
  info:
    env:
      enabled: true
```

## 常用端点

| 端点           | 路径                 | 作用                        |
| -------------- | -------------------- | --------------------------- |
| health         | /actuator/health     | 健康检查                    |
| info           | /actuator/info       | 应用信息                    |
| metrics        | /actuator/metrics     | 指标（JVM、HTTP）            |
| env            | /actuator/env         | 环境变量                    |
| loggers        | /actuator/loggers     | 日志级别                    |
| threaddump     | /actuator/threaddump  | 线程转储                    |
| heapdump       | /actuator/heapdump    | 堆转储（下载文件）          |
| mappings       | /actuator/mappings    | 请求映射                    |
| beans          | /actuator/beans       | 所有 Bean                  |
| shutdown       | /actuator/shutdown    | 优雅关闭（POST）            |

## 健康检查

```bash
curl http://localhost:8080/actuator/health
```

```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP", "details": { "database": "MySQL" } },
    "redis": { "status": "UP" },
    "diskSpace": { "status": "UP", "details": { "total": 500, "free": 200 } }
  }
}
```

### 自定义健康指示器

```java
@Component
public class MyHealthIndicator implements HealthIndicator {
  @Override
  public Health health() {
    if (checkExternal()) {
      return Health.up().withDetail("service", "running").build();
    }
    return Health.down().withDetail("error", "service unavailable").build();
  }
}
```

## 指标

```bash
# 列出所有指标
curl http://localhost:8080/actuator/metrics

# 查看具体指标
curl http://localhost:8080/actuator/metrics/jvm.memory.used
```

```json
{
  "name": "jvm.memory.used",
  "measurements": [
    { "statistic": "VALUE", "value": 123456789 }
  ]
}
```

### 自定义指标

```java
@Service
public class OrderService {
  private final Counter orderCounter;

  public OrderService(MeterRegistry registry) {
    this.orderCounter = registry.counter("orders.created.total");
  }

  public void createOrder() {
    // ...
    orderCounter.increment();
  }
}
```

## 日志级别动态调整

```bash
# 查看日志级别
curl http://localhost:8080/actuator/loggers

# 动态修改
curl -X POST http://localhost:8080/actuator/loggers/com.example \
  -H 'Content-Type: application/json' \
  -d '{"configuredLevel": "DEBUG"}'
```

## 集成 Prometheus + Grafana

```xml
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  metrics:
    tags:
      application: my-app
```

访问 `/actuator/prometheus` 获取 Prometheus 格式指标，配置 Prometheus 抓取后用 Grafana 展示。

## 应用信息

```yaml
info:
  app:
    name: My App
    version: 1.0.0
  build:
    time: 2026-01-01
```

或在 Maven 中配置：
```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <executions>
        <execution>
          <goals><goal>build-info</goal></goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

## 小结

| 功能       | 要点                                |
| ---------- | ----------------------------------- |
| 端点       | /actuator/*                         |
| 健康       | /actuator/health                    |
| 指标       | /actuator/metrics + Micrometer      |
| 日志       | 动态调整级别                        |
| 监控       | Prometheus + Grafana                |
| 安全       | 生产环境慎开全部端点                |
