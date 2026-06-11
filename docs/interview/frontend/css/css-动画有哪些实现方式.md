---
title: "CSS 动画有哪些实现方式？"
---

# CSS 动画有哪些实现方式？

**CSS 中实现动画主要有以下几种方式：**

#### 1. transition（过渡动画）

**`transition` 用于在元素的不同状态之间创建平滑的过渡效果。**

```css
/* 基本用法 */
.box {
  width: 100px;
  height: 100px;
  background: red;
  transition:
    width 1s,
    background 2s;
}
.box:hover {
  width: 200px;
  background: blue;
}

/* 完整属性 */
.box {
  transition-property: width; /* 要过渡的属性 */
  transition-duration: 1s; /* 过渡时间 */
  transition-timing-function: ease; /* 时间函数 */
  transition-delay: 0.5s; /* 延迟时间 */

  /* 简写（推荐） */
  transition: width 1s ease 0.5s;

  /* 多个属性 */
  transition:
    width 1s,
    height 2s,
    color 0.5s;

  /* 所有属性 */
  transition: all 1s;
}
```

**transition-timing-function（时间函数）的可选值：**

| 值                      | 描述               |
| ----------------------- | ------------------ |
| `ease`                  | 慢-快-慢（默认值） |
| `linear`                | 匀速               |
| `ease-in`               | 慢开始，加速       |
| `ease-out`              | 慢结束，减速       |
| `ease-in-out`           | 慢开始和结束       |
| `cubic-bezier(n,n,n,n)` | 自定义贝塞尔曲线   |
| `steps(n, start/end)`   | 阶梯式过渡         |

**使用场景**：hover 效果、状态切换（如展开/收起）、简单的交互反馈

---

#### 2. transform（变换）

**`transform` 用于对元素进行旋转、缩放、倾斜、移动等变换操作。**

```css
/* 2D 变换 */
.box {
  transform: translate(50px, 30px); /* 移动 */
  transform: translateX(50px); /* 水平移动 */
  transform: translateY(30px); /* 垂直移动 */

  transform: rotate(45deg); /* 旋转 */

  transform: scale(1.5); /* 缩放（宽高都放大 1.5 倍） */
  transform: scaleX(2); /* 水平缩放 */
  transform: scaleY(0.5); /* 垂直缩放 */

  transform: skew(30deg, 20deg); /* 倾斜 */
  transform: skewX(30deg); /* 水平倾斜 */
  transform: skewY(20deg); /* 垂直倾斜 */

  /* 组合使用 */
  transform: translate(50px, 50px) rotate(45deg) scale(1.2);
}

/* 3D 变换 */
.box {
  transform: translateZ(100px); /* Z 轴移动 */
  transform: translate3d(50px, 30px, 100px); /* 3D 移动 */

  transform: rotateX(45deg); /* 绕 X 轴旋转 */
  transform: rotateY(45deg); /* 绕 Y 轴旋转 */
  transform: rotateZ(45deg); /* 绕 Z 轴旋转（等同于 rotate） */
  transform: rotate3d(1, 1, 1, 45deg); /* 3D 旋转 */

  transform: scaleZ(2); /* Z 轴缩放 */
  transform: scale3d(2, 1.5, 2); /* 3D 缩放 */

  transform: perspective(500px); /* 透视效果 */
}
```

**transform 的相关属性：**

```css
.box {
  /* 变换原点 */
  transform-origin: center; /* 默认值，中心 */
  transform-origin: top left; /* 左上角 */
  transform-origin: 50px 50px; /* 自定义坐标 */

  /* 变换样式（3D 相关） */
  transform-style: flat; /* 2D 平面（默认） */
  transform-style: preserve-3d; /* 保留 3D 空间 */

  /* 透视效果 */
  perspective: 500px;
  perspective-origin: center;

  /* 背面是否可见 */
  backface-visibility: visible; /* 可见（默认） */
  backface-visibility: hidden; /* 不可见 */
}
```

**使用场景**：按钮点击效果、卡片翻转、图标动画、2D/3D 视觉效果

---

#### 3. animation（关键帧动画）

**`animation` 可以创建更复杂的动画效果，通过 `@keyframes` 定义动画的关键帧。**

```css
/* 定义关键帧 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 使用百分比定义更精细的动画 */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

/* 应用动画 */
.box {
  animation-name: slideIn;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0.5s;
  animation-iteration-count: 1; /* 播放次数：1, infinite... */
  animation-direction: normal; /* normal, reverse, alternate, alternate-reverse */
  animation-fill-mode: forwards; /* none, forwards, backwards, both */
  animation-play-state: running; /* running, paused */

  /* 简写（推荐） */
  animation: slideIn 1s ease 0.5s 1 normal forwards;
}

/* 鼠标悬停时暂停动画 */
.box:hover {
  animation-play-state: paused;
}
```

**animation-direction（播放方向）：**

| 值                  | 描述                           |
| ------------------- | ------------------------------ |
| `normal`            | 正常播放（默认）               |
| `reverse`           | 反向播放                       |
| `alternate`         | 交替播放（奇数正向，偶数反向） |
| `alternate-reverse` | 反向交替播放                   |

**animation-fill-mode（填充模式）：**

| 值          | 描述                           |
| ----------- | ------------------------------ |
| `none`      | 不设置（默认）                 |
| `forwards`  | 动画结束后保持最后一帧状态     |
| `backwards` | 动画开始前应用第一帧状态       |
| `both`      | 同时应用 forwards 和 backwards |

**使用场景**：加载动画、页面入场动画、循环动画、复杂交互效果

---

#### 三种动画方式对比

| 特性       | transition                               | transform                             | animation              |
| ---------- | ---------------------------------------- | ------------------------------------- | ---------------------- |
| 触发方式   | 需要事件触发（hover, click, class 变化） | 通常配合 transition 或 animation 使用 | 自动播放或触发播放     |
| 动画复杂度 | 简单（状态过渡）                         | 静态变换                              | 复杂（多关键帧）       |
| 循环播放   | ❌ 不支持                                | ❌ 不支持                             | ✅ 支持（infinite）    |
| 控制灵活性 | 一般                                     | 高（可组合多种变换）                  | 高（可精细控制每一帧） |
| 性能       | ✅ 好                                    | ✅ 好（GPU 加速）                     | ✅ 较好                |

---
