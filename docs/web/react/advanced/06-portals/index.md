---
title: Portals 传送门
---

# Portals 传送门

> Portals 提供了一种将子组件渲染到 DOM 树中其他位置的方式。

---

## 一、为什么需要 Portals？

### 1.1 DOM 层级问题

```
┌─────────────────────────────────────────┐
│              DOM 层级问题               │
├─────────────────────────────────────────┤
│                                         │
│  父组件                                 │
│   ├── 子组件                            │
│   │   └── Modal（被父组件 overflow 截断）│
│   └── 其他内容                          │
│                                         │
│  问题：                                 │
│  ├── z-index 被父组件限制               │
│  ├── overflow: hidden 截断              │
│  └── 样式继承影响                       │
│                                         │
│  Portals 解决：                         │
│  └── 将 Modal 渲染到 body 下            │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 适用场景

- ✅ 模态框（Modal）
- ✅ 弹窗（Popover、Tooltip）
- ✅ 通知（Notification）
- ✅ 下拉菜单（Dropdown）
- ✅ 全屏遮罩

---

## 二、基本用法

### 2.1 创建 Portal

```typescript
import { createPortal } from 'react-dom'

function Modal({ children }) {
  return createPortal(
    <div className="modal">
      {children}
    </div>,
    document.body  // 渲染到 body 下
  )
}

// 使用
function App() {
  return (
    <div>
      <h1>页面内容</h1>
      <Modal>
        <p>模态框内容</p>
      </Modal>
    </div>
  )
}
```

### 2.2 语法

```typescript
createPortal(children, container)

// children：任意 React 元素
// container：DOM 元素
```

---

## 三、Modal 组件示例

### 3.1 基础 Modal

```typescript
import { createPortal } from 'react-dom'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // 阻止滚动
      document.body.style.overflow = 'hidden'

      // ESC 关闭
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleEsc)

      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleEsc)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.body
  )
}

// 使用
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>打开</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>标题</h2>
        <p>内容</p>
      </Modal>
    </div>
  )
}
```

### 3.2 带动画的 Modal

```typescript
function Modal({ isOpen, onClose, children }) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  return createPortal(
    <div className={`modal-overlay ${isOpen ? 'fade-in' : 'fade-out'}`}>
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.body
  )
}
```

---

## 四、Tooltip 组件

```typescript
import { createPortal } from 'react-dom'
import { useState, useRef, useLayoutEffect } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
}

function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      })
    }
  }, [show])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && createPortal(
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}

// 使用
function App() {
  return (
    <Tooltip content="这是一个提示">
      <button>悬停查看</button>
    </Tooltip>
  )
}
```

---

## 五、Notification 组件

```typescript
import { createPortal } from 'react-dom'
import { useState, useCallback } from 'react'

interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

let notificationId = 0

function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((message: string, type: Notification['type']) => {
    const id = ++notificationId
    setNotifications(prev => [...prev, { id, message, type }])

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  // 暴露给全局使用
  useEffect(() => {
    (window as any).notify = addNotification
  }, [addNotification])

  return createPortal(
    <div className="notification-container">
      {notifications.map(n => (
        <div key={n.id} className={`notification notification-${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>,
    document.body
  )
}

// 使用
function App() {
  return (
    <>
      <NotificationContainer />
      <button onClick={() => (window as any).notify('成功', 'success')}>
        显示通知
      </button>
    </>
  )
}
```

---

## 六、Portal 事件冒泡

### 6.1 事件冒泡特性

虽然 Portal 渲染到其他 DOM 节点，但事件仍会冒泡到 React 父组件：

```typescript
function App() {
  const handleClick = () => {
    console.log('父组件捕获到点击')
  }

  return (
    <div onClick={handleClick}>
      <p>父组件</p>
      <Modal>
        {/* 点击这里的元素，handleClick 仍会触发 */}
        <button>Modal 按钮</button>
      </Modal>
    </div>
  )
}
```

### 6.2 阻止冒泡

```typescript
function Modal({ children }) {
  return createPortal(
    <div onClick={e => e.stopPropagation()}>
      {children}
    </div>,
    document.body
  )
}
```

---

## 七、Portal 与 Context

Portal 内的组件仍然可以访问父组件的 Context：

```typescript
const ThemeContext = createContext('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Modal>
        {/* 仍然可以访问 ThemeContext */}
        <ThemedComponent />
      </Modal>
    </ThemeContext.Provider>
  )
}

function ThemedComponent() {
  const theme = useContext(ThemeContext)
  return <div>主题：{theme}</div>  // 输出：dark
}
```

---

## 八、封装 Portal Hook

```typescript
function usePortal() {
  const containerRef = useRef<HTMLDivElement>()

  if (!containerRef.current && typeof document !== 'undefined') {
    containerRef.current = document.createElement('div')
    containerRef.current.className = 'portal-container'
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      document.body.appendChild(container)
      return () => {
        document.body.removeChild(container)
      }
    }
  }, [])

  return (children: React.ReactNode) => {
    if (!containerRef.current) return null
    return createPortal(children, containerRef.current)
  }
}

// 使用
function Modal({ children }) {
  const renderPortal = usePortal()

  return renderPortal(
    <div className="modal">
      {children}
    </div>
  )
}
```

---

## 九、总结

### ✅ 关键知识点

1. **createPortal**：将组件渲染到指定 DOM 节点
2. **适用场景**：Modal、Tooltip、Notification、Dropdown
3. **事件冒泡**：Portal 仍会向 React 父组件冒泡
4. **Context**：Portal 内可访问父组件 Context
5. **样式隔离**：避免父组件样式影响（overflow、z-index）
6. **封装 Hook**：`usePortal` 简化使用

### 🔜 下一章

- 下一章：[Suspense 与懒加载](/web/react/advanced/07-suspense/)
- 上一章：[错误边界](/web/react/advanced/05-error-boundaries/)
- 上一级：[React 进阶特性](/web/react/advanced/)
