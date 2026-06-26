---
title: 02 自动配置
---

# Spring Boot 自动配置

> 自动配置是 Spring Boot 的核心特性。根据类路径下的依赖，自动装配对应的 Bean，减少手动配置。

## @EnableAutoConfiguration

```java
@SpringBootApplication  // 包含 @EnableAutoConfiguration
public class App { ... }
```

`@EnableAutoConfiguration` 通过 `@Import(AutoConfigurationImportSelector.class)` 加载自动配置类。

## 加载机制

```
启动 → AutoConfigurationImportSelector
     → 读取 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
     （Spring Boot 3.x 文件名，2.x 是 spring.factories）
     → 过滤 @Conditional 条件
     → 注册符合条件的配置类
```

### Spring Boot 3.x 文件

```
META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
```

内容（每行一个全限定类名）：
```
com.example.MyAutoConfiguration
```

## @Conditional 条件装配

| 注解                            | 条件                    |
| ------------------------------- | ----------------------- |
| @ConditionalOnClass             | 类路径存在指定类        |
| @ConditionalOnMissingBean       | 容器中无指定 Bean       |
| @ConditionalOnBean              | 容器中有指定 Bean       |
| @ConditionalOnProperty          | 配置项满足              |
| @ConditionalOnWebApplication    | 是 Web 应用             |
| @ConditionalOnNotWebApplication | 不是 Web 应用           |
| @ConditionalOnExpression        | SpEL 表达式为 true       |

## 自动配置示例

```java
@Configuration
@ConditionalOnClass(RedisTemplate.class)        // 有 Redis 依赖才生效
@EnableConfigurationProperties(RedisProperties.class)
public class RedisAutoConfiguration {

  @Bean
  @ConditionalOnMissingBean                   // 用户没自定义才创建
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(factory);
    return template;
  }
}
```

## 配置类与属性绑定

```java
@ConfigurationProperties(prefix = "spring.redis")
@Data
public class RedisProperties {
  private String host = "localhost";
  private int port = 6379;
  private String password;
  private int database = 0;
}
```

```yaml
spring:
  redis:
    host: 192.168.1.100
    port: 6380
    password: secret
```

## 手写自动配置

### 1. 属性类

```java
@ConfigurationProperties(prefix = "my.cache")
@Data
public class CacheProperties {
  private int ttl = 3600;
  private int maxSize = 1000;
}
```

### 2. 自动配置类

```java
@AutoConfiguration
@ConditionalOnClass(CacheService.class)
@EnableConfigurationProperties(CacheProperties.class)
public class CacheAutoConfiguration {

  @Bean
  @ConditionalOnMissingBean
  @ConditionalOnProperty(prefix = "my.cache", name = "enabled", havingValue = "true", matchIfMissing = true)
  public CacheService cacheService(CacheProperties props) {
    return new CacheService(props.getTtl(), props.getMaxSize());
  }
}
```

### 3. 注册自动配置

```
src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
```

写入：
```
com.example.CacheAutoConfiguration
```

## 排除自动配置

```java
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class App { ... }
```

```yaml
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

## 调试自动配置

```yaml
debug: true
```

启动日志会输出：
- `Positive matches`：生效的配置
- `Negative matches`：未生效的配置及原因

## 小结

| 知识点       | 要点                                    |
| ------------ | --------------------------------------- |
| 入口         | @EnableAutoConfiguration                |
| 加载文件     | AutoConfiguration.imports（3.x）         |
| 条件装配     | @ConditionalOnClass / @ConditionalOnMissingBean |
| 属性绑定     | @ConfigurationProperties                |
| 排除         | exclude = { Xxx.class }                 |
| 调试         | debug: true 查看生效报告                |
