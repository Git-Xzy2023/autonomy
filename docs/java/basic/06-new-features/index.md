---
title: 06 新特性
---

# Java 新特性

> Java 从 8 开始每年发布新版本（LTS：8、11、17、21）。本章梳理关键新特性，重点掌握 Lambda、Stream、Record、模式匹配。

## Java 8：Lambda 与 Stream

### Lambda

```java
// 旧写法
Runnable r1 = new Runnable() {
  @Override public void run() { System.out.println("hi"); }
};

// Lambda
Runnable r2 = () -> System.out.println("hi");

Comparator<Integer> cmp = (a, b) -> a - b;
```

**函数式接口**：只有一个抽象方法的接口，用 `@FunctionalInterface` 标注。

```java
@FunctionalInterface
public interface Converter {
  String convert(String s);
}
Converter c = s -> s.toUpperCase();
```

**内置函数式接口**（`java.util.function`）：

| 接口          | 方法            | 等价 Lambda          |
| ------------- | --------------- | -------------------- |
| `Supplier<T>` | `T get()`        | `() -> t`            |
| `Consumer<T>` | `void accept(T)` | `t -> ...`           |
| `Function<T,R>` | `R apply(T)`   | `t -> r`             |
| `Predicate<T>`| `boolean test(T)`| `t -> true/false`    |
| `BiFunction<T,U,R>` | `R apply(T,U)` | `(t,u) -> r`     |

### 方法引用

```java
list.forEach(System.out::println);              // 静态方法引用
list.stream().map(String::toUpperCase);          // 实例方法引用（类名）
list.stream().map(s -> s.length());
list.stream().map(String::length);              // 等价
list.forEach(System.out::println);              // 实例方法引用（对象）

// 构造方法引用
Supplier<List<String>> sup = ArrayList::new;
```

### Stream API

```java
List<Integer> list = List.of(1, 2, 3, 4, 5);

// 常见操作
list.stream()
    .filter(n -> n % 2 == 1)            // 过滤
    .map(n -> n * n)                    // 映射
    .sorted()                           // 排序
    .distinct()                         // 去重
    .limit(3)                            // 取前 N
    .skip(1)                             // 跳过前 N
    .forEach(System.out::println);

// 归约
int sum = list.stream().mapToInt(n -> n).sum();
int product = list.stream().reduce(1, (a, b) -> a * b);  // 120

// 收集
List<Integer> evens = list.stream().filter(n -> n % 2 == 0).toList();
Set<Integer> set = list.stream().collect(Collectors.toSet());
Map<Boolean, List<Integer>> groups = list.stream()
    .collect(Collectors.partitioningBy(n -> n > 3));
String joined = list.stream().map(String::valueOf).collect(Collectors.joining(","));

// 并行流
long count = list.parallelStream().filter(n -> n > 2).count();
```

### Optional

```java
Optional<String> opt = Optional.ofNullable(getName());

// 旧
String name = opt.orElse("default");
String name2 = opt.orElseGet(() -> produceDefault());

// Java 11+
String name3 = opt.orElseThrow();   // 为空抛 NoSuchElementException

// Java 9+ ifPresentOrElse
opt.ifPresentOrElse(
  n -> System.out.println("有：" + n),
  () -> System.out.println("空")
);
```

## Java 9：模块化

```java
// module-info.java
module com.example.app {
  requires java.sql;
  exports com.example.api;
  uses com.example.spi.Service;
  provides com.example.spi.Service with com.example.impl.MyService;
}
```

- `requires`：依赖其他模块
- `exports`：导出包
- `uses / provides`：服务发现与实现

### 不可变集合工厂

```java
List<Integer> list = List.of(1, 2, 3);       // 不可变
Set<Integer> set = Set.of(1, 2, 3);
Map<String, Integer> map = Map.of("a", 1, "b", 2);
```

## Java 10：var 局部变量类型推断

```java
var list = new ArrayList<String>();   // 推断为 ArrayList<String>
var map = new HashMap<String, Integer>();
var stream = list.stream();

// 仅用于局部变量，不能用于字段、方法参数、返回类型
```

## Java 14：Record

```java
// 旧写法：写一堆 getter/setter/equals/hashCode/toString
public class Point {
  private final int x;
  private final int y;
  public Point(int x, int y) { this.x = x; this.y = y; }
  public int x() { return x; }
  public int y() { return y; }
  // + equals + hashCode + toString
}

// Record：一行搞定（Java 14+）
public record Point(int x, int y) {}

Point p = new Point(1, 2);
p.x();           // 1
p.y();           // 2
p.equals(new Point(1, 2));   // true
```

**特点**：
- 不可变（字段 final）
- 自动生成构造、访问器（`x()` 而非 `getX()`）、equals、hashCode、toString
- 不能 extends 其他类（隐式继承 Record）
- 可实现接口

```java
public record User(String name, int age) implements Comparable<User> {
  // 紧凑构造：参数校验
  public User {
    if (age < 0) throw new IllegalArgumentException();
  }
  // 可自定义方法
  public boolean isAdult() { return age >= 18; }
}
```

## Java 14：switch 表达式

```java
// 语句（穿透）
switch (day) {
  case 1: case 2: System.out.println("工作日"); break;
  default: System.out.println("周末");
}

// 表达式（无穿透，有返回值）
String name = switch (day) {
  case 1, 2 -> "工作日";
  default -> "周末";
};

// yield 返回复杂值
int result = switch (op) {
  case "+" -> a + b;
  case "-" -> a - b;
  default -> {
    log.warn("未知操作：" + op);
    yield 0;
  }
};
```

## Java 16：模式匹配 instanceof

```java
// 旧
if (obj instanceof String) {
  String s = (String) obj;
  System.out.println(s.length());
}

// 新（自动绑定变量）
if (obj instanceof String s) {
  System.out.println(s.length());
}

// 可在条件中组合
if (obj instanceof String s && s.length() > 3) { ... }
```

## Java 17：密封类

```java
public sealed class Shape permits Circle, Square, Triangle {}
final class Circle extends Shape { double r; }
final class Square extends Shape { double side; }
non-sealed class Triangle extends Shape { ... }   // 允许任意继承
```

- `sealed`：限定可继承的子类
- `permits`：列出允许的子类
- 子类必须 `final` / `sealed` / `non-sealed`

**配合模式匹配**：

```java
double area = switch (shape) {
  case Circle c -> Math.PI * c.r * c.r;
  case Square s -> s.side * s.side;
  case Triangle t -> 0.5 * t.base * t.height;
};
```

## Java 21：虚拟线程

```java
// 传统平台线程（1:1 映射 OS 线程）
Thread t = new Thread(() -> { ... });
t.start();

// 虚拟线程（JVM 调度，M:N）
Thread vt = Thread.ofVirtual().start(() -> { ... });

// 或用执行器
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
  executor.submit(() -> handle(req));
}

// 100 万个虚拟线程也不爆
List<Thread> threads = IntStream.range(0, 1_000_000)
    .mapToObj(i -> Thread.ofVirtual().start(() -> io()))
    .toList();
threads.forEach(Thread::join);
```

**特点**：
- 极轻量（KB 级，平台线程 MB 级）
- 适合 IO 密集场景（HTTP 调用、数据库查询）
- 阻塞虚拟线程不阻塞平台线程
- 不适合 CPU 密集任务

## Java 21：模式匹配 switch

```java
String format(Object obj) {
  return switch (obj) {
    case null -> "空";
    case Integer i -> "整数：" + i;
    case String s when s.length() > 5 -> "长字符串：" + s;
    case String s -> "短字符串：" + s;
    case int[] arr -> "数组长度：" + arr.length;
    default -> "其他";
  };
}
```

## LTS 版本对照

| 版本 | 年份 | 关键特性                          |
| ---- | ---- | --------------------------------- |
| 8    | 2014 | Lambda、Stream、Optional          |
| 11   | 2018 | var、HTTP Client、模块化成熟      |
| 17   | 2021 | Record、密封类、模式匹配 instanceof |
| 21   | 2023 | 虚拟线程、模式匹配 switch         |

## 小结

| 特性              | 版本 | 要点                              |
| ----------------- | ---- | --------------------------------- |
| Lambda / Stream   | 8    | 函数式编程，集合操作              |
| Optional           | 8    | 替代 null，显式处理空              |
| 模块化             | 9    | 封装与依赖管理                    |
| var                | 10   | 局部类型推断                      |
| Record             | 14   | 不可变数据载体                    |
| switch 表达式     | 14   | 无穿透，有返回值                  |
| instanceof 模式   | 16   | 自动绑定变量                      |
| 密封类             | 17   | 限定继承                          |
| 虚拟线程           | 21   | 轻量并发                          |
