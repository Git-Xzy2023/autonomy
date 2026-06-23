---
title: Refs 与 forwardRef
---

# Refs 与 forwardRef

> Refs 提供了访问 DOM 元素或组件实例的方式，forwardRef 用于将 ref 转发给子组件。

---

## 一、Refs 概述

### 1.1 Refs 的用途

```
┌─────────────────────────────────────────┐
│              Refs 用途                  │
├─────────────────────────────────────────┤
│                                         │
│  1. 管理焦点、文本选择、媒体播放        │
│  2. 触发强制动画                        │
│  3. 集成第三方 DOM 库                   │
│  4. 保存不触发重渲染的可变值            │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 创建 Refs

```typescript
import { useRef, createRef } from 'react'

// 函数组件：useRef
function App() {
  const inputRef = useRef(null)
  return <input ref={inputRef} />
}

// 类组件：createRef
class App extends Component {
  inputRef = createRef()
  render() {
    return <input ref={this.inputRef} />
  }
}
```

---

## 二、访问 DOM 元素

### 2.1 基本访问

```typescript
function App() {
  const inputRef = useRef<HTMLInputElement>(null)

  const focus = () => {
    inputRef.current?.focus()
  }

  const getValue = () => {
    return inputRef.current?.value
  }

  const clear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focus}>聚焦</button>
      <button onClick={clear}>清空</button>
    </div>
  )
}
```

### 2.2 访问不同元素

```typescript
function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 操作 input
  const focusInput = () => inputRef.current?.focus()

  // 操作 div
  const changeColor = () => {
    if (divRef.current) {
      divRef.current.style.backgroundColor = 'red'
    }
  }

  // 操作 video
  const playVideo = () => videoRef.current?.play()
  const pauseVideo = () => videoRef.current?.pause()

  // 操作 canvas
  const drawCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, 100, 100)
    }
  }

  return (
    <div>
      <input ref={inputRef} />
      <div ref={divRef}>内容</div>
      <video ref={videoRef} src="video.mp4" />
      <canvas ref={canvasRef} width={200} height={200} />
    </div>
  )
}
```

---

## 三、回调 Refs

### 3.1 基本用法

```typescript
function App() {
  let inputElement: HTMLInputElement | null = null

  const setInputRef = (element: HTMLInputElement | null) => {
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

### 3.2 使用 useRef 保存回调 Ref

```typescript
function App() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      // 元素挂载
      inputRef.current = node
      node.focus()
    } else {
      // 元素卸载
      console.log('input 卸载')
    }
  }, [])

  return <input ref={setInputRef} />
}
```

### 3.3 列表中的 Refs

```typescript
function App() {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const items = ['item1', 'item2', 'item3']

  const focusItem = (index: number) => {
    itemRefs.current[index]?.focus()
  }

  return (
    <div>
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
      <button onClick={() => focusItem(0)}>聚焦第一项</button>
    </div>
  )
}
```

---

## 四、forwardRef 转发 Ref

### 4.1 问题：函数组件无法接收 ref

```typescript
// ❌ 普通函数组件无法接收 ref
function MyInput(props) {
  return <input {...props} />
}

function App() {
  const inputRef = useRef(null)
  // ref 不会传递给 input！
  return <MyInput ref={inputRef} />
}
```

### 4.2 使用 forwardRef

```typescript
import { forwardRef } from 'react'

const MyInput = forwardRef<HTMLInputElement, MyInputProps>(
  function MyInput(props, ref) {
    return <input ref={ref} {...props} />
  }
)

function App() {
  const inputRef = useRef<HTMLInputElement>(null)

  const focus = () => inputRef.current?.focus()

  return (
    <div>
      <MyInput ref={inputRef} placeholder="输入" />
      <button onClick={focus}>聚焦</button>
    </div>
  )
}
```

### 4.3 高阶组件中的 forwardRef

```typescript
function withTheme(Component) {
  const ThemedComponent = forwardRef((props, ref) => {
    const theme = useContext(ThemeContext)
    return <Component ref={ref} theme={theme} {...props} />
  })

  return ThemedComponent
}
```

---

## 五、useImperativeHandle

`useImperativeHandle` 用于自定义暴露给父组件的 ref 实例值。

### 5.1 基本用法

```typescript
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface InputHandle {
  focus: () => void
  clear: () => void
  getValue: () => string
  setValue: (value: string) => void
}

const FancyInput = forwardRef<InputHandle, FancyInputProps>(
  function FancyInput(props, ref) {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => {
        if (inputRef.current) inputRef.current.value = ''
      },
      getValue: () => inputRef.current?.value || '',
      setValue: (value: string) => {
        if (inputRef.current) inputRef.current.value = value
      }
    }))

    return <input ref={inputRef} />
  }
)

// 使用
function App() {
  const inputRef = useRef<InputHandle>(null)

  const handleFocus = () => inputRef.current?.focus()
  const handleClear = () => inputRef.current?.clear()
  const handleSetValue = () => inputRef.current?.setValue('hello')

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={handleFocus}>聚焦</button>
      <button onClick={handleClear}>清空</button>
      <button onClick={handleSetValue}>设置值</button>
    </div>
  )
}
```

### 5.2 限制暴露的方法

```typescript
const CustomInput = forwardRef<CustomHandle, Props>(
  function CustomInput(props, ref) {
    const inputRef = useRef<HTMLInputElement>(null)

    // 只暴露必要的方法，隐藏内部实现
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus()
      // 不暴露 clear、setValue 等方法
    }), [])  // 空依赖：方法只创建一次

    return <input ref={inputRef} />
  }
)
```

---

## 六、Refs 的常见场景

### 6.1 焦点管理

```typescript
function Form() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleEmailEnter = (e) => {
    if (e.key === 'Enter') {
      passwordRef.current?.focus()
    }
  }

  return (
    <form>
      <input
        ref={emailRef}
        type="email"
        onKeyDown={handleEmailEnter}
      />
      <input
        ref={passwordRef}
        type="password"
      />
    </form>
  )
}
```

### 6.2 媒体控制

```typescript
function VideoPlayer({ src }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const play = () => videoRef.current?.play()
  const pause = () => videoRef.current?.pause()
  const setVolume = (vol: number) => {
    if (videoRef.current) videoRef.current.volume = vol
  }

  return (
    <div>
      <video ref={videoRef} src={src} />
      <button onClick={play}>播放</button>
      <button onClick={pause}>暂停</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={e => setVolume(Number(e.target.value))}
      />
    </div>
  )
}
```

### 6.3 测量 DOM

```typescript
function MeasureExample() {
  const divRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect()
      setDimensions({ width, height })
    }
  }, [])

  return (
    <div>
      <div ref={divRef} style={{ width: '200px', height: '100px' }}>
        内容
      </div>
      <p>宽度：{dimensions.width}px</p>
      <p>高度：{dimensions.height}px</p>
    </div>
  )
}
```

### 6.4 集成第三方库

```typescript
function Chart({ data }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      // 初始化第三方图表库
      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: data
      })
    }

    return () => {
      // 清理
      chartRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    // 更新数据
    if (chartRef.current) {
      chartRef.current.data = data
      chartRef.current.update()
    }
  }, [data])

  return <canvas ref={canvasRef} />
}
```

---

## 七、ref 保存可变值

### 7.1 保存定时器 ID

```typescript
function App() {
  const [count, setCount] = useState(0)
  const timerRef = useRef<number | null>(null)

  const start = () => {
    if (timerRef.current) return  // 避免重复启动

    timerRef.current = window.setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
  }

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div>
      <p>{count}</p>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  )
}
```

### 7.2 保存最新值（解决闭包陷阱）

```typescript
function App() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  // 同步 ref
  useEffect(() => {
    countRef.current = count
  }, [count])

  useEffect(() => {
    const timer = setInterval(() => {
      // 使用 ref 获取最新值
      console.log('最新 count:', countRef.current)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

---

## 八、总结

### ✅ 关键知识点

1. **useRef**：创建 ref，访问 DOM 或保存可变值
2. **回调 Refs**：通过函数获取 DOM 元素
3. **forwardRef**：转发 ref 给子组件
4. **useImperativeHandle**：自定义暴露给父组件的方法
5. **常见场景**：焦点管理、媒体控制、DOM 测量、第三方库集成
6. **保存可变值**：定时器 ID、最新值（解决闭包陷阱）

### 🔜 下一章

- 下一章：[高阶组件 HOC](/web/react/advanced/03-hoc/)
- 上一章：[Context API 深入](/web/react/advanced/01-context/)
- 上一级：[React 进阶特性](/web/react/advanced/)
