---
title: 02 AOP
---

# Spring AOP 面向切面编程

> AOP（Aspect-Oriented Programming）将横切关注点（日志、事务、权限）从业务代码中分离，通过动态代理在方法执行前后插入逻辑。

## 核心概念

| 术语              | 说明                                  | 示例                          |
| ----------------- | ------------------------------------- | ----------------------------- |
| Aspect（切面）    | 横切逻辑的类                          | 日志切面                      |
| JoinPoint（连接点）| 可被增强的方法                        | 所有 service 方法             |
| Pointcut（切入点）| 实际被增强的方法（表达式筛选）        | `execution(* Service.*(..))`  |
| Advice（通知）    | 增强的逻辑                            | before / after / around       |
| Target（目标）    | 被代理的原始对象                      | UserService                   |
| Proxy（代理）     | AOP 创建的代理对象                    | CGLIB 代理                    |
| Weaving（织入）   | 将切面应用到目标的过程                | 运行时动态代理                |

## 通知类型

```java
@Aspect
@Component
public class LogAspect {

  // 前置通知
  @Before("execution(* com.example.service.*.*(..))")
  public void before(JoinPoint jp) {
    System.out.println("调用 " + jp.getSignature().getName());
  }

  // 后置通知（正常返回）
  @AfterReturning(value = "execution(* com.example.service.*.*(..))", returning = "ret")
  public void afterReturning(JoinPoint jp, Object ret) {
    System.out.println("返回 " + ret);
  }

  // 异常通知
  @AfterThrowing(value = "...", throwing = "ex")
  public void afterThrowing(JoinPoint jp, Exception ex) {
    System.out.println("异常 " + ex.getMessage());
  }

  // 最终通知（无论是否异常）
  @After("...")
  public void after(JoinPoint jp) { ... }

  // 环绕通知（最强大，可控制是否执行）
  @Around("execution(* com.example.service.*.*(..))")
  public Object around(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.currentTimeMillis();
    try {
      Object ret = pjp.proceed();      // 执行原方法
      return ret;
    } finally {
      System.out.println("耗时 " + (System.currentTimeMillis() - start) + "ms");
    }
  }
}
```

## 切入点表达式

```java
// execution(修饰符 返回类型 包.类.方法(参数))
execution(public * com.example.service.*.*(..))       // service 包所有 public 方法
execution(* com.example..*(..))                         // 任意方法
execution(* *(String, ..))                             // 第一个参数 String
execution(* save*(..))                                  // 方法名以 save 开头

// 注解切入点
@within(org.springframework.stereotype.Service)        // 类上有 @Service
@annotation(com.example.MyAnno)                        // 方法上有 @MyAnno

// 组合
@Pointcut("execution(* Service.*(..)) && args(String)")
```

### 复用切入点

```java
@Aspect
@Component
public class LogAspect {
  @Pointcut("execution(* com.example.service.*.*(..))")
  public void servicePointcut() {}

  @Before("servicePointcut()")
  public void before() { ... }

  @AfterReturning("servicePointcut()")
  public void after() { ... }
}
```

## 动态代理原理

Spring AOP 用两种动态代理：

### JDK 动态代理（默认，目标有接口）

```java
public class LogHandler implements InvocationHandler {
  private final Object target;
  public LogHandler(Object target) { this.target = target; }

  @Override
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    System.out.println("before");
    Object ret = method.invoke(target, args);
    System.out.println("after");
    return ret;
  }
}

UserService proxy = (UserService) Proxy.newProxyInstance(
  UserService.class.getClassLoader(),
  new Class[]{ UserService.class },
  new LogHandler(new UserServiceImpl())
);
proxy.findById(1);
```

### CGLIB 代理（目标无接口）

```java
public class LogInterceptor implements MethodInterceptor {
  @Override
  public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
    System.out.println("before");
    Object ret = proxy.invokeSuper(obj, args);
    System.out.println("after");
    return ret;
  }
}

Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(UserServiceImpl.class);
enhancer.setCallback(new LogInterceptor());
UserServiceImpl proxy = (UserServiceImpl) enhancer.create();
```

**两者对比**：

| 特性          | JDK 动态代理          | CGLIB                    |
| ------------- | --------------------- | ------------------------ |
| 要求          | 目标实现接口           | 无要求（final 类除外）   |
| 原理          | 反射                  | 生成子类                 |
| 性能          | 较慢                  | 较快                     |
| Spring 选择   | 有接口默认用           | 无接口或强制用 CGLIB     |

强制 CGLIB：`spring.aop.proxy-target-class=true`（Spring Boot 2.x+ 默认 true）。

## 经典应用：自定义注解 + AOP

```java
// 1. 定义注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Log {
  String value() default "";
}

// 2. 使用
@Service
public class UserService {
  @Log("查询用户")
  public User findById(Long id) { ... }
}

// 3. 切面
@Aspect
@Component
public class LogAspect {
  @Around("@annotation(log)")
  public Object around(ProceedingJoinPoint pjp, Log log) throws Throwable {
    System.out.println("操作：" + log.value());
    return pjp.proceed();
  }
}
```

## 小结

| 知识点       | 要点                                    |
| ------------ | --------------------------------------- |
| 概念         | Aspect / Pointcut / Advice              |
| 通知         | before / after / around / afterReturning|
| 表达式       | execution / @annotation                 |
| 代理         | JDK（接口）/ CGLIB（子类）              |
| 应用         | 日志、事务、权限、性能统计              |
