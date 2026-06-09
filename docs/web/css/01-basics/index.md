---
title: CSS 基础
---

# CSS 基础

## CSS 引入方式

```css
/* 1. 内联样式 */
<div style="color: red;">Hello</div>

/* 2. 内部样式 */
<style>
  div { color: blue; }
</style>

/* 3. 外部样式 */
<link rel="stylesheet" href="style.css">
```

## CSS 语法

```css
/* 选择器 { 属性: 值; } */
body {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}
```

## CSS 单位

```css
/* 绝对单位 */
px: 像素
pt: 点
cm: 厘米

/* 相对单位 */
em: 相对于父元素字体大小
rem: 相对于根元素字体大小
%: 相对于父元素
vw: 视口宽度的 1%
vh: 视口高度的 1%
vmin: 视口宽度和高度中较小值的 1%
vmax: 视口宽度和高度中较大值的 1%
```

## CSS 颜色

```css
/* 关键字 */
color: red;

/* 十六进制 */
color: #ff0000;
color: #f00;

/* RGB */
color: rgb(255, 0, 0);
color: rgb(100%, 0%, 0%);

/* RGBA (包含透明度) */
color: rgba(255, 0, 0, 0.5);

/* HSL */
color: hsl(0, 100%, 50%);

/* HSLA (包含透明度) */
color: hsla(0, 100%, 50%, 0.5);
```
