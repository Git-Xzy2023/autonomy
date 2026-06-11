---
title: "useState 与泛型"
---

# useState 与泛型

```tsx
// 简单情况 —— TS 能推断
const [count, setCount] = useState(0); // count: number

// 初始值为 null 或 undefined —— 必须标注
const [user, setUser] = useState<User | null>(null);
const [list, setList] = useState<string[]>([]);

// 使用回调函数的返回值推断（TS 4.7+）
const [value, setValue] = useState(() => loadValue()); // 从 loadValue() 返回类型推断
```

---
