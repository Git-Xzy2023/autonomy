---
title: Web API
---

# Web API 详解

> Web API 是浏览器提供给 JavaScript 访问和操作浏览器功能及网页内容的接口集合。本章详细介绍 DOM、BOM、Fetch、WebSocket、事件系统等核心 API。

---

## 一、Web API 概述

### 1.1 什么是 Web API

Web API（Application Programming Interface）是浏览器提供的一组标准接口，让 JavaScript 能够：

- ✅ 操作网页内容（DOM）
- ✅ 控制浏览器窗口和框架（BOM）
- ✅ 发送网络请求
- ✅ 处理用户交互
- ✅ 访问设备硬件
- ✅ 存储数据
- ✅ 处理文件和媒体

### 1.2 Web API 分类

| 类别 | 主要内容 |
|------|---------|
| **DOM API** | 文档对象模型，操作 HTML/XML 文档 |
| **BOM API** | 浏览器对象模型，操作浏览器窗口 |
| **网络 API** | Fetch、XMLHttpRequest、WebSocket |
| **存储 API** | Cookie、Web Storage、IndexedDB |
| **事件 API** | 事件处理、事件委托 |
| **图形 API** | Canvas、WebGL、SVG |
| **媒体 API** | Audio、Video、MediaRecorder |
| **其他 API** | 地理定位、通知、拖放、剪贴板等 |

---

## 二、DOM API（文档对象模型）

### 2.1 DOM 基础

**DOM（Document Object Model）** 是 HTML 和 XML 文档的编程接口，将文档解析为一个由节点和对象组成的树形结构。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>示例</title>
  </head>
  <body>
    <div id="container">
      <h1 class="title">Hello</h1>
      <p>这是一段文字</p>
    </div>
  </body>
</html>
```

对应的 DOM 树：

```
Document
└─ html
   ├─ head
   │  └─ title
   │     └─ "示例"
   └─ body
      └─ div#container
         ├─ h1.title
         │  └─ "Hello"
         └─ p
            └─ "这是一段文字"
```

### 2.2 DOM 节点类型

| 节点类型 | 常量 | 值 | 说明 |
|---------|------|----|------|
| 元素节点 | `Node.ELEMENT_NODE` | 1 | HTML 元素，如 `<div>`、`<p>` |
| 属性节点 | `Node.ATTRIBUTE_NODE` | 2 | 元素的属性（已过时，使用 `getAttribute`） |
| 文本节点 | `Node.TEXT_NODE` | 3 | 元素内的文本内容 |
| 注释节点 | `Node.COMMENT_NODE` | 8 | HTML 注释 `<!-- -->` |
| 文档节点 | `Node.DOCUMENT_NODE` | 9 | 整个文档 `document` |
| 文档类型节点 | `Node.DOCUMENT_TYPE_NODE` | 10 | `<!DOCTYPE html>` |

**节点属性**：

```javascript
const node = document.getElementById('container');

// 基础属性
node.nodeName;        // "DIV"（大写标签名）
node.nodeType;        // 1（元素节点）
node.nodeValue;       // null（元素节点没有值，文本节点有内容）

// 父子关系
node.parentNode;      // 父节点
node.parentElement;   // 父元素（排除非元素节点）
node.childNodes;      // 所有子节点（包括文本节点）
node.children;        // 所有子元素（只包含元素）
node.firstChild;      // 第一个子节点
node.lastChild;       // 最后一个子节点
node.firstElementChild;  // 第一个子元素
node.lastElementChild;   // 最后一个子元素

// 兄弟关系
node.previousSibling;    // 前一个兄弟节点
node.nextSibling;        // 后一个兄弟节点
node.previousElementSibling;  // 前一个兄弟元素
node.nextElementSibling;      // 后一个兄弟元素
```

### 2.3 DOM 查询 API

#### 方法一：通过 ID 查询

```javascript
// 返回单个元素或 null
const element = document.getElementById('container');
```

#### 方法二：通过 CSS 选择器查询（推荐）

```javascript
// 查询第一个匹配的元素
const element = document.querySelector('.title');
const element2 = document.querySelector('#container p');
const element3 = document.querySelector('div > h1');

// 查询所有匹配的元素（返回 NodeList）
const elements = document.querySelectorAll('p');
const elements2 = document.querySelectorAll('.item');

// 遍历 NodeList
elements.forEach(el => console.log(el.textContent));

// NodeList 转数组
const array = Array.from(elements);
const array2 = [...elements];
```

#### 方法三：通过标签名查询

```javascript
// 返回 HTMLCollection（实时集合）
const paragraphs = document.getElementsByTagName('p');
const divs = document.getElementsByTagName('div');

// 注意：HTMLCollection 是实时的，DOM 变化会自动更新
// 推荐转数组后使用
const paragraphsArray = Array.from(paragraphs);
```

#### 方法四：通过类名查询

```javascript
// 返回 HTMLCollection
const items = document.getElementsByClassName('item');
```

#### 方法五：通过名称属性查询

```javascript
// 用于表单元素
const inputs = document.getElementsByName('email');
```

### 2.4 DOM 内容操作

#### 读取和设置文本内容

```javascript
const element = document.querySelector('.title');

// textContent：获取/设置纯文本（推荐）
element.textContent;              // 读取文本
element.textContent = '新标题';   // 设置文本

// innerText：与 textContent 类似，但受 CSS 影响（不推荐）
element.innerText;
```

#### 读取和设置 HTML 内容

```javascript
const element = document.querySelector('.content');

// innerHTML：获取/设置 HTML 内容（⚠️ 有 XSS 风险）
element.innerHTML;                      // 读取 HTML
element.innerHTML = '<p>新内容</p>';    // 设置 HTML

// outerHTML：包含元素本身的 HTML
element.outerHTML;  // <div class="content">内容</div>
```

> ⚠️ **警告**：使用 `innerHTML` 设置用户提供的内容会导致 XSS 安全漏洞。请优先使用 `textContent` 或确保内容经过安全处理。

### 2.5 DOM 属性操作

#### 标准属性（直接访问）

```javascript
const link = document.querySelector('a');
const image = document.querySelector('img');
const input = document.querySelector('input');

// 直接访问常用属性
link.href;           // 链接地址
link.target;         // 目标窗口
image.src;           // 图片地址
image.alt;           // 替代文本
input.value;         // 输入框的值
input.checked;       // 复选框/单选框状态
input.disabled;      // 是否禁用

// 设置属性
link.href = 'https://example.com';
image.src = '/new-image.jpg';
input.value = '新的值';
```

#### 自定义属性（getAttribute/setAttribute）

```javascript
const element = document.querySelector('[data-id]');

// 读取属性
element.getAttribute('data-id');     // 自定义属性
element.getAttribute('href');        // 也可以读标准属性
element.getAttribute('class');       // 注意是 class 不是 className

// 设置属性
element.setAttribute('data-status', 'active');
element.setAttribute('title', '提示文字');

// 检查属性是否存在
element.hasAttribute('data-id');     // true/false

// 删除属性
element.removeAttribute('data-status');

// 获取所有属性
const attributes = element.attributes;
for (let i = 0; i < attributes.length; i++) {
  console.log(attributes[i].name, attributes[i].value);
}
```

#### data-* 属性（数据集）

```javascript
const element = document.querySelector('[data-id]');

// 使用 dataset 属性（自动转换为驼峰命名）
// <div data-id="123" data-user-name="张三" data-active="true"></div>

element.dataset.id;          // "123"
element.dataset.userName;    // "张三"
element.dataset.active;      // "true"

// 设置 data-* 属性
element.dataset.status = 'inactive';  // data-status="inactive"
element.dataset.itemCount = '10';     // data-item-count="10"

// 删除
delete element.dataset.id;
```

#### class 属性操作

```javascript
const element = document.querySelector('.box');

// className：完整的 class 字符串
element.className;  // "box active large"
element.className = 'box small';  // 替换所有 class

// classList：更灵活的操作方式（推荐）
element.classList.contains('active');   // 检查是否包含
element.classList.add('new-class');     // 添加
element.classList.remove('old-class');  // 删除
element.classList.toggle('active');     // 切换（有则删，无则加）
element.classList.toggle('active', true);   // 强制添加
element.classList.toggle('active', false);  // 强制删除
element.classList.replace('old', 'new');    // 替换

// 支持多个参数
element.classList.add('a', 'b', 'c');
element.classList.remove('a', 'b');
```

#### style 属性操作

```javascript
const element = document.querySelector('.box');

// 内联样式（驼峰命名）
element.style.color = 'red';
element.style.fontSize = '16px';
element.style.backgroundColor = '#fff';
element.style.marginTop = '10px';

// 读取内联样式（只能获取内联，不能获取 CSS 文件中的样式）
element.style.color;  // "red"

// 批量设置样式
element.style.cssText = 'color: red; font-size: 16px;';

// 获取计算后的样式（包含 CSS 文件中的样式）
const computedStyle = window.getComputedStyle(element);
computedStyle.color;           // 实际颜色
computedStyle.fontSize;        // 实际字号
computedStyle.marginTop;       // 实际边距
computedStyle.width;           // 实际宽度
```

### 2.6 DOM 结构操作

#### 创建元素

```javascript
// 创建新元素
const div = document.createElement('div');
const paragraph = document.createElement('p');
const link = document.createElement('a');

// 创建文本节点
const textNode = document.createTextNode('这是文本');

// 创建文档片段（批量操作，减少重排）
const fragment = document.createDocumentFragment();
```

#### 添加元素

```javascript
const parent = document.querySelector('.container');
const child = document.createElement('div');

// 1. appendChild：在末尾添加
parent.appendChild(child);

// 2. append：在末尾添加（支持多个参数，支持字符串）
parent.append(child, '文本', anotherChild);

// 3. prepend：在开头添加
parent.prepend(child);

// 4. insertBefore：在指定节点前插入
const referenceNode = parent.querySelector('.item');
parent.insertBefore(child, referenceNode);

// 5. insertAdjacentElement：在指定位置插入
// 位置：'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'
referenceNode.insertAdjacentElement('afterend', child);

// 6. insertAdjacentHTML：插入 HTML 字符串
referenceNode.insertAdjacentHTML('beforeend', '<span>新内容</span>');
```

#### 删除元素

```javascript
const element = document.querySelector('.to-remove');

// 1. remove：直接删除元素（现代方法）
element.remove();

// 2. removeChild：通过父元素删除
element.parentNode.removeChild(element);
```

#### 替换元素

```javascript
const oldElement = document.querySelector('.old');
const newElement = document.createElement('div');

// replaceChild：替换子元素
oldElement.parentNode.replaceChild(newElement, oldElement);

// replaceWith：直接替换（现代方法）
oldElement.replaceWith(newElement);
```

#### 克隆元素

```javascript
const element = document.querySelector('.item');

// 浅克隆：只复制元素本身，不包含子元素
const shallowClone = element.cloneNode(false);

// 深克隆：包含所有子元素和属性
const deepClone = element.cloneNode(true);
```

### 2.7 遍历 DOM

#### 使用节点属性遍历

```javascript
const element = document.querySelector('#container');

// 遍历子元素
for (let i = 0; i < element.children.length; i++) {
  const child = element.children[i];
  console.log(child);
}

// 遍历所有子节点（包括文本节点）
element.childNodes.forEach(node => {
  console.log(node.nodeName, node.nodeValue);
});

// 遍历兄弟元素
let sibling = element.nextElementSibling;
while (sibling) {
  console.log(sibling);
  sibling = sibling.nextElementSibling;
}
```

#### 使用 TreeWalker（高级遍历）

```javascript
// 创建遍历器，只遍历元素节点
const walker = document.createTreeWalker(
  document.body,           // 根节点
  NodeFilter.SHOW_ELEMENT, // 只显示元素节点
  {
    acceptNode(node) {
      // 自定义过滤条件
      if (node.classList.contains('skip')) {
        return NodeFilter.FILTER_REJECT;  // 跳过此节点及其子节点
      }
      return NodeFilter.FILTER_ACCEPT;    // 接受此节点
    }
  }
);

// 遍历
let currentNode = walker.currentNode;
while (currentNode = walker.nextNode()) {
  console.log(currentNode);
}

// 其他遍历方法
walker.parentNode();
walker.firstChild();
walker.lastChild();
walker.previousSibling();
walker.nextSibling();
```

### 2.8 示例：动态创建列表

```javascript
// 数据
const fruits = ['苹果', '香蕉', '橙子', '葡萄'];

// 创建容器
const ul = document.createElement('ul');
ul.className = 'fruit-list';

// 使用 DocumentFragment 批量添加
const fragment = document.createDocumentFragment();

fruits.forEach((fruit, index) => {
  const li = document.createElement('li');
  li.className = 'fruit-item';
  li.textContent = fruit;
  li.dataset.index = String(index);
  fragment.appendChild(li);
});

ul.appendChild(fragment);

// 添加到页面
document.body.appendChild(ul);

// HTML 输出：
// <ul class="fruit-list">
//   <li class="fruit-item" data-index="0">苹果</li>
//   <li class="fruit-item" data-index="1">香蕉</li>
//   ...
// </ul>
```

---

## 三、事件 API

### 3.1 事件基础

**事件**是用户操作或浏览器行为触发的通知，JavaScript 可以监听并响应这些事件。

#### 添加事件监听器

```javascript
const button = document.querySelector('button');

// 方法一：addEventListener（推荐）
button.addEventListener('click', (event) => {
  console.log('按钮被点击', event);
});

// 方法二：on 属性（简单但不灵活）
button.onclick = (event) => {
  console.log('按钮被点击');
};

// 方法三：内联属性（不推荐，混合 HTML 和 JS）
// <button onclick="handleClick()">点击</button>
```

#### 移除事件监听器

```javascript
const handler = (event) => console.log('点击');

// 添加
button.addEventListener('click', handler);

// 移除（必须使用同一个函数引用）
button.removeEventListener('click', handler);

// 只执行一次
button.addEventListener('click', handler, { once: true });
```

#### 事件对象（Event）

```javascript
button.addEventListener('click', (event) => {
  // 事件类型
  event.type;              // "click"
  
  // 事件目标
  event.target;            // 实际触发事件的元素
  event.currentTarget;     // 当前监听器绑定的元素
  
  // 事件冒泡/捕获阶段
  event.eventPhase;        // 1:捕获 2:目标 3:冒泡
  
  // 阻止默认行为
  event.preventDefault();   // 如阻止链接跳转、表单提交
  
  // 阻止事件传播
  event.stopPropagation();  // 阻止冒泡和捕获
  event.stopImmediatePropagation();  // 阻止后续所有监听器
  
  // 鼠标事件属性
  event.clientX;           // 鼠标相对于视口的 X 坐标
  event.clientY;           // 鼠标相对于视口的 Y 坐标
  event.pageX;             // 相对于文档的 X 坐标
  event.pageY;             // 相对于文档的 Y 坐标
  event.offsetX;           // 相对于元素的 X 坐标
  event.offsetY;           // 相对于元素的 Y 坐标
  event.button;            // 鼠标按钮（0:左键 1:中键 2:右键）
  
  // 键盘事件属性
  event.key;               // 按键值（如 "a"、"Enter"）
  event.code;              // 按键代码（如 "KeyA"、"Enter"）
  event.keyCode;           // 已废弃，但仍广泛使用
  event.ctrlKey;           // Ctrl 是否按下
  event.shiftKey;          // Shift 是否按下
  event.altKey;            // Alt 是否按下
  event.metaKey;           // Meta（Cmd/Win）是否按下
  
  // 时间戳
  event.timeStamp;         // 事件发生的时间戳
});
```

### 3.2 事件流（捕获-目标-冒泡）

```
捕获阶段：从 window 向下传递到目标元素
目标阶段：到达目标元素
冒泡阶段：从目标元素向上传递到 window

    window
       ↓ (捕获)
    document
       ↓
    <html>
       ↓
    <body>
       ↓
    <div>
       ↓
    <button>  ← 目标阶段（事件实际发生）
       ↑
    <div>
       ↑ (冒泡)
    <body>
       ↑
    <html>
       ↑
    document
       ↑
    window
```

**控制事件流**：

```javascript
const button = document.querySelector('button');
const container = document.querySelector('.container');

// 默认：冒泡阶段（false）
button.addEventListener('click', (event) => {
  console.log('按钮 - 冒泡');
});

// 捕获阶段（true 或 useCapture: true）
button.addEventListener('click', (event) => {
  console.log('按钮 - 捕获');
}, true);

// 使用对象参数
container.addEventListener('click', (event) => {
  console.log('容器 - 捕获');
}, { capture: true });
```

### 3.3 事件委托（Event Delegation）⭐

事件委托利用事件冒泡机制，给父元素添加一个监听器来处理多个子元素的事件。

**优点**：

- ✅ 减少监听器数量，提高性能
- ✅ 自动支持动态添加的元素
- ✅ 代码更简洁

**示例**：

```html
<ul id="list">
  <li>项目 1</li>
  <li>项目 2</li>
  <li>项目 3</li>
  <!-- 后续动态添加的项目也能被监听 -->
</ul>
```

```javascript
// ❌ 不好：给每个 li 添加监听器
const items = document.querySelectorAll('#list li');
items.forEach(item => {
  item.addEventListener('click', () => {
    console.log(item.textContent);
  });
});

// ✅ 好：给父元素添加监听器（事件委托）
const list = document.getElementById('list');
list.addEventListener('click', (event) => {
  // 检查点击的是否是 li 元素
  if (event.target.tagName === 'LI') {
    console.log(event.target.textContent);
  }
  
  // 更灵活的方式：closest()
  const li = event.target.closest('li');
  if (li && list.contains(li)) {
    console.log(li.textContent);
  }
});
```

### 3.4 常用事件类型

#### 鼠标事件

```javascript
element.addEventListener('click', () => {});          // 单击
element.addEventListener('dblclick', () => {});       // 双击
element.addEventListener('mousedown', () => {});      // 按下
element.addEventListener('mouseup', () => {});        // 松开
element.addEventListener('mousemove', () => {});      // 移动
element.addEventListener('mouseenter', () => {});     // 进入（不冒泡）
element.addEventListener('mouseleave', () => {});     // 离开（不冒泡）
element.addEventListener('mouseover', () => {});      // 进入（冒泡）
element.addEventListener('mouseout', () => {});       // 离开（冒泡）
element.addEventListener('contextmenu', () => {});    // 右键菜单
element.addEventListener('wheel', () => {});          // 滚轮
```

#### 键盘事件

```javascript
document.addEventListener('keydown', (event) => {
  console.log('按下', event.key, event.code);
  
  // 常用按键判断
  if (event.key === 'Enter') {
    console.log('回车键');
  }
  if (event.code === 'Escape') {
    console.log('ESC 键');
  }
  if (event.ctrlKey && event.key === 'c') {
    console.log('Ctrl+C');
  }
});

document.addEventListener('keyup', () => {});    // 松开
document.addEventListener('keypress', () => {}); // 按键（已废弃）
```

#### 表单事件

```javascript
const form = document.querySelector('form');
const input = document.querySelector('input');

form.addEventListener('submit', (event) => {
  event.preventDefault();  // 阻止表单默认提交
  console.log('表单提交');
});

input.addEventListener('focus', () => {});     // 获得焦点
input.addEventListener('blur', () => {});      // 失去焦点
input.addEventListener('change', () => {});    // 值改变并失焦
input.addEventListener('input', () => {});     // 值改变（实时）
input.addEventListener('select', () => {});    // 文本被选中
input.addEventListener('reset', () => {});     // 重置
```

#### 窗口/文档事件

```javascript
window.addEventListener('load', () => {});              // 所有资源加载完成
document.addEventListener('DOMContentLoaded', () => {}); // DOM 解析完成
window.addEventListener('resize', () => {});            // 窗口大小改变
window.addEventListener('scroll', () => {});            // 滚动
window.addEventListener('beforeunload', () => {});       // 即将离开
document.addEventListener('visibilitychange', () => {    // 标签页可见性
  console.log(document.visibilityState);  // 'visible' | 'hidden'
});
```

#### 触摸事件（移动端）

```javascript
element.addEventListener('touchstart', (event) => {
  console.log('触摸开始', event.touches.length);
});
element.addEventListener('touchmove', () => {});     // 触摸移动
element.addEventListener('touchend', () => {});      // 触摸结束
element.addEventListener('touchcancel', () => {});   // 触摸取消
```

#### 剪贴板事件

```javascript
document.addEventListener('copy', (event) => {
  console.log('复制内容');
  // event.preventDefault();  // 可以阻止复制
});
document.addEventListener('cut', () => {});      // 剪切
document.addEventListener('paste', (event) => {
  // 获取粘贴内容
  const text = event.clipboardData.getData('text');
  console.log('粘贴:', text);
});
```

#### 拖放事件

```javascript
const draggable = document.querySelector('[draggable="true"]');
const dropZone = document.querySelector('.drop-zone');

// 可拖动元素事件
draggable.addEventListener('dragstart', (event) => {
  event.dataTransfer.setData('text/plain', '数据');
  event.dataTransfer.effectAllowed = 'move';
});
draggable.addEventListener('dragend', () => {});

// 放置区域事件
dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();  // 必须阻止默认行为才能放置
  event.dataTransfer.dropEffect = 'move';
});
dropZone.addEventListener('dragenter', () => {});
dropZone.addEventListener('dragleave', () => {});
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  console.log('放置:', data);
});
```

---

## 四、BOM API（浏览器对象模型）

### 4.1 window 对象

`window` 是全局对象，代表浏览器窗口。

```javascript
// 窗口尺寸
window.innerWidth;      // 视口宽度（像素）
window.innerHeight;     // 视口高度
window.outerWidth;      // 浏览器窗口宽度
window.outerHeight;     // 浏览器窗口高度

// 滚动位置
window.scrollX;         // 水平滚动距离
window.scrollY;         // 垂直滚动距离
window.pageXOffset;     // 同 scrollX
window.pageYOffset;     // 同 scrollY

// 滚动方法
window.scrollTo(0, 100);        // 滚动到指定位置
window.scrollTo({ top: 100, left: 0, behavior: 'smooth' });
window.scrollBy(0, 50);         // 相对当前位置滚动
element.scrollIntoView();       // 滚动到元素可见
element.scrollIntoView({ behavior: 'smooth' });

// 打开/关闭窗口
const newWindow = window.open('https://example.com', '_blank');
newWindow.close();

// 对话框（不推荐，会阻塞）
window.alert('提示消息');
const confirmed = window.confirm('确定吗？');  // true/false
const input = window.prompt('请输入', '默认值');

// 焦点
window.focus();
window.blur();
```

### 4.2 document 对象

`document` 代表当前文档。

```javascript
// 文档信息
document.title;              // 页面标题
document.URL;                // 页面 URL
document.domain;             // 域名
document.referrer;           // 来源页面 URL
document.lastModified;       // 最后修改时间
document.readyState;         // 加载状态 ('loading' | 'interactive' | 'complete')

// 快捷访问
document.documentElement;    // <html> 元素
document.head;               // <head> 元素
document.body;               // <body> 元素
document.forms;              // 所有表单
document.images;             // 所有图片
document.links;              // 所有链接
document.scripts;            // 所有脚本

// Cookie
document.cookie;
document.cookie = 'name=value';

// 创建元素
document.createElement('div');
document.createTextNode('文本');
document.createDocumentFragment();
```

### 4.3 location 对象

`location` 代表当前 URL 信息。

```javascript
// URL: https://example.com:8080/path/page.html?q=1#section

location.href;              // 完整 URL: https://example.com:8080/path/page.html?q=1#section
location.protocol;          // 协议: https:
location.hostname;          // 主机名: example.com
location.host;              // 主机+端口: example.com:8080
location.port;              // 端口: 8080
location.pathname;          // 路径: /path/page.html
location.search;            // 查询参数: ?q=1
location.hash;              // 锚点: #section
location.origin;            // 来源: https://example.com:8080

// 导航方法
location.href = 'https://example.com';  // 跳转
location.assign('https://example.com'); // 跳转（有历史记录）
location.replace('https://example.com'); // 跳转（无历史记录）
location.reload();                       // 刷新
location.reload(true);                   // 强制刷新（绕过缓存）

// 解析查询参数
const params = new URLSearchParams(location.search);
params.get('q');           // 获取参数值
params.has('q');           // 是否存在
params.set('q', '2');      // 设置参数
params.delete('q');        // 删除参数
params.toString();         // 转字符串
```

### 4.4 navigator 对象

`navigator` 提供浏览器和系统信息。

```javascript
// 浏览器信息
navigator.userAgent;        // 用户代理字符串（识别浏览器）
navigator.appName;          // 浏览器名称（不可靠）
navigator.appVersion;       // 浏览器版本（不可靠）
navigator.platform;         // 操作系统平台（如 "Win32"、"MacIntel"）
navigator.language;         // 当前语言（如 "zh-CN"）
navigator.languages;        // 语言偏好数组

// 浏览器特性
navigator.cookieEnabled;    // 是否启用 Cookie
navigator.onLine;           // 是否在线
navigator.javaEnabled();    // 是否启用 Java（基本为 false）

// 硬件信息
navigator.hardwareConcurrency;  // CPU 核心数（估算）
navigator.deviceMemory;         // 设备内存（GB，仅 HTTPS）
navigator.maxTouchPoints;       // 最大触点数

// 地理定位（需要用户授权）
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log('纬度:', position.coords.latitude);
    console.log('经度:', position.coords.longitude);
    console.log('精度:', position.coords.accuracy);
  },
  (error) => {
    console.error('定位失败:', error.message);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
);

// 剪贴板 API（需要 HTTPS）
navigator.clipboard.writeText('要复制的文本')
  .then(() => console.log('已复制'));

navigator.clipboard.readText()
  .then(text => console.log('剪贴板内容:', text));

// 检查浏览器特性
navigator.serviceWorker;     // Service Worker API
navigator.mediaDevices;      // 媒体设备（摄像头、麦克风）
navigator.bluetooth;         // 蓝牙 API（需 HTTPS）
navigator.usb;               // USB API（需 HTTPS）
```

### 4.5 history 对象

`history` 提供浏览器历史记录操作。

```javascript
// 历史记录长度
history.length;

// 导航
history.back();              // 后退（等同于点击后退按钮）
history.forward();           // 前进
history.go(-1);              // 相对导航（-1 后退，1 前进，0 刷新）
history.go(2);               // 前进 2 步

// HTML5 History API（单页应用 SPA）
history.pushState({ page: 1 }, '标题', '/page1');
history.replaceState({ page: 2 }, '标题', '/page2');

// 状态对象
history.state;               // 当前状态对象

// 监听历史变化
window.addEventListener('popstate', (event) => {
  console.log('历史变化:', event.state);
});
```

### 4.6 screen 对象

`screen` 提供屏幕信息。

```javascript
screen.width;                // 屏幕宽度（像素）
screen.height;               // 屏幕高度
screen.availWidth;           // 可用宽度（排除任务栏）
screen.availHeight;          // 可用高度
screen.colorDepth;           // 颜色深度（如 24）
screen.pixelDepth;           // 像素深度
screen.orientation;          // 屏幕方向（移动端）
screen.orientation.angle;    // 旋转角度
screen.orientation.type;     // 'portrait-primary' 等
```

---

## 五、网络 API

### 5.1 Fetch API（现代方式）⭐

Fetch 是现代的网络请求 API，基于 Promise。

#### 基本 GET 请求

```javascript
// 基本 GET 请求
fetch('https://api.example.com/data')
  .then(response => {
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();  // 解析 JSON
  })
  .then(data => {
    console.log('数据:', data);
  })
  .catch(error => {
    console.error('请求失败:', error);
  });

// async/await 写法（推荐）
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('数据:', data);
    return data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}
```

#### 响应对象（Response）

```javascript
const response = await fetch(url);

// 基本属性
response.ok;            // 状态码在 200-299 范围
response.status;        // HTTP 状态码（如 200、404）
response.statusText;    // 状态文本（如 "OK"、"Not Found"）
response.url;           // 最终 URL（可能有重定向）
response.type;          // 响应类型（'basic'、'cors'、'opaque' 等）
response.redirected;    // 是否有重定向

// 响应头
response.headers.get('Content-Type');
response.headers.get('Cache-Control');
response.headers.has('Authorization');

// 解析响应体（只能读取一次）
const json = await response.json();        // JSON
const text = await response.text();          // 纯文本
const blob = await response.blob();          // 二进制大对象（Blob）
const formData = await response.formData();  // FormData
const arrayBuffer = await response.arrayBuffer();  // ArrayBuffer

// 检查响应类型
const contentType = response.headers.get('Content-Type');
if (contentType && contentType.includes('application/json')) {
  const data = await response.json();
}
```

#### POST 请求

```javascript
// POST JSON 数据
const data = { name: '张三', age: 25 };

const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

const result = await response.json();

// POST FormData
const formData = new FormData();
formData.append('name', '张三');
formData.append('age', '25');
formData.append('avatar', fileInput.files[0]);  // 文件上传

const response2 = await fetch('https://api.example.com/upload', {
  method: 'POST',
  body: formData  // 不需要手动设置 Content-Type，浏览器会自动设置
});

// POST URL 编码
const params = new URLSearchParams();
params.append('name', '张三');
params.append('age', '25');

const response3 = await fetch('https://api.example.com/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: params
});
```

#### 完整请求选项

```javascript
const response = await fetch(url, {
  method: 'GET',           // GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/json'
  },
  body: JSON.stringify(data),  // 请求体（仅 POST/PUT/PATCH）
  
  // 模式
  mode: 'cors',            // 'cors'（跨域）| 'no-cors' | 'same-origin'（同源）
  
  // 凭据（Cookie）
  credentials: 'include',  // 'include'（携带）| 'same-origin'（同源携带）| 'omit'（不携带）
  
  // 缓存策略
  cache: 'default',        // 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached'
  
  // 重定向
  redirect: 'follow',      // 'follow'（跟随）| 'error' | 'manual'
  
  // 引用
  referrer: 'client',      // 'no-referrer' | 'client' | URL
  
  // 中止信号（可用于取消请求）
  signal: abortSignal
});
```

#### 取消请求（AbortController）

```javascript
// 创建控制器
const controller = new AbortController();
const signal = controller.signal;

// 发送请求
const fetchPromise = fetch(url, { signal });

// 超时取消（5 秒）
setTimeout(() => {
  controller.abort();
  console.log('请求已超时取消');
}, 5000);

// 处理请求
try {
  const response = await fetchPromise;
  const data = await response.json();
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('请求被取消');
  } else {
    console.error('请求失败:', error);
  }
}
```

#### 流式读取（Stream API）

```javascript
// 流式读取大文件
const response = await fetch('large-file.bin');
const reader = response.body.getReader();

let received = 0;
const contentLength = +response.headers.get('Content-Length');

while (true) {
  const { done, value } = await reader.read();
  
  if (done) {
    console.log('读取完成');
    break;
  }
  
  received += value.length;
  const progress = (received / contentLength * 100).toFixed(2);
  console.log(`进度: ${progress}%`);
}
```

#### 封装实用的请求函数

```javascript
// 基础请求函数
async function request(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 10000
  } = options;
  
  // 设置超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // 准备请求
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    signal: controller.signal,
    credentials: 'include'
  };
  
  if (body && method !== 'GET') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const contentType = response.headers.get('Content-Type');
    return contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('请求超时');
    }
    throw error;
  }
}

// 使用示例
const data = await request('/api/users', {
  method: 'POST',
  body: { name: '张三' }
});
```

### 5.2 XMLHttpRequest（传统方式）

虽然 Fetch 是现代方式，但 XHR 仍在维护的项目中广泛使用。

```javascript
// GET 请求
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data');

xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  } else {
    console.error('请求失败:', xhr.status);
  }
};

xhr.onerror = function() {
  console.error('网络错误');
};

xhr.send();

// POST 请求
const xhr2 = new XMLHttpRequest();
xhr2.open('POST', 'https://api.example.com/users');
xhr2.setRequestHeader('Content-Type', 'application/json');

xhr2.onreadystatechange = function() {
  if (xhr2.readyState === 4) {  // 请求完成
    if (xhr2.status >= 200 && xhr2.status < 300) {
      console.log(JSON.parse(xhr2.responseText));
    }
  }
};

xhr2.send(JSON.stringify({ name: '张三' }));

// 上传进度
xhr2.upload.onprogress = function(event) {
  if (event.lengthComputable) {
    const percent = (event.loaded / event.total * 100).toFixed(2);
    console.log(`上传进度: ${percent}%`);
  }
};

// 取消请求
xhr2.abort();
```

### 5.3 WebSocket（实时通信）⭐

WebSocket 提供持久的双向通信通道，适合实时应用（聊天、游戏、实时数据）。

```javascript
// 创建连接
const ws = new WebSocket('wss://api.example.com/socket');

// 连接成功
ws.onopen = function(event) {
  console.log('WebSocket 连接已建立');
  
  // 发送消息
  ws.send('Hello Server!');
  
  // 发送 JSON
  ws.send(JSON.stringify({ type: 'chat', message: '你好' }));
};

// 接收消息
ws.onmessage = function(event) {
  console.log('收到消息:', event.data);
  
  // 解析 JSON
  try {
    const data = JSON.parse(event.data);
    console.log('解析后:', data);
  } catch (e) {
    console.log('文本消息:', event.data);
  }
};

// 连接错误
ws.onerror = function(error) {
  console.error('WebSocket 错误:', error);
};

// 连接关闭
ws.onclose = function(event) {
  console.log('WebSocket 连接关闭');
  console.log('代码:', event.code);
  console.log('原因:', event.reason);
  console.log('是否正常关闭:', event.wasClean);
  
  // 自动重连
  setTimeout(() => {
    console.log('尝试重连...');
    ws = new WebSocket('wss://api.example.com/socket');
  }, 3000);
};

// 发送二进制数据
const arrayBuffer = new ArrayBuffer(8);
ws.send(arrayBuffer);

// 检查连接状态
ws.readyState;  // 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED

// 主动关闭
ws.close(1000, '正常关闭');

// 使用事件监听器方式
ws.addEventListener('open', (event) => {});
ws.addEventListener('message', (event) => {});
ws.addEventListener('error', (event) => {});
ws.addEventListener('close', (event) => {});
```

### 5.4 JSONP（跨域的古老方式，了解即可）

```javascript
// 动态创建 script 标签请求跨域接口
function jsonp(url, callbackParam = 'callback') {
  return new Promise((resolve, reject) => {
    // 生成唯一回调函数名
    const callbackName = `jsonp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建回调函数
    window[callbackName] = function(data) {
      resolve(data);
      delete window[callbackName];
      document.body.removeChild(script);
    };
    
    // 创建 script 标签
    const script = document.createElement('script');
    script.src = `${url}${url.includes('?') ? '&' : '?'}${callbackParam}=${callbackName}`;
    script.onerror = function() {
      reject(new Error('JSONP 请求失败'));
      delete window[callbackName];
      document.body.removeChild(script);
    };
    
    document.body.appendChild(script);
  });
}

// 使用
jsonp('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

---

## 六、定时器与异步编程 API

### 6.1 setTimeout

```javascript
// 延迟执行（单位：毫秒）
const timerId = setTimeout(() => {
  console.log('1 秒后执行');
}, 1000);

// 清除定时器
clearTimeout(timerId);

// 传递参数
setTimeout((a, b) => {
  console.log(a + b);  // 30
}, 1000, 10, 20);

// setTimeout(func, 0)：将代码放入宏任务队列，等待当前代码执行完毕
console.log('1');
setTimeout(() => console.log('3'), 0);
console.log('2');
// 输出：1, 2, 3
```

### 6.2 setInterval

```javascript
// 重复执行
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log('计数:', count);
  
  // 10 次后停止
  if (count >= 10) {
    clearInterval(intervalId);
    console.log('停止');
  }
}, 1000);

// 清除定时器
clearInterval(intervalId);

// 注意：setInterval 不考虑执行时间，可能导致堆叠
// 更好的方式：递归 setTimeout
function loop() {
  console.log('执行任务');
  setTimeout(loop, 1000);  // 任务完成后再等 1 秒
}
loop();
```

### 6.3 requestAnimationFrame

专门用于动画，与浏览器刷新频率同步（通常 60fps）。

```javascript
let start;
function animate(timestamp) {
  if (!start) start = timestamp;
  const progress = timestamp - start;
  
  // 更新动画
  element.style.transform = `translateX(${Math.min(progress / 10, 200)}px)`;
  
  // 继续动画
  if (progress < 2000) {  // 2 秒后停止
    requestAnimationFrame(animate);
  }
}
requestAnimationFrame(animate);

// 取消动画
const animationId = requestAnimationFrame(animate);
cancelAnimationFrame(animationId);
```

### 6.4 Promise

Promise 是异步编程的核心机制。

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      resolve('成功');
    } else {
      reject('失败');
    }
  }, 1000);
});

// 基本使用
promise
  .then(result => {
    console.log(result);  // '成功'
    return '下一步';       // 返回值会作为下一个 then 的参数
  })
  .then(nextResult => {
    console.log(nextResult);  // '下一步'
  })
  .catch(error => {
    console.error(error);  // '失败'
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });

// Promise 静态方法
Promise.resolve('value');      // 立即 resolve
Promise.reject('error');        // 立即 reject

Promise.all([promise1, promise2, promise3])
  .then(([r1, r2, r3]) => {
    // 所有 Promise 都 resolve
  })
  .catch(error => {
    // 任一 reject
  });

Promise.race([promise1, promise2])
  .then(result => {
    // 返回最先完成的结果（无论成功失败）
  });

Promise.allSettled([p1, p2, p3])
  .then(results => {
    // 返回所有结果，包含状态
    results.forEach(r => {
      if (r.status === 'fulfilled') {
        console.log('成功:', r.value);
      } else {
        console.log('失败:', r.reason);
      }
    });
  });

Promise.any([p1, p2, p3])
  .then(result => {
    // 返回第一个成功的结果
  })
  .catch(errors => {
    // 全部失败
  });
```

### 6.5 async/await（ES2017）⭐

async/await 是基于 Promise 的语法糖，让异步代码看起来像同步代码。

```javascript
// 基本用法
async function fetchUser() {
  try {
    const response = await fetch('/api/user');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('获取用户失败:', error);
    throw error;
  }
}

// 调用
fetchUser().then(user => console.log(user));

// 串行执行（按顺序）
async function serial() {
  const result1 = await fetch('/api/1');
  const result2 = await fetch('/api/2');  // 等待第一个完成
  const result3 = await fetch('/api/3');  // 等待第二个完成
}

// 并行执行（同时开始）
async function parallel() {
  const promise1 = fetch('/api/1');
  const promise2 = fetch('/api/2');
  const promise3 = fetch('/api/3');
  
  // 等待全部完成
  const [r1, r2, r3] = await Promise.all([promise1, promise2, promise3]);
}

// 异步 IIFE
(async function() {
  const data = await fetchData();
  console.log(data);
})();

// 顶层 await（ES2022，仅支持在模块中）
// 在 .mjs 文件或 script type="module" 中
const data = await fetchData();
console.log(data);

// 异步迭代
async function processItems(items) {
  for await (const item of items) {
    await processItem(item);
  }
}
```

---

## 七、图形和媒体 API

### 7.1 Canvas API

Canvas 提供通过 JavaScript 绘制图形的能力。

```html
<canvas id="canvas" width="400" height="300"></canvas>
```

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 矩形
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 50, 50);        // 填充矩形
ctx.strokeStyle = 'blue';
ctx.strokeRect(70, 10, 50, 50);       // 边框矩形
ctx.clearRect(20, 20, 30, 30);        // 清除矩形区域

// 路径（三角形）
ctx.beginPath();
ctx.moveTo(75, 50);                    // 起点
ctx.lineTo(100, 75);                   // 画线
ctx.lineTo(100, 25);
ctx.closePath();                        // 闭合路径
ctx.fillStyle = 'green';
ctx.fill();                             // 填充
ctx.stroke();                           // 描边

// 圆形
ctx.beginPath();
ctx.arc(200, 100, 40, 0, Math.PI * 2);  // (x, y, r, startAngle, endAngle)
ctx.fillStyle = 'yellow';
ctx.fill();
ctx.strokeStyle = 'orange';
ctx.lineWidth = 3;
ctx.stroke();

// 文本
ctx.font = '24px Arial';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.fillText('Hello Canvas', canvas.width / 2, 150);
ctx.strokeText('描边文本', 50, 200);

// 渐变
const gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, 'red');
gradient.addColorStop(1, 'blue');
ctx.fillStyle = gradient;
ctx.fillRect(0, 250, 200, 50);

// 径向渐变
const radial = ctx.createRadialGradient(300, 50, 10, 300, 50, 40);
radial.addColorStop(0, 'white');
radial.addColorStop(1, 'black');
ctx.fillStyle = radial;
ctx.beginPath();
ctx.arc(300, 50, 40, 0, Math.PI * 2);
ctx.fill();

// 图像
const img = new Image();
img.onload = function() {
  ctx.drawImage(img, 10, 10);           // (x, y)
  ctx.drawImage(img, 10, 10, 100, 100); // (x, y, w, h)
};
img.src = 'image.jpg';

// 动画
let x = 0;
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(x, 150, 20, 0, Math.PI * 2);
  ctx.fill();
  
  x += 2;
  if (x > canvas.width + 20) x = -20;
  requestAnimationFrame(draw);
}
draw();
```

### 7.2 音频/视频 API

```html
<video id="video" src="video.mp4" controls></video>
<audio id="audio" src="audio.mp3"></audio>
```

```javascript
const video = document.getElementById('video');
const audio = document.getElementById('audio');

// 播放控制
video.play();
video.pause();
video.load();  // 重新加载

// 属性
video.currentTime = 30;    // 跳转到 30 秒
video.duration;            // 总时长（秒）
video.paused;              // 是否暂停
video.ended;               // 是否已结束
video.volume = 0.5;        // 音量（0-1）
video.muted = true;        // 静音
video.playbackRate = 1.5;  // 播放速度（1=正常）
video.loop = true;         // 循环播放
video.readyState;          // 就绪状态（0-4）

// 事件
video.addEventListener('play', () => console.log('开始播放'));
video.addEventListener('pause', () => console.log('暂停'));
video.addEventListener('ended', () => console.log('播放结束'));
video.addEventListener('timeupdate', () => {
  console.log('当前时间:', video.currentTime);
});
video.addEventListener('progress', () => {
  console.log('缓冲进度:', video.buffered);
});
video.addEventListener('loadedmetadata', () => {
  console.log('元数据加载完成', video.duration);
});
video.addEventListener('canplay', () => console.log('可以播放'));
video.addEventListener('error', () => console.error('播放错误'));

// Web Audio API（更复杂的音频处理）
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// 获取音频源
const source = audioContext.createMediaElementSource(audio);

// 创建分析器
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

// 连接节点
source.connect(analyser);
analyser.connect(audioContext.destination);

// 获取频率数据
const data = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(data);
```

---

## 八、其他实用 API

### 8.1 通知 API（Notification）

```javascript
// 请求权限
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    console.log('允许通知');
  }
});

// 发送通知
if (Notification.permission === 'granted') {
  const notification = new Notification('标题', {
    body: '通知内容',
    icon: '/icon.png',
    badge: '/badge.png',
    tag: 'message-1',           // 相同 tag 会替换旧通知
    requireInteraction: false,  // 是否需要用户操作才关闭
    silent: false               // 是否静音
  });
  
  // 点击通知
  notification.onclick = function() {
    window.open('https://example.com');
    notification.close();
  };
  
  // 自动关闭
  setTimeout(() => notification.close(), 5000);
}
```

### 8.2 全屏 API（Fullscreen）

```javascript
const element = document.documentElement;  // 整个页面

// 进入全屏
if (element.requestFullscreen) {
  element.requestFullscreen();
} else if (element.webkitRequestFullscreen) {  // Safari
  element.webkitRequestFullscreen();
}

// 退出全屏
if (document.exitFullscreen) {
  document.exitFullscreen();
}

// 检查全屏状态
document.fullscreenElement;  // 当前全屏元素，null 表示未全屏
document.fullscreenEnabled;  // 是否支持全屏

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  console.log('全屏状态变化');
});
```

### 8.3 页面可见性 API

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log('页面可见');
    // 恢复视频、动画、定时器等
  } else if (document.visibilityState === 'hidden') {
    console.log('页面隐藏');
    // 暂停视频、动画、定时器等以节省资源
  }
});
```

### 8.4 Vibration API（移动端）

```javascript
// 振动 200 毫秒
navigator.vibrate(200);

// 振动模式（振动-停止-振动-停止）
navigator.vibrate([200, 100, 200, 100, 500]);

// 停止振动
navigator.vibrate(0);
```

### 8.5 电池 API（已废弃，部分浏览器仍支持）

```javascript
navigator.getBattery().then(battery => {
  console.log('电量:', battery.level * 100 + '%');
  console.log('是否充电:', battery.charging);
  console.log('剩余时间:', battery.dischargingTime);
  
  battery.addEventListener('levelchange', () => {
    console.log('电量变化:', battery.level * 100 + '%');
  });
});
```

### 8.6 设备方向/运动 API（移动端）

```javascript
// 设备方向（陀螺仪）
window.addEventListener('deviceorientation', (event) => {
  console.log('Alpha (Z轴):', event.alpha);   // 0-360
  console.log('Beta (X轴):', event.beta);     // -180-180
  console.log('Gamma (Y轴):', event.gamma);   // -90-90
});

// 设备运动（加速度计）
window.addEventListener('devicemotion', (event) => {
  console.log('加速度:', event.acceleration);
  console.log('含重力加速度:', event.accelerationIncludingGravity);
  console.log('旋转:', event.rotationRate);
});
```

### 8.7 网络状态 API

```javascript
// 在线状态
console.log('是否在线:', navigator.onLine);

window.addEventListener('online', () => {
  console.log('已连接网络');
});

window.addEventListener('offline', () => {
  console.log('网络已断开');
});

// 网络信息（部分浏览器支持）
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (connection) {
  console.log('网络类型:', connection.effectiveType);  // '4g' | '3g' | '2g' | 'slow-2g'
  console.log('下行速度:', connection.downlink + ' Mbps');
  console.log('RTT:', connection.rtt + ' ms');
  console.log('是否节省数据:', connection.saveData);
  
  connection.addEventListener('change', () => {
    console.log('网络状态变化');
  });
}
```

---

## 九、总结

Web API 是前端开发的核心能力，本章涵盖：

### ✅ 关键知识点

1. **DOM API**：元素查询、属性操作、内容修改、结构操作、遍历
2. **事件系统**：事件监听、事件对象、事件流、事件委托、常用事件类型
3. **BOM API**：window、document、location、navigator、history、screen
4. **网络 API**：Fetch（推荐）、XMLHttpRequest、WebSocket
5. **异步编程**：定时器、Promise、async/await
6. **图形媒体**：Canvas、Audio/Video
7. **其他 API**：通知、全屏、网络状态、设备传感器

### 🎯 学习建议

- 重点掌握 DOM 查询和操作，这是最常用的能力
- 熟练使用 Fetch API 进行网络请求
- 理解事件委托机制，提高性能和代码可维护性
- 掌握 async/await 异步编程模式
- 了解其他实用 API，在需要时查阅文档

---

> **💡 提示**：Web API 数量众多，不需要全部记住。掌握核心 API（DOM、事件、Fetch、Promise），其他 API 在实际项目中需要时查阅文档即可。MDN Web Docs 是最好的参考资料。
