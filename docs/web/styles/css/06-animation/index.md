---
title: 动画和过渡
---

# 动画和过渡

CSS 动画和过渡是创建平滑交互效果的强大工具。它们可以让你的网站更加生动和吸引人。

---

## 一、过渡（Transition）

过渡用于在元素的状态变化时创建平滑的动画效果。它是最简单的 CSS 动画形式。

### 1.1 transition 简写属性

```css
/* 语法：transition: property duration timing-function delay */

/* 示例：所有属性，0.3 秒，ease 缓动，无延迟 */
transition: all 0.3s ease;

/* 多个属性 */
transition: color 0.2s ease, background-color 0.5s ease;

/* 完整示例 */
.button {
  background-color: #3498db;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
}
```

### 1.2 过渡属性详解

#### transition-property：指定要过渡的属性

```css
/* 过渡所有属性 */
transition-property: all;

/* 只过渡特定属性 */
transition-property: background-color;

/* 多个属性 */
transition-property: color, background-color, transform;

/* 不过渡任何属性 */
transition-property: none;
```

**可过渡的 CSS 属性：**
- 颜色相关：color, background-color, border-color 等
- 尺寸相关：width, height, margin, padding 等
- 位置相关：top, right, bottom, left 等
- 变换相关：transform
- 透明度：opacity
- 阴影：box-shadow, text-shadow

**不可过渡的 CSS 属性：**
- display（从 none 到其他值不可过渡）
- position
- font-family
- 其他离散值属性

#### transition-duration：过渡持续时间

```css
/* 0.3 秒 */
transition-duration: 0.3s;

/* 300 毫秒 */
transition-duration: 300ms;

/* 多个属性的持续时间 */
transition-duration: 0.2s, 0.5s;
```

**常见持续时间参考：**
- 快速反馈：100ms - 200ms
- 中等动画：300ms - 500ms
- 较慢动画：600ms - 1000ms

#### transition-timing-function：过渡的缓动函数

缓动函数定义了动画过程中的速度变化。

```css
/* 默认值，开始慢，中间快，结束慢 */
transition-timing-function: ease;

/* 线性，匀速 */
transition-timing-function: linear;

/* 开始慢，逐渐加速 */
transition-timing-function: ease-in;

/* 开始快，逐渐减速 */
transition-timing-function: ease-out;

/* 开始和结束都慢 */
transition-timing-function: ease-in-out;

/* 自定义贝塞尔曲线 */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 阶梯式过渡，分 5 步 */
transition-timing-function: steps(5, start);
```

**常用缓动曲线示例：**

```css
/* 标准 ease */
cubic-bezier(0.25, 0.1, 0.25, 1)

/* 更快的 ease-out（用于退出动画） */
cubic-bezier(0.4, 0, 0.2, 1)

/* 更慢的 ease-in（用于进入动画） */
cubic-bezier(0, 0, 0.2, 1)

/* 弹跳效果 */
cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

#### transition-delay：过渡延迟时间

```css
/* 无延迟 */
transition-delay: 0s;

/* 延迟 0.5 秒后开始 */
transition-delay: 0.5s;

/* 多个属性的延迟 */
transition-delay: 0s, 0.5s;
```

### 1.3 过渡的触发方式

#### 伪类触发

```css
/* 悬停触发 */
.button:hover {
  transform: scale(1.05);
}

/* 点击触发 */
.button:active {
  transform: scale(0.95);
}

/* 获得焦点触发 */
.input:focus {
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}
```

#### 类名切换触发

```css
.box {
  width: 100px;
  height: 100px;
  background: #3498db;
  transition: all 0.3s ease;
}

.box.active {
  width: 200px;
  background: #e74c3c;
  transform: rotate(45deg);
}
```

```javascript
// JavaScript 切换类名
document.querySelector('.box').classList.toggle('active');
```

#### JavaScript 直接修改样式

```javascript
const element = document.querySelector('.element');
element.style.transform = 'translateX(100px)';
element.style.opacity = '0.5';
```

### 1.4 过渡实战示例

#### 示例 1：按钮悬停效果

```css
.button {
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
```

#### 示例 2：卡片悬停效果

```css
.card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

#### 示例 3：输入框聚焦效果

```css
.input {
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}
```

#### 示例 4：链接下划线动画

```css
.link {
  color: #3498db;
  text-decoration: none;
  position: relative;
}

.link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #3498db;
  transition: width 0.3s ease;
}

.link:hover::after {
  width: 100%;
}
```

---

## 二、变换（Transform）

变换允许你对元素进行旋转、缩放、倾斜和移动等操作。

### 2.1 2D 变换

#### translate：移动元素

```css
/* 沿 X 轴移动 50px */
transform: translateX(50px);

/* 沿 Y 轴移动 50px */
transform: translateY(50px);

/* 同时沿 X 和 Y 轴移动 */
transform: translate(50px, 50px);

/* 使用百分比 */
transform: translate(50%, 50%);

/* 居中元素 */
transform: translate(-50%, -50%);
```

#### rotate：旋转元素

```css
/* 顺时针旋转 45 度 */
transform: rotate(45deg);

/* 逆时针旋转 45 度 */
transform: rotate(-45deg);

/* 旋转一圈 */
transform: rotate(360deg);

/* 弧度单位 */
transform: rotate(1rad);
```

#### scale：缩放元素

```css
/* 整体放大 1.5 倍 */
transform: scale(1.5);

/* 沿 X 轴放大 */
transform: scaleX(1.5);

/* 沿 Y 轴放大 */
transform: scaleY(1.5);

/* 分别设置 X 和 Y 轴的缩放 */
transform: scale(1.5, 2);

/* 缩小 */
transform: scale(0.8);
```

#### skew：倾斜元素

```css
/* 沿 X 轴倾斜 10 度 */
transform: skewX(10deg);

/* 沿 Y 轴倾斜 10 度 */
transform: skewY(10deg);

/* 同时沿 X 和 Y 轴倾斜 */
transform: skew(10deg, 10deg);
```

#### matrix：矩阵变换

```css
/* matrix(scaleX, skewY, skewX, scaleY, translateX, translateY) */
transform: matrix(1, 0, 0, 1, 0, 0); /* 无变换 */
```

#### 组合多个变换

```css
/* 先移动，再旋转，最后缩放 */
transform: translate(50px, 50px) rotate(45deg) scale(1.5);

/* 注意：顺序很重要，不同的顺序会产生不同的结果 */
```

### 2.2 3D 变换

#### 3D 移动

```css
/* 沿 Z 轴移动 */
transform: translateZ(50px);

/* 3D 移动 */
transform: translate3d(50px, 50px, 50px);
```

#### 3D 旋转

```css
/* 沿 X 轴旋转 */
transform: rotateX(45deg);

/* 沿 Y 轴旋转 */
transform: rotateY(45deg);

/* 沿 Z 轴旋转（等同于 rotate） */
transform: rotateZ(45deg);

/* 3D 旋转 */
transform: rotate3d(1, 1, 1, 45deg);
```

#### 3D 缩放

```css
/* 沿 Z 轴缩放 */
transform: scaleZ(1.5);

/* 3D 缩放 */
transform: scale3d(1.5, 1.5, 1.5);
```

#### perspective：透视

```css
/* 父元素设置透视 */
.parent {
  perspective: 1000px;
  perspective-origin: center center;
}

/* 子元素进行 3D 变换 */
.child {
  transform: rotateY(45deg);
  transform-style: preserve-3d;
}
```

### 2.3 transform-origin：变换原点

```css
/* 默认值，元素中心 */
transform-origin: center;

/* 左上角 */
transform-origin: top left;

/* 右下角 */
transform-origin: bottom right;

/* 自定义位置 */
transform-origin: 20% 50%;
transform-origin: 100px 100px;

/* 3D 变换原点 */
transform-origin: 50% 50% 100px;
```

### 2.4 变换实战示例

#### 示例 1：旋转图标

```css
.icon {
  transition: transform 0.3s ease;
}

.icon:hover {
  transform: rotate(180deg);
}
```

#### 示例 2：缩放图片

```css
.image {
  transition: transform 0.3s ease;
}

.image:hover {
  transform: scale(1.1);
}
```

#### 示例 3：翻转动画

```css
.card {
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}
```

---

## 三、动画（Animation）

动画比过渡更强大，它允许你定义复杂的关键帧动画。

### 3.1 @keyframes：定义关键帧

```css
/* 定义一个简单的淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 定义一个多阶段动画 */
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 定义一个脉冲动画 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
```

### 3.2 animation 简写属性

```css
/* 语法：animation: name duration timing-function delay iteration-count direction fill-mode play-state */

/* 简单示例 */
animation: fadeIn 1s ease;

/* 完整示例 */
animation: slideIn 0.5s ease-in-out 0.2s infinite alternate both;
```

### 3.3 动画属性详解

#### animation-name：动画名称

```css
/* 指定动画名称 */
animation-name: fadeIn;

/* 多个动画 */
animation-name: fadeIn, slideIn;

/* 无动画 */
animation-name: none;
```

#### animation-duration：动画持续时间

```css
/* 1 秒 */
animation-duration: 1s;

/* 500 毫秒 */
animation-duration: 500ms;

/* 多个动画的持续时间 */
animation-duration: 1s, 2s;
```

#### animation-timing-function：动画缓动函数

```css
/* 值与 transition-timing-function 相同 */
animation-timing-function: ease;
animation-timing-function: linear;
animation-timing-function: ease-in-out;
animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
animation-timing-function: steps(5, end);
```

#### animation-delay：动画延迟

```css
/* 立即开始 */
animation-delay: 0s;

/* 延迟 0.5 秒 */
animation-delay: 0.5s;

/* 多个动画的延迟 */
animation-delay: 0s, 0.5s;
```

#### animation-iteration-count：动画播放次数

```css
/* 播放 1 次（默认） */
animation-iteration-count: 1;

/* 播放 3 次 */
animation-iteration-count: 3;

/* 无限循环 */
animation-iteration-count: infinite;
```

#### animation-direction：动画播放方向

```css
/* 正常播放（默认） */
animation-direction: normal;

/* 反向播放 */
animation-direction: reverse;

/* 交替播放（先正向后反向） */
animation-direction: alternate;

/* 交替反向播放（先反向后正向） */
animation-direction: alternate-reverse;
```

#### animation-fill-mode：动画填充模式

```css
/* 不应用任何样式（默认） */
animation-fill-mode: none;

/* 动画结束后保持最后一帧的状态 */
animation-fill-mode: forwards;

/* 动画开始前应用第一帧的状态 */
animation-fill-mode: backwards;

/* 同时应用 forwards 和 backwards */
animation-fill-mode: both;
```

#### animation-play-state：动画播放状态

```css
/* 播放（默认） */
animation-play-state: running;

/* 暂停 */
animation-play-state: paused;
```

**示例：悬停暂停动画**

```css
.spinner {
  animation: spin 2s linear infinite;
}

.spinner:hover {
  animation-play-state: paused;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### 3.4 多个动画

```css
/* 同时应用多个动画 */
.element {
  animation: 
    fadeIn 1s ease,
    slideIn 0.5s ease-out 0.2s both;
}
```

### 3.5 动画实战示例

#### 示例 1：淡入效果

```css
.fade-in {
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

#### 示例 2：滑入效果

```css
.slide-in-left {
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

#### 示例 3：弹跳效果

```css
.bounce {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}
```

#### 示例 4：脉冲效果

```css
.pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}
```

#### 示例 5：摇晃效果

```css
.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}
```

#### 示例 6：加载旋转动画

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

#### 示例 7：进度条动画

```css
.progress-bar {
  width: 100%;
  height: 20px;
  background: #f3f3f3;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2980b9);
  animation: progress 2s ease-out forwards;
}

@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 75%;
  }
}
```

#### 示例 8：闪烁文字效果

```css
.blink {
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
```

---

## 四、过渡 vs 动画：如何选择

| 特性 | 过渡 (Transition) | 动画 (Animation) |
|------|-----------------|----------------|
| 触发方式 | 需要状态变化（如 hover、类名切换） | 可以自动播放 |
| 控制方式 | 简单，只有开始和结束状态 | 复杂，可定义多个关键帧 |
| 循环 | 不支持 | 支持 |
| 反向播放 | 自动反向（状态恢复时） | 可控制 |
| 性能 | 通常更好 | 更消耗资源 |
| 适用场景 | 简单的状态变化、悬停效果 | 复杂动画、加载动画、特效 |

### 何时使用过渡

- 悬停效果（hover）
- 按钮点击反馈
- 元素状态切换（显示/隐藏）
- 简单的颜色、尺寸变化

### 何时使用动画

- 页面加载动画
- 加载指示器
- 复杂的多阶段动画
- 循环动画
- 滚动触发动画

---

## 五、性能优化

### 5.1 使用 transform 和 opacity

这两个属性可以触发 GPU 加速，性能最好。

```css
/* 推荐：使用 transform */
.element:hover {
  transform: translateX(100px);
}

/* 不推荐：使用 left（会触发重排） */
.element:hover {
  left: 100px;
}
```

### 5.2 使用 will-change

提前告诉浏览器哪些属性会变化，让浏览器提前做好准备。

```css
/* 告诉浏览器 transform 会变化 */
.element {
  will-change: transform;
}

/* 多个属性 */
.element {
  will-change: transform, opacity;
}
```

**注意：** 不要过度使用 will-change，只在真正需要的元素上使用。

### 5.3 避免过度动画

- 不要在每个元素上都使用动画
- 避免同时触发大量动画
- 考虑用户的设备性能

### 5.4 考虑用户的偏好

```css
/* 尊重用户的减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 六、动画最佳实践

### 6.1 设计原则

1. **有目的的动画**：动画应该有意义，不要为了动画而动画
2. **适度的时长**：通常 200-500ms 比较合适
3. **自然的缓动**：使用 ease、ease-in-out 等自然的缓动函数
4. **一致性**：在整个网站中保持动画风格的一致性
5. **性能优先**：考虑低性能设备的用户体验

### 6.2 常见的动画时长

| 场景 | 推荐时长 |
|------|---------|
| 按钮悬停 | 150-200ms |
| 元素淡入淡出 | 200-300ms |
| 元素滑入滑出 | 300-400ms |
| 页面切换 | 300-500ms |
| 加载动画 | 1-2s 循环 |

### 6.3 避免的常见错误

1. ❌ **过度动画**：不要在每个元素上都使用动画
2. ❌ **过长的动画**：超过 1 秒的动画会让用户感到等待
3. ❌ **过度使用 transform**：避免复杂的 3D 变换
4. ❌ **忽略性能**：在低性能设备上测试你的动画
5. ❌ **不考虑无障碍**：尊重用户的减少动画偏好

---

## 七、总结

CSS 动画和过渡是创建生动用户体验的强大工具。记住：

1. ✅ **简单的交互使用过渡**（transition）
2. ✅ **复杂的动画使用关键帧**（@keyframes）
3. ✅ **优先使用 transform 和 opacity**，性能更好
4. ✅ **考虑用户的设备和偏好**
5. ✅ **适度使用动画**，不要过度
6. ✅ **测试动画的性能**，特别是在移动设备上

通过合理使用动画和过渡，你可以创建出既美观又实用的用户界面。
