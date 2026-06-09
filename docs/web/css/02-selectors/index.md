---
title: 选择器
---

# 选择器

## 基础选择器

```css
/* 元素选择器 */
div { }

/* 类选择器 */
.class-name { }

/* ID 选择器 */
#id-name { }

/* 属性选择器 */
[attr] { }
[attr="value"] { }
[attr~="value"] { }
[attr|="value"] { }
[attr^="value"] { }
[attr$="value"] { }
[attr*="value"] { }
```

## 关系选择器

```css
/* 后代选择器 */
div span { }

/* 子选择器 */
div > span { }

/* 相邻兄弟选择器 */
div + span { }

/* 通用兄弟选择器 */
div ~ span { }
```

## 伪类选择器

```css
/* 链接伪类 */
a:link { }
a:visited { }
a:hover { }
a:active { }

/* 用户行为伪类 */
:focus { }
:focus-visible { }

/* 位置伪类 */
:first-child { }
:last-child { }
:nth-child(n) { }
:nth-last-child(n) { }
:only-child { }

/* 类型伪类 */
:first-of-type { }
:last-of-type { }
:nth-of-type(n) { }
:nth-last-of-type(n) { }
:only-of-type { }

/* 状态伪类 */
:enabled { }
:disabled { }
:checked { }
:required { }
:optional { }
:valid { }
:invalid { }
:in-range { }
:out-of-range { }
:read-only { }
:read-write { }

/* 否定伪类 */
:not(selector) { }
```

## 伪元素选择器

```css
::before { }
::after { }
::first-letter { }
::first-line { }
::selection { }
::placeholder { }
```

## 选择器优先级

```css
/* 优先级从高到低 */
!important > 内联样式 > ID > 类/属性/伪类 > 元素 > 通配符

/* 计算规则 */
/* (内联, ID, 类/属性/伪类, 元素) */
```
