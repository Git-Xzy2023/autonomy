---
title: 微服务
---

# 微服务架构

> 微服务将单体应用拆分为一组小而自治的服务，每个服务独立部署、独立演进，通过轻量协议通信。本章涵盖架构设计、Spring Cloud、服务网关、熔断限流。

## 章节导航

| 章节                                                 | 主题     | 内容                          |
| ---------------------------------------------------- | -------- | ----------------------------- |
| [01 架构设计](/java/microservice/01-architecture/)   | 原理     | 拆分原则、CAP、一致性         |
| [02 Spring Cloud](/java/microservice/02-spring-cloud/)| 框架     | 注册、配置、调用              |
| [03 服务网关](/java/microservice/03-gateway/)         | 网关     | 路由、鉴权、限流              |
| [04 熔断限流](/java/microservice/04-circuit-breaker/) | 治理     | Sentinel / Resilience4j       |

## 技术栈

```
微服务生态
├── 注册中心
│   ├── Nacos（推荐，阿里）
│   ├── Eureka（Netflix，停更）
│   └── Consul（HashiCorp）
│
├── 配置中心
│   ├── Nacos Config
│   ├── Apollo（携程）
│   └── Spring Cloud Config
│
├── 服务调用
│   ├── OpenFeign（声明式 HTTP）
│   └── Dubbo（RPC，Apache）
│
├── 网关
│   ├── Spring Cloud Gateway（推荐）
│   └── Zuul（Netflix，停更）
│
├── 熔断限流
│   ├── Sentinel（阿里，推荐）
│   └── Resilience4j（Spring 官方推荐）
│
├── 链路追踪
│   ├── SkyWalking（Apache）
│   ├── Zipkin
│   └── Jaeger
│
└── 消息队列
    ├── RocketMQ
    ├── Kafka
    └── RabbitMQ
```

## Spring Cloud 版本

| 版本线             | 基于             | 状态       |
| ------------------ | ---------------- | ---------- |
| Spring Cloud Netflix| Netflix OSS     | 维护模式   |
| Spring Cloud Alibaba| 阿里巴巴        | 活跃（推荐）|
| Spring Cloud 官方   | Spring 自研     | 活跃       |

## 推荐学习路线

1. **架构思想**：理解微服务边界、CAP、BASE 理论
2. **注册中心**：Nacos 服务发现
3. **服务调用**：OpenFeign 声明式调用
4. **网关**：Spring Cloud Gateway 路由鉴权
5. **熔断限流**：Sentinel 流控降级
6. **链路追踪**：SkyWalking 排查问题
