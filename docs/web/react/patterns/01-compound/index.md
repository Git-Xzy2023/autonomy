---
title: 组合模式
---

# 组合模式

> 组合模式（Compound Components）让组件通过组合的方式协同工作，提供灵活的 API。

---

## 一、什么是组合模式？

### 1.1 概念

```
┌─────────────────────────────────────────┐
│              组合模式                   │
├─────────────────────────────────────────┤
│                                         │
│  多个组件协同工作，共享状态              │
│                                         │
│  <Select>                              │
│    <Select.Trigger>                    │
│    <Select.Menu>                       │
│      <Select.Item>选项1</Select.Item>  │
│      <Select.Item>选项2</Select.Item>  │
│    </Select.Menu>                      │
│  </Select>                              │
│                                         │
│  特点：                                  │
│  ├── 隐式状态共享                       │
│  ├── 灵活的组合方式                     │
│  └── 清晰的 API                         │
│                                         │
└─────────────────────────────────────────┘
```

### 1.2 适用场景

- ✅ 表单组件（Input + Label + Error）
- ✅ 选择器（Select + Option）
- ✅ 标签页（Tabs + Tab）
- ✅ 手风琴（Accordion + Item）
- ✅ 卡片（Card + Header + Body + Footer）

---

## 二、基本实现

### 2.1 使用 Context 共享状态

```typescript
import { createContext, useContext, useState } from 'react'

// 创建 Context
const TabsContext = createContext(null)

// Provider 组件
function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

// 子组件
function TabList({ children }) {
  return <div className="tab-list">{children}</div>
}

function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext)

  return (
    <button
      className={`tab ${activeIndex === index ? 'active' : ''}`}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  )
}

function TabPanel({ index, children }) {
  const { activeIndex } = useContext(TabsContext)

  if (activeIndex !== index) return null

  return <div className="tab-panel">{children}</div>
}

// 挂载子组件
Tabs.TabList = TabList
Tabs.Tab = Tab
Tabs.TabPanel = TabPanel

// 使用
function App() {
  return (
    <Tabs defaultIndex={0}>
      <Tabs.TabList>
        <Tabs.Tab index={0}>首页</Tabs.Tab>
        <Tabs.Tab index={1}>关于</Tabs.Tab>
        <Tabs.Tab index={2}>联系</Tabs.Tab>
      </Tabs.TabList>
      <Tabs.TabPanel index={0}>首页内容</Tabs.TabPanel>
      <Tabs.TabPanel index={1}>关于内容</Tabs.TabPanel>
      <Tabs.TabPanel index={2}>联系内容</Tabs.TabPanel>
    </Tabs>
  )
}
```

---

## 三、进阶示例

### 3.1 Accordion 组件

```typescript
import { createContext, useContext, useState, ReactNode } from 'react'

interface AccordionContextType {
  openIndex: number | null
  setOpenIndex: (index: number | null) => void
}

const AccordionContext = createContext<AccordionContextType | null>(null)

function Accordion({ children, defaultOpen = null }) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)

  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({ index, title, children }) {
  const { openIndex, setOpenIndex } = useContext(AccordionContext)
  const isOpen = openIndex === index

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button
        className="accordion-header"
        onClick={() => setOpenIndex(isOpen ? null : index)}
      >
        {title}
        <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="accordion-content">{children}</div>
      )}
    </div>
  )
}

Accordion.Item = AccordionItem

// 使用
function App() {
  return (
    <Accordion defaultOpen={0}>
      <Accordion.Item index={0} title="第一项">
        内容1
      </Accordion.Item>
      <Accordion.Item index={1} title="第二项">
        内容2
      </Accordion.Item>
      <Accordion.Item index={2} title="第三项">
        内容3
      </Accordion.Item>
    </Accordion>
  )
}
```

### 3.2 Form 组件

```typescript
const FormContext = createContext(null)

function Form({ initialValues, onSubmit, children }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const setFieldValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <FormContext.Provider value={{ values, errors, setFieldValue }}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  )
}

function Field({ name, label, type = 'text' }) {
  const { values, errors, setFieldValue } = useContext(FormContext)

  return (
    <div className="field">
      <label>{label}</label>
      <input
        type={type}
        value={values[name] || ''}
        onChange={e => setFieldValue(name, e.target.value)}
      />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </div>
  )
}

function SubmitButton({ children }) {
  return <button type="submit">{children}</button>
}

Form.Field = Field
Form.SubmitButton = SubmitButton

// 使用
function App() {
  return (
    <Form
      initialValues={{ name: '', email: '' }}
      onSubmit={values => console.log(values)}
    >
      <Form.Field name="name" label="姓名" />
      <Form.Field name="email" label="邮箱" type="email" />
      <Form.SubmitButton>提交</Form.SubmitButton>
    </Form>
  )
}
```

---

## 四、使用 React.Children

### 4.1 隐式传递 props

```typescript
function RadioGroup({ name, defaultValue, onChange, children }) {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (newValue) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  // 使用 React.Children 隐式传递 props
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        name,
        checked: value === child.props.value,
        onChange: () => handleChange(child.props.value)
      })
    }
    return child
  })

  return <div className="radio-group">{enhancedChildren}</div>
}

function Radio({ name, value, checked, onChange, children }) {
  return (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {children}
    </label>
  )
}

// 使用
function App() {
  return (
    <RadioGroup
      name="gender"
      defaultValue="male"
      onChange={value => console.log(value)}
    >
      <Radio value="male">男</Radio>
      <Radio value="female">女</Radio>
    </RadioGroup>
  )
}
```

---

## 五、组合模式优势

### 5.1 灵活性

```typescript
// 用户可以自由组合组件
<Tabs>
  <Tabs.TabList>
    <Tabs.Tab index={0}>首页</Tabs.Tab>
    <Tabs.Tab index={1}>关于</Tabs.Tab>
  </Tabs.TabList>
  <Tabs.TabPanel index={0}>首页内容</Tabs.TabPanel>
  <Tabs.TabPanel index={1}>关于内容</Tabs.TabPanel>
</Tabs>

// 也可以自定义布局
<Tabs>
  <div className="custom-layout">
    <Tabs.TabPanel index={0}>首页内容</Tabs.TabPanel>
    <Tabs.TabList>
      <Tabs.Tab index={0}>首页</Tabs.Tab>
    </Tabs.TabList>
  </div>
</Tabs>
```

### 5.2 关注点分离

```typescript
// 每个组件只关注自己的职责
Tabs          // 管理状态
Tabs.TabList  // 布局
Tabs.Tab      // 触发切换
Tabs.TabPanel // 显示内容
```

---

## 六、总结

### ✅ 关键知识点

1. **组合模式**：多个组件协同工作，共享状态
2. **Context 共享**：通过 Context 传递状态
3. **子组件挂载**：`Parent.Child = Child`
4. **React.Children**：隐式传递 props
5. **优势**：灵活、关注点分离、清晰 API

### 🔜 下一章

- 下一章：[自定义 Hook 模式](/web/react/patterns/02-custom-hooks/)
- 上一章：[React 性能优化](/web/react/performance/)
- 上一级：[React 设计模式](/web/react/patterns/)
