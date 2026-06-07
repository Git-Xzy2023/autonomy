---
title: 布局
---

# 布局

## Flexbox

```css
/* 容器属性 */
display: flex;
display: inline-flex;

flex-direction: row;
flex-direction: row-reverse;
flex-direction: column;
flex-direction: column-reverse;

flex-wrap: nowrap;
flex-wrap: wrap;
flex-wrap: wrap-reverse;

flex-flow: row nowrap;

justify-content: flex-start;
justify-content: flex-end;
justify-content: center;
justify-content: space-between;
justify-content: space-around;
justify-content: space-evenly;

align-items: stretch;
align-items: flex-start;
align-items: flex-end;
align-items: center;
align-items: baseline;

align-content: stretch;
align-content: flex-start;
align-content: flex-end;
align-content: center;
align-content: space-between;
align-content: space-around;

gap: 10px;
gap: 10px 20px;

/* 项目属性 */
order: 0;

flex-grow: 0;
flex-shrink: 1;
flex-basis: auto;

flex: 0 1 auto;
flex: 1;

align-self: auto;
align-self: flex-start;
align-self: flex-end;
align-self: center;
align-self: baseline;
align-self: stretch;
```

## Grid

```css
/* 容器属性 */
display: grid;
display: inline-grid;

grid-template-columns: 100px 100px 100px;
grid-template-columns: 1fr 1fr 1fr;
grid-template-columns: repeat(3, 1fr);
grid-template-columns: 100px auto 100px;

grid-template-rows: 100px 100px;
grid-template-rows: 1fr 2fr;
grid-template-rows: auto 1fr;

grid-template-areas:
  "header header"
  "sidebar main"
  "footer footer";

gap: 10px;
gap: 10px 20px;

justify-items: stretch;
justify-items: start;
justify-items: end;
justify-items: center;

align-items: stretch;
align-items: start;
align-items: end;
align-items: center;

place-items: center;

justify-content: start;
justify-content: end;
justify-content: center;
justify-content: stretch;
justify-content: space-between;
justify-content: space-around;
justify-content: space-evenly;

align-content: start;
align-content: end;
align-content: center;
align-content: stretch;
align-content: space-between;
align-content: space-around;
align-content: space-evenly;

place-content: center;

/* 项目属性 */
grid-column: 1 / 3;
grid-column-start: 1;
grid-column-end: 3;
grid-column: span 2;

grid-row: 1 / 2;
grid-row-start: 1;
grid-row-end: 2;
grid-row: span 1;

grid-area: header;

justify-self: stretch;
justify-self: start;
justify-self: end;
justify-self: center;

align-self: stretch;
align-self: start;
align-self: end;
align-self: center;

place-self: center;
```

## 定位

```css
position: static;
position: relative;
position: absolute;
position: fixed;
position: sticky;

top: 10px;
right: 10px;
bottom: 10px;
left: 10px;

z-index: 1;
```

## 浮动

```css
float: left;
float: right;
float: none;

clear: left;
clear: right;
clear: both;
clear: none;
```
