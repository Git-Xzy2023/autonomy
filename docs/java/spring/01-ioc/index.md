---
title: 01 IoC 容器
---

# Spring IoC 容器

> IoC（Inversion of Control，控制反转）是 Spring 的核心。对象的创建和依赖关系由容器管理，而非对象自己 new，实现解耦。

## IoC 与 DI

- **IoC**：控制反转，对象创建权交给容器
- **DI**（Dependency Injection）：依赖注入，是 IoC 的实现方式

```java
// 不用 IoC：自己 new，强耦合
class OrderService {
  private UserDao dao = new UserDaoImpl();   // 硬编码依赖
}

// 用 IoC：容器注入，解耦
class OrderService {
  private final UserDao dao;
  public OrderService(UserDao dao) {   // 构造注入
    this.dao = dao;
  }
}
```

## Bean 配置

### XML 配置（传统）

```xml
<bean id="userDao" class="com.example.UserDaoImpl"/>
<bean id="userService" class="com.example.UserServiceImpl">
  <property name="dao" ref="userDao"/>
</bean>
```

### 注解配置（推荐）

```java
@Configuration
public class AppConfig {
  @Bean
  public UserDao userDao() { return new UserDaoImpl(); }

  @Bean
  public UserService userService(UserDao dao) {
    return new UserServiceImpl(dao);
  }
}
```

### 组件扫描

```java
@Configuration
@ComponentScan("com.example")   // 扫描该包下的 @Component
public class AppConfig {}
```

```java
@Service
public class UserServiceImpl implements UserService {
  private final UserDao dao;
  @Autowired   // 构造注入可省略
  public UserServiceImpl(UserDao dao) { this.dao = dao; }
}

@Repository
public class UserDaoImpl implements UserDao { ... }

@Controller
public class UserController { ... }

@Component   // 通用组件
public class Util { ... }
```

## 依赖注入方式

```java
// 1. 构造注入（推荐，不可变，便于测试）
@Service
public class OrderService {
  private final UserDao dao;
  public OrderService(UserDao dao) { this.dao = dao; }
}

// 2. setter 注入
@Service
public class OrderService {
  private UserDao dao;
  @Autowired
  public void setUserDao(UserDao dao) { this.dao = dao; }
}

// 3. 字段注入（不推荐，难测试）
@Service
public class OrderService {
  @Autowired
  private UserDao dao;
}
```

> **推荐构造注入**：字段 final 不可变、不依赖 Spring 也能 new、循环依赖会直接报错（避免隐藏 bug）。

## Bean 作用域

| 作用域      | 说明                          |
| ----------- | ----------------------------- |
| singleton   | 单例（默认），整个容器一个    |
| prototype   | 原型，每次 getBean 新建       |
| request     | 每个 HTTP 请求一个            |
| session     | 每个 HTTP Session 一个        |
| application | 每个 ServletContext 一个     |

```java
@Component
@Scope("prototype")
public class Proto { ... }
```

## Bean 生命周期

```
1. 实例化           → 调用构造方法
2. 属性赋值         → 注入依赖（@Autowired）
3. Aware 接口回调    → BeanNameAware / BeanFactoryAware / ApplicationContextAware
4. BeanPostProcessor.postProcessBeforeInitialization
5. 初始化           → @PostConstruct / InitializingBean.afterPropertiesSet / init-method
6. BeanPostProcessor.postProcessAfterInitialization   ← AOP 代理在此生成
7. 使用
8. 销毁             → @PreDestroy / DisposableBean.destroy / destroy-method
```

```java
@Component
public class MyBean implements BeanNameAware {
  @PostConstruct
  public void init() { System.out.println("初始化"); }

  @PreDestroy
  public void cleanup() { System.out.println("销毁"); }

  @Override
  public void setBeanName(String name) {
    System.out.println("Bean 名：" + name);
  }
}
```

## 循环依赖

A 依赖 B，B 依赖 A。Spring 用三级缓存解决单例的 setter/字段循环依赖。

```
singletonObjects        一级缓存：完整 Bean（初始化完成）
earlySingletonObjects   二级缓存：早期引用（已实例化未初始化）
singletonFactories      三级缓存：ObjectFactory（可生成代理）
```

> **构造注入循环依赖无法解决**，会报错。可改用 setter 注入或 `@Lazy`。

```java
@Service
public class A {
  private final B b;
  public A(@Lazy B b) { this.b = b; }   // 延迟加载
}
```

## @Autowired vs @Resource

| 特性         | @Autowired          | @Resource               |
| ------------ | ------------------- | ----------------------- |
| 来源         | Spring              | JSR-250（标准）         |
| 按类型       | 默认                | 可按 name 或 type       |
| 配合         | @Qualifier 指定 name | name 属性指定 name      |
| 必要性       | required = false    | 不支持                  |

```java
@Autowired
@Qualifier("mysqlDao")       // 多实现时按名称选
private UserDao dao;

@Resource(name = "mysqlDao")
private UserDao dao2;
```

## @Conditional 条件装配

```java
@Configuration
public class AppConfig {
  @Bean
  @Conditional(OnLinuxCondition.class)
  public Util linuxUtil() { return new LinuxUtil(); }

  @Bean
  @ConditionalOnProperty(name = "cache.type", havingValue = "redis")
  public Cache redisCache() { return new RedisCache(); }

  @Bean
  @ConditionalOnMissingBean(Cache.class)
  public Cache defaultCache() { return new LocalCache(); }
}
```

## FactoryBean

当 Bean 创建逻辑复杂时，用 FactoryBean。

```java
public class ConnectionFactoryBean implements FactoryBean<Connection> {
  @Override
  public Connection getObject() {
    return DriverManager.getConnection(url, user, pwd);  // 复杂创建逻辑
  }
  @Override
  public Class<?> getObjectType() { return Connection.class; }
}
```

```java
ctx.getBean("connectionFactoryBean");        // 返回 Connection
ctx.getBean("&connectionFactoryBean");        // 加 & 返回 FactoryBean 本身
```

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| IoC / DI     | 容器管创建，注入依赖                |
| 注解配置     | @Component / @Autowired / @Bean     |
| 作用域       | singleton 默认                      |
| 生命周期     | 构造→注入→初始化→使用→销毁          |
| 循环依赖     | 三级缓存，构造注入无法解决          |
| 条件装配     | @Conditional / @ConditionalOnXxx    |
