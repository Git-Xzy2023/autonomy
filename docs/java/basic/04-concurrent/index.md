---
title: 04 多线程与并发
---

# Java 多线程与并发

> 并发是 Java 的核心难点，涵盖线程基础、同步机制、JUC 工具、线程池、并发容器与 AQS 原理。

## 线程基础

### 创建线程

```java
// 方式一：继承 Thread
class MyThread extends Thread {
  public void run() { System.out.println("线程：" + getName()); }
}
new MyThread().start();

// 方式二：实现 Runnable（推荐，解耦）
Thread t = new Thread(() -> System.out.println("lambda"));
t.start();

// 方式三：实现 Callable（有返回值）
Callable<Integer> task = () -> 42;
FutureTask<Integer> ft = new FutureTask<>(task);
new Thread(ft).start();
Integer result = ft.get();   // 阻塞获取结果
```

### 线程生命周期

```
NEW（新建）
  │ start()
  ▼
RUNNABLE（就绪/运行）
  │── wait() / join() / LockSupport.park() ──→ WAITING
  │── sleep(ms) / wait(ms)                   ──→ TIMED_WAITING
  │── synchronized 等锁                       ──→ BLOCKED
  │ run() 结束                                ──→ TERMINATED
```

### 常用方法

| 方法                  | 作用                          |
| --------------------- | ----------------------------- |
| `start()`             | 启动线程                      |
| `sleep(ms)`           | 睡眠，不释放锁                |
| `wait()`              | 等待，释放锁（需在同步块中）  |
| `notify()/notifyAll()`| 唤醒等待的线程                |
| `join()`              | 等待线程结束                  |
| `yield()`             | 让出 CPU                      |
| `setDaemon(true)`     | 设为守护线程                  |

> **wait vs sleep**：`wait` 释放锁、需在 synchronized 块中、属于 Object；`sleep` 不释放锁、任意位置、属于 Thread。

## 同步机制

### synchronized

```java
// 同步方法（锁 this）
public synchronized void m1() { ... }

// 同步静态方法（锁 Class）
public static synchronized void m2() { ... }

// 同步代码块（锁指定对象）
public void m3() {
  synchronized (this) { ... }
  synchronized (lockObj) { ... }
}
```

**底层原理**：基于 Monitor（管程）。对象头中存储锁状态：
- 偏向锁：单线程访问，CAS 记录线程 ID
- 轻量级锁：多线程交替，CAS 自旋
- 重量级锁：竞争激烈，进入 Monitor 队列阻塞

### volatile

保证可见性 + 禁止指令重排序，**不保证原子性**。

```java
public class Singleton {
  private static volatile Singleton instance;   // volatile 防止重排序
  public static Singleton getInstance() {
    if (instance == null) {
      synchronized (Singleton.class) {
        if (instance == null) {
          instance = new Singleton();   // new 非原子：分配→初始化→赋值
        }
      }
    }
    return instance;
  }
}
```

### Lock（ReentrantLock）

```java
ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
  // 临界区
} finally {
  lock.unlock();          // 必须在 finally 释放
}

// 可中断、可超时、可公平
ReentrantLock fair = new ReentrantLock(true);   // 公平锁
if (lock.tryLock(3, TimeUnit.SECONDS)) { ... } // 尝试获取，超时放弃
```

**synchronized vs ReentrantLock**：

| 特性       | synchronized | ReentrantLock    |
| ---------- | ------------ | ---------------- |
| 释放锁     | 自动         | 手动 unlock      |
| 可中断     | 否           | 是               |
| 可超时     | 否           | 是               |
| 公平锁     | 否           | 是               |
| 条件变量   | 1 个（wait） | 多个 Condition   |
| 性能       | JDK 6 后优化 | 与 synchronized 接近 |

### Condition

```java
ReentrantLock lock = new ReentrantLock();
Condition notFull = lock.newCondition();
Condition notEmpty = lock.newCondition();

// 生产者
lock.lock();
try {
  while (queue.isFull()) notFull.await();   // 等待不满
  queue.add(item);
  notEmpty.signal();                        // 通知非空
} finally { lock.unlock(); }
```

## 线程池

### 为什么用线程池

- 降低资源消耗（重复利用线程）
- 提高响应速度（无需新建线程）
- 便于管理（统一监控、调优）

### ThreadPoolExecutor

```java
ExecutorService pool = new ThreadPoolExecutor(
  2,                              // corePoolSize 核心线程数
  4,                              // maximumPoolSize 最大线程数
  60, TimeUnit.SECONDS,           // 空闲存活时间
  new LinkedBlockingQueue<>(100), // 工作队列
  Executors.defaultThreadFactory(),
  new ThreadPoolExecutor.AbortPolicy()  // 拒绝策略
);
```

**工作流程**：
1. 线程数 < corePoolSize → 新建核心线程执行
2. 线程数 = corePoolSize → 入队列
3. 队列满 & 线程数 < maxPoolSize → 新建非核心线程
4. 队列满 & 线程数 = maxPoolSize → 触发拒绝策略

### 拒绝策略

| 策略               | 行为                           |
| ------------------ | ------------------------------ |
| AbortPolicy        | 抛 RejectedExecutionException   |
| CallerRunsPolicy   | 由提交任务的线程执行            |
| DiscardPolicy      | 丢弃任务，不报错                |
| DiscardOldestPolicy| 丢弃队列最老的任务再提交        |

### Executors 工具（不推荐直接用）

```java
Executors.newFixedThreadPool(4);    // 固定大小，队列无界（OOM 风险）
Executors.newCachedThreadPool();     // 0~Integer.MAX，OOM 风险
Executors.newSingleThreadExecutor(); // 单线程
Executors.newScheduledThreadPool(2); // 定时任务
```

> **阿里规约**：禁止用 Executors 创建线程池，应手动用 ThreadPoolExecutor，避免无界队列导致 OOM。

### 提交任务

```java
pool.execute(() -> System.out.println("无返回值"));

Future<String> f = pool.submit(() -> "有返回值");
String s = f.get();

// 批量
List<Future<String>> futures = pool.invokeAll(
  List.of(() -> "a", () -> "b")
);

// 原生异步（Java 8+）
CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> "hello");
cf.thenApply(s -> s + " world")
  .thenAccept(System.out::println);  // hello world
```

## JUC 并发工具

### CountDownLatch

倒计时锁存器，等待 N 个任务完成。

```java
CountDownLatch latch = new CountDownLatch(3);
for (int i = 0; i < 3; i++) {
  new Thread(() -> {
    try { Thread.sleep(1000); } catch (Exception e) {}
    latch.countDown();
  }).start();
}
latch.await();  // 阻塞直到 count 减到 0
System.out.println("全部完成");
```

### CyclicBarrier

循环屏障，N 个线程相互等待到齐。

```java
CyclicBarrier barrier = new CyclicBarrier(3, () -> System.out.println("齐了"));
for (int i = 0; i < 3; i++) {
  new Thread(() -> {
    barrier.await();   // 等待 3 个线程都到达
  }).start();
}
```

### Semaphore

信号量，控制并发访问数。

```java
Semaphore sem = new Semaphore(3);   // 同时只允许 3 个
for (int i = 0; i < 10; i++) {
  new Thread(() -> {
    try {
      sem.acquire();
      System.out.println("获取许可");
    } finally {
      sem.release();
    }
  }).start();
}
```

## 并发容器

| 容器                  | 特点                             |
| --------------------- | -------------------------------- |
| ConcurrentHashMap     | 线程安全 HashMap                  |
| CopyOnWriteArrayList  | 写时复制，读多写少               |
| CopyOnWriteArraySet   | 基于 CopyOnWriteArrayList        |
| ConcurrentLinkedQueue | 无锁并发队列                     |
| BlockingQueue         | 阻塞队列（生产者-消费者）         |
| ConcurrentSkipListMap | 跳表实现的并发有序 Map            |

### BlockingQueue

```java
BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);

// 生产者
queue.put("item");          // 满则阻塞

// 消费者
String item = queue.take(); // 空则阻塞
```

常见实现：
- `ArrayBlockingQueue`：有界数组
- `LinkedBlockingQueue`：链表（默认无界，慎用）
- `SynchronousQueue`：容量 0，直接交付
- `PriorityBlockingQueue`：优先级

## AQS 原理

AQS（AbstractQueuedSynchronizer）是 JUC 锁与同步器的基础框架。

**核心思想**：
- 一个 `volatile int state` 表示同步状态
- 一个 FIFO 双向队列管理等待线程
- 模板方法模式：子类实现 `tryAcquire/tryRelease`

```
ReentrantLock      → 独占锁，state = 重入次数
Semaphore          → 共享锁，state = 许可数
CountDownLatch     → 共享锁，state = 计数
ReentrantReadWriteLock → state 高 16 位读、低 16 位写
```

## ThreadLocal

线程本地变量，每个线程有独立副本。

```java
ThreadLocal<SimpleDateFormat> tl = ThreadLocal.withInitial(
  () -> new SimpleDateFormat("yyyy-MM-dd")
);

String date = tl.get().format(new Date());

// 用完务必 remove，否则线程池场景导致内存泄漏
tl.remove();
```

**原理**：每个 Thread 持有 `ThreadLocalMap`，key 是 ThreadLocal（弱引用），value 是变量值（强引用）。

> **内存泄漏**：value 不会随 key 回收而回收，需手动 `remove()`。

## 小结

| 知识点       | 要点                                       |
| ------------ | ------------------------------------------ |
| 线程创建     | 优先用 Runnable / Callable                 |
| 同步         | synchronized 自动释放，ReentrantLock 手动  |
| volatile     | 可见性 + 禁重排，不保证原子性              |
| 线程池       | 手动用 ThreadPoolExecutor，避免无界队列    |
| 并发工具     | CountDownLatch / CyclicBarrier / Semaphore |
| 并发容器     | ConcurrentHashMap / BlockingQueue         |
| AQS          | state + CLH 队列                           |
| ThreadLocal  | 线程隔离，注意 remove                      |
