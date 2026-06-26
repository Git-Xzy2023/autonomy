---
title: 05 JVM
---

# JVM 虚拟机

> JVM（Java Virtual Machine）是 Java 跨平台的基础，理解 JVM 有助于性能调优和排查线上问题。本章涵盖内存结构、垃圾回收、类加载机制。

## JVM 内存结构

```
┌─────────────────────────────────────────────┐
│                  JVM 运行时数据区              │
├──────────────┬──────────────────────────────┤
│  线程私有     │         线程共享              │
├──────────────┼──────────────────────────────┤
│              │                              │
│  程序计数器   │       方法区（元空间）         │
│  （PC 寄存器）│   类信息、常量、静态变量       │
│              │                              │
│  虚拟机栈     │       堆                      │
│  （栈帧）     │   对象实例、数组              │
│  局部变量表    │                              │
│  操作数栈     │                              │
│              │                              │
│  本地方法栈   │                              │
│  （Native）  │                              │
└──────────────┴──────────────────────────────┘
```

### 程序计数器（PC Register）

记录当前线程执行的字节码行号。线程私有，唯一不会 OOM 的区域。

### 虚拟机栈

线程私有，每个方法调用创建一个**栈帧**，包含：
- **局部变量表**：方法参数和局部变量
- **操作数栈**：计算中间结果
- **动态链接**：指向运行时常量池
- **方法出口**：返回地址

> `StackOverflowError`：栈深度超限。`OutOfMemoryError`：栈无法扩展。

### 本地方法栈

为 Native 方法服务，与虚拟机栈类似。

### 堆

线程共享，存放对象实例和数组，GC 主战场。可分：
- **新生代**（Young）：Eden + Survivor 0 + Survivor 1（8:1:1）
- **老年代**（Old）：长期存活的对象

### 方法区 / 元空间

线程共享，存放类信息、常量、静态变量。
- JDK 7 及之前：叫"永久代"（PermGen），堆的一部分
- JDK 8+：改为"元空间"（Metaspace），使用本地内存

> JDK 8 移除永久代，避免 `PermGen OutOfMemoryError`。

## 对象的创建

```
1. 类加载检查    → 检查常量池是否有类符号引用，已加载？
2. 分配内存      → 指针碰撞 / 空闲列表
3. 内存空间初始化 → 初始化为零值
4. 设置对象头      → Mark Word（哈希、GC 分代年龄、锁信息）+ 类元数据指针
5. 执行 <init>   → 构造方法
```

### 对象内存布局

```
对象 = 对象头（Header）+ 实例数据（Instance Data）+ 对齐填充（Padding）
```

## 垃圾回收（GC）

### 判断对象存活

**引用计数法**（淘汰）：循环引用问题。
**可达性分析**（JVM 使用）：从 GC Roots 出发能否到达。

**GC Roots** 包括：
- 虚拟机栈中的局部变量
- 方法区的类静态变量
- 方法区的常量
- 本地方法栈中的 JNI 引用

### 引用类型

| 类型       | 回收时机           | 用途               |
| ---------- | ------------------ | ------------------ |
| 强引用     | 永不回收（除非置 null） | 普通对象         |
| 软引用     | 内存不足时回收     | 缓存               |
| 弱引用     | 下次 GC 时回收     | ThreadLocalMap     |
| 虚引用     | 随时回收，仅跟踪回收 | 跟踪对象被回收   |

### GC 算法

- **标记-清除**：标记存活，清除其余。碎片多。
- **标记-复制**：将存活对象复制到另一半，清空原区。新生代用。
- **标记-整理**：标记存活，向一端移动。老年代用。
- **分代收集**：新生代用复制，老年代用标记-整理/清除。

### 垃圾收集器演进

| 收集器          | 代    | 算法       | 特点                  |
| --------------- | ------ | ---------- | --------------------- |
| Serial          | 新/老  | 复制/整理  | 单线程，STW           |
| ParNew          | 新生代 | 复制       | Serial 多线程版       |
| Parallel Scavenge | 新生代 | 复制     | 吞吐量优先            |
| Parallel Old    | 老年代 | 整理       | 配合 Parallel Scavenge|
| CMS             | 老年代 | 标记清除   | 低延迟，已废弃（JDK 14）|
| G1              | 新+老  | Region+SATB | 可预测停顿，JDK 9 默认|
| ZGC             | 新+老  | 染色指针   | <10ms 停顿，JDK 15 生产|
| Shenandoah     | 新+老  | 转发指针   | 低延迟                |

### G1 详解

将堆划分为多个 Region（1-32MB），每个 Region 可动态作为 Eden/Survivor/Old/Humongous。

```
┌──┬──┬──┬──┬──┬──┬──┬──┐
│E │S │O │O │H │H │O │E │   E=Eden S=Survivor O=Old H=Humongous
├──┼──┼──┼──┼──┼──┼──┼──┤
│O │E │S │O │E │O │O │O │
└──┴──┴──┴──┴──┴──┴──┴──┘
```

特点：
- 可预测停顿：用户设定目标停顿时间，G1 优先回收收益大的 Region
- 全堆收集，无新生代/老年代物理隔离
- 用 SATB（Snapshot At The Beginning）记录并发标记阶段的对象引用变化

## 内存分配策略

1. 对象优先在 Eden 分配
2. 大对象直接进老年代（避免复制开销）
3. 长期存活进老年代（熬过 MaxTenuringThreshold 次 GC）
4. 动态年龄判断：Survivor 中相同年龄对象大小总和 > Survivor 一半，该年龄及以上进老年代

## 类加载机制

### 加载过程

```
加载 → 验证 → 准备 → 解析 → 初始化 → 使用 → 卸载
       └──────── 链接 ────────┘
```

- **加载**：通过类全限定名获取字节流，转为方法区的运行时数据结构，生成 Class 对象
- **验证**：文件格式、元数据、字节码、符号引用
- **准备**：为静态变量分配内存并赋零值（`static int x = 1` 此阶段 x=0，初始化阶段才赋 1；`static final` 常量在此阶段赋值）
- **解析**：符号引用 → 直接引用
- **初始化**：执行 `<clinit>` 静态代码块

### 类加载器

```
Bootstrap ClassLoader（C++，加载 rt.jar）
  ↑ 父
ExtClassLoader / PlatformClassLoader（加载 ext / jdk 模块）
  ↑ 父
AppClassLoader（加载 classpath）
  ↑ 父
自定义 ClassLoader
```

### 双亲委派模型

加载类时先委派父加载器加载，父加载不了才自己加载。

```java
// ClassLoader.loadClass 源码逻辑
protected Class<?> loadClass(String name) {
  // 1. 检查是否已加载
  Class<?> c = findLoadedClass(name);
  if (c == null) {
    // 2. 委派父加载器
    if (parent != null) c = parent.loadClass(name);
    else c = findBootstrapClassOrNull(name);
    // 3. 父加载不了，自己加载
    if (c == null) c = findClass(name);
  }
  return c;
}
```

**意义**：防止核心类被篡改（如自定义 `java.lang.String` 会被 Bootstrap 加载真正的 String）。

**打破双亲委派**：Tomcat、SPI（JDBC）、OSGi 等。重写 `loadClass` 而非 `findClass`。

## JVM 调优参数

```bash
# 堆大小
-Xms512m        # 初始堆
-Xmx1024m       # 最大堆
-Xmn256m        # 新生代大小
-XX:MetaspaceSize=128m
-XX:MaxMetaspaceSize=256m

# 收集器
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200

# GC 日志
-Xlog:gc*:file=gc.log:time,level,tags

# 内存溢出时 dump
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/tmp/heap.hprof
```

## 常见 OOM

| 类型                          | 原因                       |
| ----------------------------- | -------------------------- |
| `java.lang.OutOfMemoryError: Java heap space` | 堆内存不足 |
| `Metaspace`                   | 类元数据过多               |
| `GC overhead limit exceeded`  | GC 占用 > 98% 时间回收 < 2% |
| `Direct buffer memory`        | 直接内存不足               |
| `unable to create new native thread` | 线程数过多           |

## 小结

| 知识点       | 要点                                   |
| ------------ | -------------------------------------- |
| 内存结构     | 程序计数器 / 栈 / 本地方法栈 / 堆 / 元空间 |
| GC 判断      | 可达性分析，从 GC Roots 出发           |
| 收集器       | G1（JDK 9 默认）、ZGC（低延迟）         |
| 类加载       | 加载→验证→准备→解析→初始化             |
| 双亲委派     | 先父后子，保护核心类                   |
| 调优         | -Xms / -Xmx / -XX:+UseG1GC            |
