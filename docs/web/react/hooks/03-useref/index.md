---
title: useRef 与 DOM
---

# useRef 与 DOM

> useRef 用于在组件渲染间保持可变数据，不触发重渲染，也常用于访问 DOM 元素。

---

## 一、useRef 基础

### 1.1 基本用法

```typescript
import { useRef } from 'react'

function App() {
  const countRef = useRef(0)

  const handleClick = () => {
    countRef.current++
    console.log(countRef.current)  // 不会触发重渲染
  }

  return <button onClick={handleClick}>点击</button>
}
```

### 1.2 返回值

```typescript
const ref = useRef(initialValue)

// ref 是一个对象：{ current: initialValue }
// ref.current 是可变的，修改不会触发重渲染
```

### 1.3 useRef vs useState

| 特性           | useState        | useRef          |
| -------------- | --------------- | --------------- |
| **修改触发渲染** | ✅ 是          | ❌ 否           |
| **跨渲染保持** | ✅ 是           | ✅ 是           |
| **使用场景**   | 需要显示的数据  | 不显示的数据    |
| **更新方式**   | setState 函数   | 直接修改 .current |

```typescript
function App() {
  const [count, setCount] = useState(0)  // 修改会重渲染
  const refCount = useRef(0)             // 修改不重渲染

  return (
    <div>
      <p>state: {count}</p>
      <p>ref: {refCount.current}</p>  {/* 不会更新显示 */}
      <button onClick={() => setCount(count + 1)}>+state</button>
      <button onClick={() => refCount.current++}>+ref</button>
    </div>
  )
}
```

---

## 二、访问 DOM 元素

### 2.1 基本用法

```typescript
function App() {
  const inputRef = useRef(null)

  const focusInput = () => {
    inputRef.current.focus()  // 直接操作 DOM
  }

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>聚焦输入框</button>
    </div>
  )
}
```

### 2.2 常见 DOM 操作

```typescript
function App() {
  const inputRef = useRef(null)
  const divRef = useRef(null)
  const videoRef = useRef(null)

  // 聚焦
  const focus = () => inputRef.current.focus()

  // 获取值
  const getValue = () => inputRef.current.value

  // 修改样式
  const changeColor = () => {
    divRef.current.style.color = 'red'
  }

  // 获取尺寸
  const getSize = () => {
    const rect = divRef.current.getBoundingClientRect()
    console.log(rect.width, rect.height)
  }

  // 视频控制
  const playVideo = () => videoRef.current.play()
  const pauseVideo = () => videoRef.current.pause()

  return (
    <div>
      <input ref={inputRef} />
      <div ref={divRef}>内容</div>
      <video ref={videoRef} src="video.mp4" />
    </div>
  )
}
```

### 2.3 列表中的 ref

```typescript
function App() {
  const itemRefs = useRef([])

  const items = ['item1', 'item2', 'item3']

  const focusItem = (index) => {
    itemRefs.current[index]?.focus()
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={item}
          ref={el => itemRefs.current[index] = el}
          tabIndex={0}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
```

---

## 三、forwardRef 转发 ref

### 3.1 问题：函数组件无法接收 ref

```typescript
// ❌ 普通函数组件无法接收 ref
function MyInput(props) {
  return <input {...props} />
}

function App() {
  const inputRef = useRef(null)

  return <MyInput ref={inputRef} />  // ref 不会传递给 input
}
```

### 3.2 使用 forwardRef

```typescript
import { forwardRef } from 'react'

// ✅ 使用 forwardRef 转发 ref
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} {...props} />
})

function App() {
  const inputRef = useRef(null)

  const focus = () => inputRef.current.focus()

  return (
    <div>
      <MyInput ref={inputRef} />
      <button onClick={focus}>聚焦</button>
    </div>
  )
}
```

### 3.3 TypeScript 类型

```typescript
import { forwardRef, useRef } from 'react'

interface MyInputProps {
  value: string
  onChange: (value: string) => void
}

const MyInput = forwardRef<HTMLInputElement, MyInputProps>(
  function MyInput(props, ref) {
    return <input ref={ref} value={props.value} />
  }
)
```

---

## 四、useImperativeHandle

`useImperativeHandle` 用于自定义暴露给父组件的 ref 实例值。

### 4.1 基本用法

```typescript
import { forwardRef, useImperativeHandle, useRef } from 'react'

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null)

  // 自定义暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = '' },
    getValue: () => inputRef.current.value
  }))

  return <input ref={inputRef} />
})

function App() {
  const inputRef = useRef(null)

  const handleFocus = () => inputRef.current.focus()
  const handleClear = () => inputRef.current.clear()

  return (
    <div>
      <MyInput ref={inputRef} />
      <button onClick={handleFocus}>聚焦</button>
      <button onClick={handleClear}>清空</button>
    </div>
  )
}
```

### 4.2 暴露特定方法

```typescript
interface InputHandle {
  focus: () => void
  clear: () => void
  setValue: (value: string) => void
}

const MyInput = forwardRef<InputHandle, MyInputProps>(
  function MyInput(props, ref) {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => {
        if (inputRef.current) inputRef.current.value = ''
      },
      setValue: (value: string) => {
        if (inputRef.current) inputRef.current.value = value
      }
    }), [])  // 依赖数组

    return <input ref={inputRef} />
  }
)
```

---

## 五、useRef 的常见场景

### 5.1 保存定时器 ID

```typescript
function App() {
  const [count, setCount] = useState(0)
  const timerRef = useRef(null)

  const start = () => {
    timerRef.current = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
  }

  const stop = () => {
    clearInterval(timerRef.current)
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current)  // 清理
  }, [])

  return (
    <div>
      {count}
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  )
}
```

### 5.2 保存最新值

```typescript
function App() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  // 同步 ref 到最新值
  useEffect(() => {
    countRef.current = count
  }, [count])

  // 在异步回调中获取最新值
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(countRef.current)  // 总是最新值
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### 5.3 判断是否为首次渲染

```typescript
function App() {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      console.log('首次渲染')
    } else {
      console.log('更新渲染')
    }
  })
}
```

### 5.4 保存上一次的值

```typescript
function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current  // 返回上一次的值
}

function App() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div>
      <p>当前：{count}</p>
      <p>上一次：{previousCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}
```

---

## 六、ref 回调函数

### 6.1 回调 ref

```typescript
function App() {
  let inputElement = null

  const setInputRef = (element) => {
    inputElement = element
  }

  const focus = () => inputElement?.focus()

  return (
    <div>
      <input ref={setInputRef} />
      <button onClick={focus}>聚焦</button>
    </div>
  )
}
```

### 6.2 回调 ref 的清理

React 16.13+ 会在卸载时调用回调 ref 并传入 null：

```typescript
function App() {
  const inputRef = useRef(null)

  const setInputRef = (node) => {
    if (node !== null) {
      // 元素挂载
      inputRef.current = node
      node.focus()
    } else {
      // 元素卸载
      console.log('input 卸载')
    }
  }

  return <input ref={setInputRef} />
}
```

---

## 七、常见陷阱

### 7.1 在渲染期间修改 ref

```typescript
function App() {
  const ref = useRef(0)

  // ❌ 错误：渲染期间不应修改 ref
  ref.current = ref.current + 1

  // ✅ 正确：在事件处理或 effect 中修改
  const handleClick = () => {
    ref.current++
  }

  return <button onClick={handleClick}>{ref.current}</button>
}
```

### 7.2 ref 初始值为 null

```typescript
function App() {
  const ref = useRef(null)

  useEffect(() => {
    // ✅ 检查 null
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return <input ref={ref} />
}
```

---

## 八、总结

### ✅ 关键知识点

1. **useRef**：跨渲染保持可变数据，不触发重渲染
2. **访问 DOM**：`ref={inputRef}`，通过 `inputRef.current` 操作
3. **forwardRef**：转发 ref 给子组件
4. **useImperativeHandle**：自定义暴露给父组件的方法
5. **保存定时器**：使用 ref 保存 timer ID
6. **保存最新值**：解决闭包陷阱
7. **usePrevious**：自定义 Hook 获取上一次的值

### 🔜 下一章

- 下一章：[useContext 上下文](/web/react/hooks/04-usecontext/)
- 上一章：[useEffect 副作用](/web/react/hooks/02-useeffect/)
- 上一级：[Hooks](/web/react/hooks/)
