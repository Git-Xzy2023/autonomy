---
title: Spring Boot
---

# Spring Boot

> Spring Boot 简化了 Spring 应用的搭建与开发，通过约定大于配置、自动配置、Starter 依赖，让开发者专注业务。本章涵盖快速入门、自动配置、数据访问、Web 开发、监控。

## 章节导航

| 章节                                         | 主题     | 内容                          |
| -------------------------------------------- | -------- | ----------------------------- |
| [01 快速入门](/java/springboot/01-intro/)     | 入门     | 项目创建、配置、启动          |
| [02 自动配置](/java/springboot/02-autoconfig/)| 原理     | @EnableAutoConfiguration 原理 |
| [03 数据访问](/java/springboot/03-data/)      | ORM      | JPA / MyBatis / Redis         |
| [04 Web 开发](/java/springboot/04-web/)       | Web      | 静态资源、异常、文件上传      |
| [05 监控](/java/springboot/05-actuator/)      | 运维     | Actuator、健康检查、指标      |

## Spring Boot 的优势

- **独立运行**：内嵌 Tomcat，无需部署 war
- **简化配置**：约定大于配置，application.yml 一键配置
- **自动配置**：根据依赖自动装配 Bean
- **Starter 依赖**：一站式依赖管理
- **生产就绪**：Actuator 提供监控端点
