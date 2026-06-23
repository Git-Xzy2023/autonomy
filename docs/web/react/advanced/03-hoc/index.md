---
title: 高阶组件 HOC
---

# 高阶组件 HOC

> 高阶组件（HOC）是 React 中复用组件逻辑的高级技术，是一个接收组件并返回新组件的函数。

---

## 一、HOC 概述

### 1.1 什么是 HOC？

```
┌─────────────────────────────────────────┐
│              高阶组件                    │
├─────────────────────────────────────────┤
│                                         │
│  HOC = Higher-Order Component           │
│                                         │
│  函数签名：                              │
│  function HOC(WrappedComponent) {       │
│    return class extends Component {     │
│      render() {                         │
│        return <WrappedComponent />      │
│      }                                  │
│    }                                    │
│  }                                      │
│                                         │
│  本质：函数 → 接收组件 → 返回新组件      │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 HOC vs 组件

```typescript
// 组件：将 props 转换为 UI
const Component = (props) => <div>{props.name}</div>

// HOC：将组件转换为另一个组件
const EnhancedComponent = HOC(Component)
```

---

## 二、基本用法

### 2.1 第一个 HOC

```typescript
import { Component } from 'react'

// HOC：添加 loading 状态
function withLoading(WrappedComponent) {
  return class extends Component {
    render() {
      const { loading, ...restProps } = this.props

      if (loading) {
        return <div>加载中...</div>
      }

      return <WrappedComponent {...restProps} />
    }
  }
}

// 使用
const UserList = ({ users }) => (
  <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
)

const UserListWithLoading = withLoading(UserList)

// 渲染
<App>
  <UserListWithLoading loading={true} users={[]} />
</App>
```

### 2.2 函数组件形式的 HOC

```typescript
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ loading, ...props }) {
    if (loading) {
      return <div>加载中...</div>
    }
    return <WrappedComponent {...props} />
  }
}
```

### 2.3 TypeScript HOC

```typescript
import { ComponentType } from 'react'

interface WithLoadingProps {
  loading: boolean
}

function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & WithLoadingProps> {
  return function WithLoadingComponent({
    loading,
    ...props
  }: P & WithLoadingProps) {
    if (loading) {
      return <div>加载中...</div>
    }
    return <WrappedComponent {...props as P} />
  }
}
```

---

## 三、常见 HOC 模式

### 3.1 属性代理

HOC 通过 props 操作 WrappedComponent：

```typescript
function withExtraData(WrappedComponent) {
  return class extends Component {
    state = {
      extraData: null
    }

    async componentDidMount() {
      const data = await fetchExtraData()
      this.setState({ extraData: data })
    }

    render() {
      const { extraData } = this.state
      return (
        <WrappedComponent
          {...this.props}
          extraData={extraData}
        />
      )
    }
  }
}
```

### 3.2 反向继承

HOC 继承 WrappedComponent：

```typescript
function withLogging(WrappedComponent) {
  return class extends WrappedComponent {
    componentDidMount() {
      super.componentDidMount?.()
      console.log('组件挂载', this.constructor.name)
    }

    componentDidUpdate(prevProps, prevState) {
      super.componentDidUpdate?.(prevProps, prevState)
      console.log('组件更新')
    }

    render() {
      return super.render()
    }
  }
}
```

### 3.3 条件渲染

```typescript
function withAuth(WrappedComponent) {
  return function WithAuthComponent(props) {
    const { user } = useContext(AuthContext)

    if (!user) {
      return <Redirect to="/login" />
    }

    return <WrappedComponent {...props} />
  }
}

// 使用
const Dashboard = withAuth(DashboardContent)
```

### 3.4 数据获取

```typescript
function withFetch(url) {
  return function (WrappedComponent) {
    return class extends Component {
      state = {
        data: null,
        loading: true,
        error: null
      }

      async componentDidMount() {
        try {
          const response = await fetch(url)
          const data = await response.json()
          this.setState({ data, loading: false })
        } catch (error) {
          this.setState({ error, loading: false })
        }
      }

      render() {
        return <WrappedComponent {...this.state} {...this.props} />
      }
    }
  }
}

// 使用
const UserList = ({ data, loading, error }) => {
  if (loading) return <div>加载中...</div>
  if (error) return <div>错误</div>
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}

const UserListWithData = withFetch('/api/users')(UserList)
```

---

## 四、HOC 最佳实践

### 4.1 不要修改原组件

```typescript
// ❌ 错误：修改原组件
function withEnhancement(WrappedComponent) {
  WrappedComponent.prototype.componentDidMount = function() {
    console.log('挂载')
  }
  return WrappedComponent
}

// ✅ 正确：使用组合
function withEnhancement(WrappedComponent) {
  return class extends Component {
    componentDidMount() {
      console.log('挂载')
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
```

### 4.2 传递不相关 props

```typescript
function withTheme(WrappedComponent) {
  return class extends Component {
    render() {
      const { theme, ...restProps } = this.props
      return (
        <WrappedComponent
          {...restProps}
          theme={theme}
        />
      )
    }
  }
}
```

### 4.3 显示名称

```typescript
function withTheme(WrappedComponent) {
  class WithTheme extends Component {
    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  // 设置显示名称，便于调试
  WithTheme.displayName = `WithTheme(${getDisplayName(WrappedComponent)})`

  return WithTheme
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
```

### 4.4 不要在 render 中使用 HOC

```typescript
// ❌ 错误：每次渲染都创建新组件，导致状态丢失
function App() {
  const EnhancedComponent = withTheme(MyComponent)
  return <EnhancedComponent />
}

// ✅ 正确：在组件外创建
const EnhancedComponent = withTheme(MyComponent)

function App() {
  return <EnhancedComponent />
}
```

### 4.5 复制静态方法

```typescript
// 静态方法不会被复制
function MyComponent() {
  return <div />
}
MyComponent.staticMethod = () => console.log('static')

const EnhancedComponent = HOC(MyComponent)
EnhancedComponent.staticMethod  // undefined

// 使用 hoist-non-react-statics 复制静态方法
import hoistNonReactStatics from 'hoist-non-react-statics'

function HOC(WrappedComponent) {
  class Enhancer extends Component {
    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  hoistNonReactStatics(Enhancer, WrappedComponent)
  return Enhancer
}
```

---

## 五、HOC 组合

### 5.1 多个 HOC 组合

```typescript
// 多个 HOC
const EnhancedComponent = withAuth(
  withTheme(
    withLoading(
      withRouter(MyComponent)
    )
  )
)

// 或使用 compose
import { compose } from 'redux'

const enhance = compose(
  withAuth,
  withTheme,
  withLoading,
  withRouter
)

const EnhancedComponent = enhance(MyComponent)
```

### 5.2 装饰器语法

```typescript
// TypeScript 装饰器（实验性）
@withAuth
@withTheme
@withLoading
class MyComponent extends Component {
  render() {
    return <div />
  }
}
```

---

## 六、HOC vs Hooks

### 6.1 对比

| 特性         | HOC            | Hooks          |
| ------------ | -------------- | -------------- |
| **嵌套**     | 多层嵌套       | 无嵌套         |
| **可读性**   | 较差           | 好             |
| **类型推导** | 复杂           | 简单           |
| **调试**     | 难以追踪 props | 清晰           |
| **复用性**   | 好             | 好             |
| **推荐**     | 旧项目         | ✅ 新项目推荐  |

### 6.2 HOC 转换为 Hooks

```typescript
// HOC 版本
function withWindowWidth(WrappedComponent) {
  return class extends Component {
    state = { width: window.innerWidth }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize)
    }

    handleResize = () => {
      this.setState({ width: window.innerWidth })
    }

    render() {
      return <WrappedComponent width={this.state.width} {...this.props} />
    }
  }
}

// Hooks 版本
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

// 使用
function MyComponent() {
  const width = useWindowWidth()
  return <div>宽度：{width}</div>
}
```

---

## 七、常见 HOC 示例

### 7.1 withRouter（React Router）

```typescript
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function withRouter(WrappedComponent) {
  return function WithRouter(props) {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()

    return (
      <WrappedComponent
        {...props}
        location={location}
        navigate={navigate}
        params={params}
      />
    )
  }
}
```

### 7.2 connect（Redux 简化版）

```typescript
import { useSelector, useDispatch } from 'react-redux'

function connect(mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    return function ConnectedComponent(props) {
      const state = useSelector(state => state)
      const dispatch = useDispatch()

      const stateProps = mapStateToProps ? mapStateToProps(state, props) : {}
      const dispatchProps = mapDispatchToProps
        ? mapDispatchToProps(dispatch, props)
        : { dispatch }

      return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />
    }
  }
}
```

### 7.3 withErrorBoundary

```typescript
class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('错误：', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <div>出错了：{this.state.error.message}</div>
    }
    return this.props.children
  }
}

function withErrorBoundary(WrappedComponent) {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}
```

---

## 八、总结

### ✅ 关键知识点

1. **HOC 定义**：接收组件返回新组件的函数
2. **属性代理**：通过 props 操作 WrappedComponent
3. **反向继承**：继承 WrappedComponent
4. **最佳实践**：不修改原组件、传递 props、设置 displayName
5. **不要在 render 中使用 HOC**
6. **HOC vs Hooks**：新项目推荐使用 Hooks

### 🔜 下一章

- 下一章：[Render Props](/web/react/advanced/04-render-props/)
- 上一章：[Refs 与 forwardRef](/web/react/advanced/02-refs/)
- 上一级：[React 进阶特性](/web/react/advanced/)
