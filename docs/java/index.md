---
title: Java 后端学习指南
---

# Java 后端学习指南

> Java 是企业级后端开发的主流语言，拥有成熟的生态和庞大的社区。本章涵盖 Java 基础、Spring 框架、Spring Boot、MyBatis、数据库访问、微服务架构，从语法到工程实践，构建完整的 Java 后端知识体系。

## 技术栈总览

```
Java 后端
├── 语言基础
│   ├── 语法与面向对象
│   ├── 集合框架
│   ├── 多线程与并发（JUC）
│   └── JVM
│
├── 核心框架
│   ├── Spring（IoC / AOP / MVC / 事务）
│   ├── Spring Boot（自动配置 / Starter / Actuator）
│   └── MyBatis（ORM / 动态 SQL / 缓存）
│
├── 数据访问
│   ├── JDBC
│   └── 连接池（HikariCP / Druid）
│
└── 微服务
    ├── 架构设计
    ├── Spring Cloud（注册 / 配置 / 网关）
    └── 熔断限流（Sentinel / Resilience4j）
```

## 章节导航

| 章节                           | 主题        | 内容                              |
| ------------------------------ | ----------- | --------------------------------- |
| [Java 基础](/java/basic/)       | 语言基础    | 语法、OOP、集合、并发、JVM        |
| [Spring](/java/spring/)         | 核心框架    | IoC、AOP、MVC、事务                |
| [Spring Boot](/java/springboot/) | 快速开发    | 自动配置、数据访问、Web、监控      |
| [MyBatis](/java/mybatis/)       | ORM 框架    | 映射文件、动态 SQL、缓存           |
| [数据库](/java/database/)       | 数据访问    | JDBC、连接池                       |
| [微服务](/java/microservice/)   | 分布式架构  | Spring Cloud、网关、熔断限流       |

## 推荐学习路线

### 路线一：从零到能写后端服务

1. **Java 基础**：语法、OOP、集合、并发。
2. **Spring Boot**：快速搭建 Web 服务。
3. **MyBatis**：数据库访问。
4. **数据库**：JDBC 与连接池。

### 路线二：深入框架原理

1. **Spring**：理解 IoC / AOP 原理。
2. **Spring Boot**：自动配置机制。
3. **JVM**：性能调优基础。

### 路线三：走向分布式

1. **微服务架构**：理解拆分原则。
2. **Spring Cloud**：注册、配置、网关。
3. **熔断限流**：服务治理。

## 版本说明

本笔记以 **Java 17 LTS** 为主，Spring Boot **3.x** 为基准，涉及新特性时会标注版本。部分历史代码使用 Java 8 语法，会在文中注明。
