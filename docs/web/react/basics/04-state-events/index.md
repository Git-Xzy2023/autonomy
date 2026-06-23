---
title: State 与事件处理
---

# State 与事件处理

> State 是组件的内部数据，事件处理是用户交互的基础。本章介绍如何管理 State 和处理事件。

---

## 一、什么是 State？

State 是组件内部维护的数据，与 Props 不同，State 可以被组件修改。

```
┌─────────────────────────────────────────┐
│              组件数据来源                 │
├─────────────────────────────────────────┤
│                                         │
│  Props（外部数据）                       │
│  ├── 父组件传递                          │
│  ├── 只读，不可修改                      │
│  └── 改变会触发重渲染                    │
│                                         │
│  State（内部数据）                       │
│  ├── 组件自己维护                        │
│  ├── 可修改（通过 setState）             │
│  └── 修改会触发重渲染                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、useState Hook

`useState` 是最基础的 Hook，用于在函数组件中添加状态。

### 2.1 基本用法

```typescript
import { useState } from 'react'

function Counter() {
  // 声明 state：count 是当前值，setCount 是更新函数
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  )
}
```

### 2.2 多个 state

```typescript
function Form() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState(0)

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} />
    </form>
  )
}
```

### 2.3 使用对象作为 state

```typescript
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0
  })

  // ⚠️ 注意：必须展开旧对象，不能直接修改
  const updateField = (field, value) => {
    setFormData({
      ...formData,        // 展开旧值
      [field]: value      // 覆盖新值
    })
  }

  return (
    <form>
      <input
        value={formData.name}
        onChange={e => updateField('name', e.target.value)}
      />
      <input
        value={formData.email}
        onChange={e => updateField('email', e.target.value)}
      />
    </form>
  )
}
```

### 2.4 函数式更新

当新 state 依赖于旧 state 时，使用函数式更新：

```typescript
function Counter() {
  const [count, setCount] = useState(0)

  // ✅ 推荐：函数式更新（避免批处理问题）
  const increment = () => {
    setCount(prev => prev + 1)
  }

  const addFive = () => {
    // 连续调用，使用函数式更新确保正确累加
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
  }

  // ❌ 错误：连续调用会被批处理，只加 1
  const wrongAddFive = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={addFive}>+5</button>
    </div>
  )
}
```

### 2.5 惰性初始化

`useState` 的初始值可以是一个函数，用于 expensive 计算：

```typescript
function TodoList() {
  // ✅ 惰性初始化：函数只在首次渲染时执行
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })

  // ❌ 错误：每次渲染都会执行
  // const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('todos') || '[]'))

  return <ul>{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>
}
```

---

## 三、事件处理

### 3.1 事件绑定

React 事件使用驼峰命名，传递函数作为事件处理程序：

```typescript
function Button() {
  const handleClick = (event) => {
    console.log('点击事件', event)
  }

  return <button onClick={handleClick}>点击</button>
}
```

### 3.2 事件对象

React 中的事件对象是合成事件（SyntheticEvent）：

```typescript
function Form() {
  const handleSubmit = (event) => {
    event.preventDefault()  // 阻止默认行为
    console.log('表单提交')
  }

  const handleChange = (event) => {
    console.log('输入值：', event.target.value)
    console.log('输入框：', event.target)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button type="submit">提交</button>
    </form>
  )
}
```

### 3.3 传递参数

```typescript
function List() {
  const [items, setItems] = useState([
    { id: 1, text: '苹果' },
    { id: 2, text: '香蕉' },
    { id: 3, text: '橙子' }
  ])

  // 方式一：箭头函数（推荐）
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.text}
          <button onClick={() => deleteItem(item.id)}>删除</button>
        </li>
      ))}
    </ul>
  )
}
```

### 3.4 this 绑定（类组件）

类组件中需要手动绑定 `this`：

```typescript
class Button extends Component {
  constructor(props) {
    super(props)
    // 方式一：构造函数绑定
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    console.log(this.props)
  }

  render() {
    return (
      <div>
        {/* 方式一已绑定 */}
        <button onClick={this.handleClick}>按钮1</button>

        {/* 方式二：箭头函数 */}
        <button onClick={() => this.handleClick()}>按钮2</button>

        {/* 方式三：class fields 语法 */}
        <button onClick={this.handleClick2}>按钮3</button>
      </div>
    )
  }

  // 方式三：class fields
  handleClick2 = () => {
    console.log(this.props)
  }
}
```

> 💡 函数组件没有 this 绑定问题，推荐使用函数组件。

---

## 四、常见事件类型

### 4.1 表单事件

```typescript
function Form() {
  const [inputValue, setInputValue] = useState('')
  const [textarea, setTextarea] = useState('')
  const [select, setSelect] = useState('apple')
  const [checkbox, setCheckbox] = useState(false)
  const [radio, setRadio] = useState('male')

  return (
    <form onSubmit={e => e.preventDefault()}>
      {/* 文本框 */}
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />

      {/* 文本域 */}
      <textarea
        value={textarea}
        onChange={e => setTextarea(e.target.value)}
      />

      {/* 下拉框 */}
      <select value={select} onChange={e => setSelect(e.target.value)}>
        <option value="apple">苹果</option>
        <option value="banana">香蕉</option>
      </select>

      {/* 复选框 */}
      <input
        type="checkbox"
        checked={checkbox}
        onChange={e => setCheckbox(e.target.checked)}
      />

      {/* 单选框 */}
      <input
        type="radio"
        value="male"
        checked={radio === 'male'}
        onChange={e => setRadio(e.target.value)}
      />
      <input
        type="radio"
        value="female"
        checked={radio === 'female'}
        onChange={e => setRadio(e.target.value)}
      />
    </form>
  )
}
```

### 4.2 鼠标事件

```typescript
function MouseEvents() {
  return (
    <div
      onClick={() => console.log('点击')}
      onDoubleClick={() => console.log('双击')}
      onMouseEnter={() => console.log('鼠标进入')}
      onMouseLeave={() => console.log('鼠标离开')}
      onMouseMove={(e) => console.log('鼠标位置', e.clientX, e.clientY)}
      onMouseDown={() => console.log('鼠标按下')}
      onMouseUp={() => console.log('鼠标释放')}
    >
      鼠标事件区域
    </div>
  )
}
```

### 4.3 键盘事件

```typescript
function KeyboardEvents() {
  return (
    <input
      onKeyDown={(e) => {
        console.log('按键', e.key, e.code)
        if (e.key === 'Enter') {
          console.log('回车键')
        }
      }}
      onKeyUp={() => console.log('按键释放')}
      onKeyPress={() => console.log('按键按下（已废弃）')}
    />
  )
}
```

### 4.4 剪贴板事件

```typescript
function ClipboardEvents() {
  return (
    <input
      onCopy={() => console.log('复制')}
      onPaste={(e) => {
        console.log('粘贴', e.clipboardData.getData('text'))
      }}
      onCut={() => console.log('剪切')}
    />
  )
}
```

---

## 五、受控组件与非受控组件

### 5.1 受控组件（推荐）

表单数据由 React state 控制：

```typescript
function ControlledForm() {
  const [value, setValue] = useState('')

  return (
    <form onSubmit={e => {
      e.preventDefault()
      console.log('提交：', value)
    }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button type="submit">提交</button>
    </form>
  )
}
```

### 5.2 非受控组件

表单数据由 DOM 自己维护，使用 ref 获取：

```typescript
import { useRef } from 'react'

function UncontrolledForm() {
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('提交：', inputRef.current.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="默认值" />
      <button type="submit">提交</button>
    </form>
  )
}
```

### 5.3 对比

| 特性         | 受控组件       | 非受控组件     |
| ------------ | -------------- | -------------- |
| **数据源**   | React state    | DOM            |
| **获取值**   | state          | ref            |
| **验证**     | 实时           | 提交时         |
| **推荐**     | ✅ 推荐        | 简单场景       |

---

## 六、State 更新的注意事项

### 6.1 异步更新

State 更新是异步的，不能立即读取新值：

```typescript
function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
    console.log(count)  // ❌ 还是旧值！

    // 在回调中获取新值
    setCount(prev => {
      console.log(prev + 1)  // ✅ 新值
      return prev + 1
    })
  }

  return <button onClick={handleClick}>{count}</button>
}
```

### 6.2 批处理

React 会将多个 state 更新合并为一次渲染：

```typescript
function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  const handleClick = () => {
    // 这三次更新会被批处理，只触发一次重渲染
    setCount(1)
    setCount(2)
    setName('张三')
  }

  return <button onClick={handleClick}>点击</button>
}
```

### 6.3 不可变数据

永远不要直接修改 state，必须返回新对象：

```typescript
function App() {
  const [list, setList] = useState([1, 2, 3])
  const [user, setUser] = useState({ name: '张三', age: 25 })

  const addItem = () => {
    // ✅ 正确：返回新数组
    setList([...list, 4])
    // 或
    setList(prev => [...prev, 4])

    // ❌ 错误：直接修改
    // list.push(4)
    // setList(list)
  }

  const updateAge = () => {
    // ✅ 正确：返回新对象
    setUser({ ...user, age: 26 })

    // ❌ 错误：直接修改
    // user.age = 26
    // setUser(user)
  }

  return <div>...</div>
}
```

---

## 七、状态提升

当多个组件需要共享状态时，将状态提升到最近的共同父组件：

```typescript
function App() {
  const [temperature, setTemperature] = useState('')

  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={temperature}
        onTemperatureChange={setTemperature}
      />
      <TemperatureInput
        scale="f"
        temperature={temperature}
        onTemperatureChange={setTemperature}
      />
    </div>
  )
}

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <input
      value={temperature}
      onChange={e => onTemperatureChange(e.target.value)}
    />
  )
}
```

---

## 八、总结

### ✅ 关键知识点

1. **useState**：函数组件添加状态
2. **函数式更新**：`setCount(prev => prev + 1)`，避免批处理问题
3. **惰性初始化**：`useState(() => init())`，避免重复计算
4. **事件命名**：驼峰命名（onClick、onChange）
5. **合成事件**：React 封装的事件对象
6. **受控组件**：表单数据由 state 控制
7. **不可变数据**：永远返回新对象/数组
8. **状态提升**：共享状态放到共同父组件

### 🔜 下一章

- 下一章：[生命周期与副作用](/web/react/basics/05-lifecycle/)
- 上一章：[组件与 Props](/web/react/basics/03-components/)
- 上一级：[React 基础](/web/react/basics/)
