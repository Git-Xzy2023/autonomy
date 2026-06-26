---
title: 02 面向对象
---

# Java 面向对象

> 面向对象编程（OOP）是 Java 的核心思想，包含封装、继承、多态三大特性，以及抽象类、接口、内部类等机制。

## 类与对象

### 定义类

```java
public class Person {
  // 成员变量（字段）
  private String name;
  private int age;

  // 构造方法
  public Person() {}                  // 无参构造
  public Person(String name, int age) {
    this.name = name;                 // this 指当前对象
    this.age = age;
  }

  // 方法
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  @Override
  public String toString() {
    return "Person{name='" + name + "', age=" + age + "}";
  }
}
```

### 创建对象

```java
Person p = new Person("Alice", 20);
System.out.println(p.getName());   // Alice
System.out.println(p);             // Person{name='Alice', age=20}
```

## 封装

封装 = 隐藏内部实现，对外暴露接口。用 `private` 保护字段，用 `getter/setter` 暴露访问。

```java
public class Account {
  private double balance;

  public double getBalance() { return balance; }

  public void deposit(double amount) {
    if (amount <= 0) throw new IllegalArgumentException("金额必须 > 0");
    balance += amount;
  }

  public void withdraw(double amount) {
    if (amount > balance) throw new IllegalStateException("余额不足");
    balance -= amount;
  }
}
```

## 继承

Java 单继承：一个类只能 `extends` 一个父类。所有类的根是 `Object`。

```java
public class Animal {
  protected String name;
  public Animal(String name) { this.name = name; }
  public void eat() { System.out.println(name + " 在吃"); }
}

public class Dog extends Animal {
  public Dog(String name) { super(name); }       // 调用父类构造
  public void bark() { System.out.println(name + " 汪汪"); }

  @Override
  public void eat() {                              // 方法重写
    System.out.println(name + " 在啃骨头");
  }
}

Dog d = new Dog("旺财");
d.eat();   // 旺财 在啃骨头（多态：调用子类重写的方法）
d.bark();  // 旺财 汪汪
```

### 重写（Override）规则

- 方法签名相同（名称 + 参数列表）
- 返回类型可以是父类返回类型的子类型（协变返回）
- 访问权限不能更严（父 `public` 子不能 `private`）
- 抛出异常不能更宽（父不抛子不能抛受检异常）
- 用 `@Override` 注解让编译器检查

### 重载（Overload）vs 重写（Override）

| 概念 | 发生位置 | 方法签名 | 返回类型 | 访问权限   |
| ---- | -------- | -------- | -------- | ---------- |
| 重载 | 同一个类 | 必须不同 | 无要求   | 无要求     |
| 重写 | 子父类   | 必须相同 | 协变     | 不能更严   |

## 多态

多态 = 父类引用指向子类对象，运行时调用子类重写的方法。

```java
Animal a = new Dog("旺财");    // 向上转型（自动）
a.eat();                       // 旺财 在啃骨头（动态绑定）

// 向下转型（强制，需先判断类型）
if (a instanceof Dog) {
  Dog d = (Dog) a;
  d.bark();
}

// Java 16+ 模式匹配
if (a instanceof Dog d) {       // 自动绑定到 d
  d.bark();
}
```

### 多态的三个必要条件

1. **继承**：子类继承父类
2. **重写**：子类重写父类方法
3. **向上转型**：父类引用指向子类对象

## abstract 与接口

### 抽象类

```java
public abstract class Shape {
  protected String name;
  public Shape(String name) { this.name = name; }

  public abstract double area();     // 抽象方法，无方法体

  public void describe() {           // 普通方法
    System.out.println(name + " 面积=" + area());
  }
}

public class Circle extends Shape {
  private double r;
  public Circle(double r) { super("圆"); this.r = r; }

  @Override
  public double area() { return Math.PI * r * r; }
}
```

### 接口

```java
public interface Comparable {
  int compareTo(Object o);
}

public interface Flyable {
  void fly();
  // Java 8+ 默认方法
  default void land() { System.out.println("降落"); }
  // Java 8+ 静态方法
  static Flyable noop() { return () -> System.out.println("不动"); }
  // Java 9+ 私有方法
  private void log() { System.out.println("飞行中"); }
}
```

### 抽象类 vs 接口

| 特性       | 抽象类               | 接口                       |
| ---------- | -------------------- | -------------------------- |
| 关键字     | `abstract class`     | `interface`                |
| 继承       | 单继承               | 多实现                     |
| 字段       | 任意                 | `public static final`     |
| 方法       | 任意                 | 抽象 / default / static    |
| 构造方法   | 有                   | 无                         |
| 设计语义   | "是什么"（is-a）      | "能做什么"（can-do）       |

## static

`static` 修饰的成员属于类，不属于对象。

```java
public class Counter {
  private static int count = 0;   // 类变量，所有实例共享
  private int id;                  // 实例变量

  public Counter() {
    count++;
    id = count;
  }

  public static int getCount() { return count; }  // 类方法
}

new Counter();
new Counter();
System.out.println(Counter.getCount());  // 2，通过类名调用
```

### 静态代码块

```java
public class Config {
  static {
    System.out.println("类加载时执行一次");
  }
}
```

## final

| 修饰目标 | 作用                         |
| -------- | ---------------------------- |
| 变量     | 常量，只能赋值一次           |
| 方法     | 不能被子类重写               |
| 类       | 不能被继承（如 String）      |

```java
public final class Config {            // 类不能被继承
  public static final int MAX = 100;   // 常量
  public final void run() {}            // 方法不能被重写
}
```

## 内部类

### 静态内部类

```java
public class Outer {
  static int x = 1;
  static class Inner {
    void test() { System.out.println(x); }  // 只能访问外部静态成员
  }
}
Outer.Inner inner = new Outer.Inner();
```

### 成员内部类

```java
public class Outer {
  private int x = 1;
  class Inner {
    void test() { System.out.println(x); }  // 可访问外部所有成员
  }
}
Outer.Inner inner = new Outer().new Inner();
```

### 局部内部类与匿名内部类

```java
// 匿名内部类（常用于回调、事件监听）
Runnable r = new Runnable() {
  @Override
  public void run() {
    System.out.println("匿名");
  }
};
new Thread(r).start();

// Lambda 等价写法（Java 8+）
new Thread(() -> System.out.println("lambda")).start();
```

## 枚举

```java
public enum Color {
  RED("红"), GREEN("绿"), BLUE("蓝");

  private final String name;
  Color(String name) { this.name = name; }
  public String getName() { return name; }
}

Color c = Color.RED;
System.out.println(c.getName());  // 红
System.out.println(c.ordinal()); // 0
for (Color x : Color.values()) {
  System.out.println(x);
}
```

> 枚举本质是继承 `java.lang.Enum` 的 final 类，天然单例、线程安全，是实现单例模式的最佳方式。

## Object 核心方法

| 方法                 | 作用                       |
| -------------------- | -------------------------- |
| `toString()`         | 对象字符串表示             |
| `equals(Object)`     | 判断相等                    |
| `hashCode()`         | 哈希值（与 equals 一致）   |
| `getClass()`         | 运行时类                    |
| `clone()`            | 浅拷贝                      |
| `wait()/notify()`    | 线程通信                    |

```java
public class Person {
  private String name;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Person p)) return false;   // 模式匹配
    return name.equals(p.name);
  }

  @Override
  public int hashCode() {
    return name == null ? 0 : name.hashCode();
  }
}
```

> **契约**：`equals` 相等的两个对象 `hashCode` 必须相等，否则在 HashMap/HashSet 中会出错。

## 小结

| 特性     | 关键字           | 要点                                |
| -------- | ---------------- | ----------------------------------- |
| 封装     | private          | 隐藏实现，暴露接口                  |
| 继承     | extends          | 单继承，子类获得父类非 private 成员 |
| 多态     | 向上转型         | 父类引用调子类方法                  |
| 抽象类   | abstract         | 模板，单继承                        |
| 接口     | interface        | 规范，多实现                        |
| static   | static           | 属于类                              |
| final    | final            | 不可变 / 不可继承 / 不可重写         |
| 枚举     | enum             | 有限实例，天然单例                  |
