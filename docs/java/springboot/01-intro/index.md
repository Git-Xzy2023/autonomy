---
title: 01 快速入门
---

# Spring Boot 快速入门

> 本章从零搭建一个 Spring Boot 项目，了解项目结构、配置文件、启动流程。

## 创建项目

### Spring Initializr

访问 https://start.spring.io/ 选择依赖生成，或用 IDE 内置的 Spring Initializr。

### 命令行

```bash
# 用 Spring Boot CLI
spring init --dependencies=web,data-jpa,mysql myapp
```

### Maven 手动

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.2.0</version>
</parent>

<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
</dependencies>
```

## 项目结构

```
src/main/
├── java/com/example/
│   ├── DemoApplication.java   # 启动类
│   ├── controller/
│   ├── service/
│   └── repository/
└── resources/
    ├── application.yml         # 主配置
    ├── application-dev.yml     # 环境配置
    ├── static/                 # 静态资源
    └── templates/              # 模板
```

## 启动类

```java
@SpringBootApplication
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}
```

`@SpringBootApplication` = `@SpringBootConfiguration` + `@EnableAutoConfiguration` + `@ComponentScan`

## 配置文件

### application.yml

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  profiles:
    active: dev
  datasource:
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

my:
  app:
    name: Demo
    version: 1.0
```

### 多环境

```yaml
# application.yml
spring:
  profiles:
    active: dev    # 激活 dev

# application-dev.yml
server:
  port: 8080

# application-prod.yml
server:
  port: 80
```

```bash
# 命令行激活
java -jar app.jar --spring.profiles.active=prod

# 或环境变量
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
```

### 读取配置

```java
@Value("${my.app.name}")
private String appName;

// 批量绑定
@ConfigurationProperties(prefix = "my.app")
@Component
@Data
public class AppConfig {
  private String name;
  private String version;
}
```

## Starter 依赖

| Starter                       | 作用              |
| ----------------------------- | ----------------- |
| spring-boot-starter-web       | Web（Tomcat + MVC）|
| spring-boot-starter-data-jpa  | JPA / Hibernate   |
| spring-boot-starter-data-redis| Redis             |
| spring-boot-starter-validation| 参数校验           |
| spring-boot-starter-security  | 安全              |
| spring-boot-starter-test      | 测试              |
| spring-boot-starter-actuator  | 监控              |

## 第一个接口

```java
@RestController
public class HelloController {

  @GetMapping("/hello")
  public String hello(@RequestParam(defaultValue = "World") String name) {
    return "Hello, " + name + "!";
  }
}
```

启动后访问 http://localhost:8080/hello?name=Tom 返回 `Hello, Tom!`。

## 打包与运行

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin>
  </plugins>
</build>
```

```bash
# 打包
mvn clean package -DskipTests

# 运行
java -jar target/demo-1.0.jar

# 后台运行
nohup java -jar demo.jar > app.log 2>&1 &
```

## 启动流程

```
main()
└─ SpringApplication.run()
   ├─ 创建 SpringApplication 实例
   │   ├─ 推断应用类型（SERVLET / REACTIVE / NONE）
   │   └─ 加载 spring.factories 中的初始化器、监听器
   ├─ run()
   │   ├─ 创建 ApplicationContext
   │   ├─ refreshContext()    ← 自动配置在此触发
   │   ├─ 调用 ApplicationRunner / CommandLineRunner
   │   └─ 启动 Tomcat
   └─ 返回 ApplicationContext
```

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| 创建         | Initializr / Maven parent           |
| 启动类       | @SpringBootApplication              |
| 配置         | application.yml + 多 profile       |
| 读取配置     | @Value / @ConfigurationProperties   |
| Starter      | 一站式依赖                           |
| 打包         | spring-boot-maven-plugin 生成可执行 jar |
