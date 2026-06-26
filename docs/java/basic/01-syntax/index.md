---
title: 01 语法基础
---

# Java 语法基础

> 本章涵盖 Java 的变量、数据类型、运算符、流程控制、数组等基础语法，是后续所有内容的地基。

## 数据类型

Java 是强类型语言，分为**基本类型**和**引用类型**。

### 基本类型（8 种）

| 类型    | 大小    | 默认值   | 范围                          |
| ------- | ------- | -------- | ----------------------------- |
| `byte`  | 1 字节  | 0        | -128 ~ 127                    |
| `short` | 2 字节  | 0        | -32768 ~ 32767                |
| `int`   | 4 字节  | 0        | -2^31 ~ 2^31-1                |
| `long`  | 8 字节  | 0L       | -2^63 ~ 2^63-1                |
| `float` | 4 字节  | 0.0f     | 单精度浮点                     |
| `double`| 8 字节  | 0.0d     | 双精度浮点                     |
| `char`  | 2 字节  | '\u0000' | 0 ~ 65535（Unicode）           |
| `boolean`| -      | false    | true / false                   |

```java
// 整数字面量默认 int，浮点默认 double
int a = 100;
long b = 100L;        // 注意 L 后缀
float c = 3.14f;      // 注意 f 后缀
double d = 3.14;
char e = '中';         // char 可存一个 Unicode 字符
boolean f = true;
```

### 引用类型

`String`、数组、对象等都是引用类型，默认值 `null`。

```java
String s = "hello";       // String 是引用类型
int[] arr = {1, 2, 3};    // 数组是引用类型
Object obj = null;        // 引用默认 null
```

> **注意**：`String` 虽然常被当作基本类型用，但它是引用类型，且不可变（immutable）。

## 类型转换

### 自动转换（ widening，小 → 大）

```java
int i = 100;
long l = i;        // int → long，自动
double d = l;       // long → double，自动
```

### 强制转换（narrowing，大 → 小，可能丢精度）

```java
double d = 3.99;
int i = (int) d;    // i = 3，小数部分丢失
long l = 100000L;
int j = (int) l;    // 若 l 超过 int 范围会溢出
```

## 变量作用域

```java
public class Scope {
  static int member = 1;           // 成员变量（类）

  public void method() {
    int local = 2;                 // 局部变量（方法）
    if (true) {
      int block = 3;               // 块作用域
      System.out.println(block);
    }
    // System.out.println(block);  // 编译错误，block 超出作用域
  }
}
```

## 运算符

### 算术运算符

```java
int a = 10 / 3;     // 3，整数除法
double b = 10.0 / 3; // 3.333...
int c = 10 % 3;      // 1，取余
int d = -10 % 3;     // -1，Java 的 % 结果符号与被除数一致
```

> **技巧**：求余数符号与左操作数一致。若要总是正余数，用 `Math.floorMod(-10, 3)` → 2。

### 逻辑运算符

```java
boolean x = true && false;   // false，短路与
boolean y = true || false;   // true，短路或
boolean z = !true;            // false
// & 和 | 不短路，&& 和 || 短路（推荐用短路版本）
```

### 位运算符

```java
int a = 0b1010;       // 10
int b = 0b0110;       // 6
int and = a & b;       // 0b0010 = 2
int or  = a | b;       // 0b1110 = 14
int xor = a ^ b;       // 0b1100 = 12
int not = ~a;          // 0b...0101 = -11
int left = a << 2;     // 0b101000 = 40
int right = a >> 1;    // 0b0101 = 5
int uright = -1 >>> 1; // 无符号右移
```

## 流程控制

### if / else if / else

```java
int score = 85;
if (score >= 90) {
  System.out.println("A");
} else if (score >= 80) {
  System.out.println("B");
} else {
  System.out.println("C");
}
```

### switch

```java
int day = 3;
String name = switch (day) {
  case 1 -> "周一";
  case 2 -> "周二";
  case 3 -> "周三";
  case 4, 5 -> "周四周五";
  default -> "周末";
};  // Java 14+ 箭头语法，无穿透
```

> **Java 14+ 新语法**：`->` 箭头分支不会穿透，返回值可赋给变量。旧的 `case X:` 语法会穿透。

### for

```java
for (int i = 0; i < 5; i++) {
  System.out.println(i);
}

// 增强 for（for-each）
int[] arr = {1, 2, 3};
for (int x : arr) {
  System.out.println(x);
}
```

### while / do-while

```java
int i = 0;
while (i < 5) { i++; }

int j = 0;
do { j++; } while (j < 5);   // 至少执行一次
```

### break / continue / 标签

```java
// break 跳出循环
for (int i = 0; i < 10; i++) {
  if (i == 5) break;
  System.out.println(i);  // 0..4
}

// continue 跳过本次
for (int i = 0; i < 10; i++) {
  if (i % 2 == 0) continue;
  System.out.println(i);  // 1 3 5 7 9
}

// 标签跳出多层循环
outer:
for (int i = 0; i < 3; i++) {
  for (int j = 0; j < 3; j++) {
    if (i == 1 && j == 1) break outer;
    System.out.println(i + "," + j);
  }
}
```

## 数组

### 一维数组

```java
int[] a = {1, 2, 3};           // 静态初始化
int[] b = new int[5];           // 动态初始化，默认 0
String[] c = new String[3];     // 默认 null

System.out.println(a.length);   // 3
System.out.println(a[0]);        // 1
```

### 二维数组

```java
int[][] m = {{1, 2}, {3, 4}};
int[][] n = new int[3][4];      // 3 行 4 列

// 遍历
for (int i = 0; i < m.length; i++) {
  for (int j = 0; j < m[i].length; j++) {
    System.out.println(m[i][j]);
  }
}
```

### 数组工具：Arrays

```java
import java.util.Arrays;

int[] arr = {3, 1, 2};
Arrays.sort(arr);                       // [1, 2, 3]
int[] copy = Arrays.copyOf(arr, 5);     // [1, 2, 3, 0, 0]
int idx = Arrays.binarySearch(arr, 2);  // 1（需先排序）
System.out.println(Arrays.toString(arr)); // [1, 2, 3]
```

## 方法

```java
// 修饰符 返回类型 方法名(参数列表) { 方法体 }
public static int add(int a, int b) {
  return a + b;
}

// 可变参数（本质是数组）
public static int sum(int... nums) {
  int total = 0;
  for (int n : nums) total += n;
  return total;
}

sum(1, 2, 3);        // 6
sum(1, 2, 3, 4, 5);  // 15
```

### 值传递

Java **只有值传递**：基本类型传值的副本，引用类型传引用的副本（副本仍指向同一对象）。

```java
public static void change(int x, int[] arr) {
  x = 100;            // 不影响外部基本类型
  arr[0] = 100;       // 影响外部数组（因为引用同一对象）
  arr = new int[]{9}; // 不影响外部（换了新对象）
}

int a = 1;
int[] b = {1, 2};
change(a, b);
// a 仍是 1
// b 变成 [100, 2]
```

## 输入输出

### 输出

```java
System.out.print("不换行");
System.out.println("换行");
System.out.printf("格式化：%d %s %.2f%n", 10, "hi", 3.14159);
// 输出：格式化：10 hi 3.14
```

### 输入

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
System.out.print("输入名字：");
String name = sc.nextLine();
System.out.print("输入年龄：");
int age = sc.nextInt();
System.out.println("你好，" + name + "，" + age + " 岁");
```

## 小结

| 知识点   | 要点                                  |
| -------- | ------------------------------------- |
| 数据类型 | 8 种基本类型 + 引用类型               |
| 类型转换 | 小转大自动，大转小强制                |
| 运算符   | `&&` `||` 短路，`%` 结果符号同被除数  |
| 流程控制 | switch 14+ 箭头语法不穿透             |
| 数组     | 长度固定，`Arrays` 工具类            |
| 方法     | 可变参数本质数组，只有值传递          |
