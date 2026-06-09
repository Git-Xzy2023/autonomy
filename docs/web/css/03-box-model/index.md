---
title: 盒模型
---

# 盒模型

## 标准盒模型

```css
box-sizing: content-box;

/* 宽度 = content width */
/* 总宽度 = width + padding + border + margin */
```

## 怪异盒模型

```css
box-sizing: border-box;

/* 宽度 = content width + padding + border */
/* 总宽度 = width + margin */
```

## 盒模型属性

```css
/* 外边距 */
margin: 10px;
margin: 10px 20px;
margin: 10px 20px 30px;
margin: 10px 20px 30px 40px;
margin-top: 10px;
margin-right: 20px;
margin-bottom: 30px;
margin-left: 40px;

/* 内边距 */
padding: 10px;
padding: 10px 20px;
padding: 10px 20px 30px;
padding: 10px 20px 30px 40px;
padding-top: 10px;
padding-right: 20px;
padding-bottom: 30px;
padding-left: 40px;

/* 边框 */
border: 1px solid #000;
border-width: 1px;
border-style: solid;
border-color: #000;
border-radius: 5px;
```
