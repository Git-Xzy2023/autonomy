---
title: 03 集合框架
---

# Java 集合框架

> Java 集合框架（JCF）是存储和操作一组数据的统一架构，主要分为 Collection（List / Set / Queue）和 Map 两大体系。

## 总览

```
Collection
├── List（有序，可重复）
│   ├── ArrayList     数组实现，查询快
│   ├── LinkedList    链表实现，增删快
│   └── Vector        线程安全的 ArrayList（已过时）
│
├── Set（无序，不可重复）
│   ├── HashSet       基于 HashMap
│   ├── LinkedHashSet 保留插入顺序
│   └── TreeSet       基于红黑树，有序
│
└── Queue（队列）
    ├── ArrayDeque    数组实现的双端队列
    ├── PriorityQueue 优先队列（堆）
    └── LinkedList    也实现 Deque

Map（键值对，键不可重复）
├── HashMap          数组 + 链表 + 红黑树
├── LinkedHashMap    保留插入顺序
├── TreeMap          基于红黑树，键有序
├── Hashtable        线程安全（已过时）
└── ConcurrentHashMap 线程安全（推荐）
```

## List

### ArrayList

基于动态数组，查询快 `O(1)`，增删慢（中间插入需移动元素）。

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add(1, "c");           // 在索引 1 插入
list.set(0, "A");           // 替换
list.get(0);                // A
list.remove(0);             // 删除
list.size();                // 长度
list.contains("b");         // true
list.isEmpty();

// 遍历
for (String s : list) { ... }
list.forEach(System.out::println);
list.stream().filter(s -> s.length() > 1).forEach(System.out::println);
```

**扩容机制**：初始容量 10，满后扩容为 1.5 倍（`oldCapacity + (oldCapacity >> 1)`）。

### LinkedList

基于双向链表，增删快 `O(1)`（已知节点），查询慢 `O(n)`。同时实现 `List` 和 `Deque`。

```java
LinkedList<String> list = new LinkedList<>();
list.addFirst("a");
list.addLast("b");
list.getFirst();
list.removeLast();
```

## Set

### HashSet

基于 `HashMap` 的 key，无序，`add/remove/contains` 均为 `O(1)`。

```java
Set<String> set = new HashSet<>();
set.add("a");
set.add("a");          // 重复添加无效
set.add("b");
System.out.println(set.size());  // 2
```

### LinkedHashSet

保留插入顺序。

### TreeSet

基于 `TreeMap`（红黑树），元素有序，`add/remove/contains` 为 `O(log n)`。

```java
Set<Integer> set = new TreeSet<>();
set.add(3); set.add(1); set.add(2);
set.forEach(System.out::println);  // 1 2 3
```

> 自定义对象放入 HashSet 需重写 `hashCode` 和 `equals`；放入 TreeSet 需实现 `Comparable` 或传 `Comparator`。

## Map

### HashMap

基于哈希表（数组 + 链表 + 红黑树），键值对存储。

```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.put("b", 2);
map.get("a");                  // 1
map.getOrDefault("c", 0);       // 0
map.containsKey("a");           // true
map.remove("a");
map.size();

// 遍历
for (Map.Entry<String, Integer> e : map.entrySet()) {
  System.out.println(e.getKey() + "=" + e.getValue());
}
map.forEach((k, v) -> System.out.println(k + "=" + v));
```

**HashMap 原理**：
- 默认初始容量 16，负载因子 0.75
- 元素个数 > 容量 × 0.75 时扩容为 2 倍
- 链表长度 ≥ 8 且数组长度 ≥ 64 时转红黑树（Java 8+）
- 红黑树节点 ≤ 6 时退化为链表

### HashMap 源码核心

```java
// hash：高 16 位异或低 16 位，让高位也参与运算
static final int hash(Object key) {
  int h;
  return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

// 定位桶下标
int index = (n - 1) & hash;   // n 是 2 的幂，等价 hash % n 但更快
```

### TreeMap / LinkedHashMap

- `TreeMap`：基于红黑树，key 有序（自然序或 Comparator）。
- `LinkedHashMap`：基于 HashMap + 双向链表，保留插入顺序或访问顺序（LRU 实现基础）。

### ConcurrentHashMap

线程安全的 HashMap，推荐替代 `Hashtable`。
- Java 7：分段锁（Segment）
- Java 8+：CAS + `synchronized` 锁单个桶，并发度更高

```java
ConcurrentMap<String, Integer> map = new ConcurrentHashMap<>();
map.put("a", 1);
map.compute("a", (k, v) -> v + 1);   // 原子更新
```

## Queue / Deque

### PriorityQueue

基于最小堆的优先队列，出队顺序按优先级（默认自然序）。

```java
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.add(3); pq.add(1); pq.add(2);
pq.poll();  // 1（最小先出）
pq.poll();  // 2
pq.poll();  // 3
```

### ArrayDeque

双端队列，基于循环数组，可作栈和队列用，性能优于 `Stack` 和 `LinkedList`。

```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1); stack.push(2);
stack.pop();  // 2（LIFO）

Deque<Integer> queue = new ArrayDeque<>();
queue.offer(1); queue.offer(2);
queue.poll();  // 1（FIFO）
```

## Collections 工具类

```java
List<Integer> list = new ArrayList<>(List.of(3, 1, 2));
Collections.sort(list);                 // [1, 2, 3]
Collections.reverse(list);              // [3, 2, 1]
Collections.shuffle(list);              // 随机打乱
Collections.max(list);                  // 3
List<Integer> unmod = Collections.unmodifiableList(list);
// unmod.add(4);  // 抛 UnsupportedOperationException
```

## Iterator

```java
List<String> list = new ArrayList<>(List.of("a", "b", "c"));
Iterator<String> it = list.iterator();
while (it.hasNext()) {
  String s = it.next();
  if (s.equals("b")) it.remove();   // 安全删除
}
```

> **fail-fast**：ArrayList 在迭代时被外部修改（非 iterator.remove）会抛 `ConcurrentModificationException`。多线程环境用 `CopyOnWriteArrayList`。

## 泛型

```java
// 泛型类
public class Box<T> {
  private T item;
  public void set(T item) { this.item = item; }
  public T get() { return item; }
}
Box<String> box = new Box<>();
box.set("hello");
String s = box.get();

// 泛型方法
public static <T> T first(List<T> list) { return list.get(0); }

// 通配符
void printAll(List<?> list) { ... }                  // 任意类型
void sum(List<? extends Number> list) { ... }        // 上界（只读）
void addAll(List<? super Integer> list) { ... }       // 下界（只写）
```

> **类型擦除**：泛型只在编译期检查，运行时擦除为 Object。`List<String>` 和 `List<Integer>` 运行时都是 `List`。

## 小结

| 集合             | 实现     | 有序 | 重复 | 线程安全 |
| ---------------- | -------- | ---- | ---- | -------- |
| ArrayList        | 数组     | 是   | 是   | 否       |
| LinkedList       | 链表     | 是   | 是   | 否       |
| HashSet          | 哈希     | 否   | 否   | 否       |
| TreeSet          | 红黑树   | 有序 | 否   | 否       |
| HashMap          | 哈希     | 否   | 键否 | 否       |
| TreeMap          | 红黑树   | 有序 | 键否 | 否       |
| ConcurrentHashMap| 哈希     | 否   | 键否 | 是       |
| CopyOnWriteArrayList | 数组 | 是   | 是   | 是       |
