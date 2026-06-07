---
title: 响应式设计
---

# 响应式设计

## 媒体查询

```css
@media (max-width: 768px) {
  /* 移动设备样式 */
}

@media (min-width: 768px) and (max-width: 1024px) {
  /* 平板设备样式 */
}

@media (min-width: 1024px) {
  /* 桌面设备样式 */
}

@media (orientation: portrait) {
  /* 竖屏样式 */
}

@media (orientation: landscape) {
  /* 横屏样式 */
}
```

## 弹性图片

```css
img {
  max-width: 100%;
  height: auto;
}
```

## 相对长度

```css
/* 使用 em/rem/vw/vh 代替 px */
font-size: 1rem;
padding: 1em;
width: 50vw;
height: 100vh;
```
