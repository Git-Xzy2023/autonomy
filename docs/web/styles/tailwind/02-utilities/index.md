---
title: Tailwind 工具类速查
---

# Tailwind 工具类速查

## 一、布局

### Display

| 类名 | CSS |
|------|-----|
| `block` | `display: block` |
| `inline-block` | `display: inline-block` |
| `inline` | `display: inline` |
| `flex` | `display: flex` |
| `inline-flex` | `display: inline-flex` |
| `grid` | `display: grid` |
| `inline-grid` | `display: inline-grid` |
| `hidden` | `display: none` |

### Flexbox

| 类名 | CSS |
|------|-----|
| `flex-row` | `flex-direction: row` |
| `flex-col` | `flex-direction: column` |
| `flex-wrap` | `flex-wrap: wrap` |
| `flex-1` | `flex: 1 1 0%` |
| `flex-auto` | `flex: 1 1 auto` |
| `flex-none` | `flex: none` |
| `justify-center` | `justify-content: center` |
| `justify-between` | `justify-content: space-between` |
| `justify-around` | `justify-content: space-around` |
| `items-center` | `align-items: center` |
| `items-start` | `align-items: flex-start` |
| `items-end` | `align-items: flex-end` |
| `content-center` | `align-content: center` |

### Grid

| 类名 | CSS |
|------|-----|
| `grid-cols-1` ~ `grid-cols-12` | `grid-template-columns: repeat(n, minmax(0, 1fr))` |
| `grid-cols-2` | 2 列 |
| `grid-rows-2` | 2 行 |
| `col-span-2` | `grid-column: span 2 / span 2` |
| `col-start-1` | `grid-column-start: 1` |
| `gap-4` | `gap: 1rem` |
| `gap-x-4` | `column-gap: 1rem` |
| `gap-y-4` | `row-gap: 1rem` |

### Position

| 类名 | CSS |
|------|-----|
| `static` | `position: static` |
| `relative` | `position: relative` |
| `absolute` | `position: absolute` |
| `fixed` | `position: fixed` |
| `sticky` | `position: sticky` |
| `top-0` | `top: 0` |
| `right-0` | `right: 0` |
| `bottom-0` | `bottom: 0` |
| `left-0` | `left: 0` |
| `inset-0` | `top: 0; right: 0; bottom: 0; left: 0` |

---

## 二、间距

### Padding

| 类名 | CSS |
|------|-----|
| `p-0` | `padding: 0` |
| `p-1` | `padding: 0.25rem` (4px) |
| `p-2` | `padding: 0.5rem` (8px) |
| `p-4` | `padding: 1rem` (16px) |
| `p-8` | `padding: 2rem` (32px) |
| `px-4` | `padding-left: 1rem; padding-right: 1rem` |
| `py-4` | `padding-top: 1rem; padding-bottom: 1rem` |
| `pt-4` / `pr-4` / `pb-4` / `pl-4` | 单方向 |

### Margin

| 类名 | CSS |
|------|-----|
| `m-0` | `margin: 0` |
| `m-4` | `margin: 1rem` |
| `mx-auto` | `margin-left: auto; margin-right: auto`（水平居中） |
| `mt-4` / `mr-4` / `mb-4` / `ml-4` | 单方向 |
| `-m-4` | `margin: -1rem`（负值） |

### 间距比例

| 数字 | 值 |
|------|-----|
| 0 | 0 |
| 0.5 | 0.125rem (2px) |
| 1 | 0.25rem (4px) |
| 2 | 0.5rem (8px) |
| 3 | 0.75rem (12px) |
| 4 | 1rem (16px) |
| 6 | 1.5rem (24px) |
| 8 | 2rem (32px) |
| 12 | 3rem (48px) |
| 16 | 4rem (64px) |
| 24 | 6rem (96px) |

---

## 三、尺寸

### Width

| 类名 | CSS |
|------|-----|
| `w-0` | `width: 0` |
| `w-1/2` | `width: 50%` |
| `w-1/3` | `width: 33.333333%` |
| `w-2/3` | `width: 66.666667%` |
| `w-1/4` | `width: 25%` |
| `w-full` | `width: 100%` |
| `w-screen` | `width: 100vw` |
| `w-auto` | `width: auto` |
| `w-min` | `width: min-content` |
| `w-max` | `width: max-content` |

### Height

| 类名 | CSS |
|------|-----|
| `h-0` | `height: 0` |
| `h-8` | `height: 2rem` (32px) |
| `h-full` | `height: 100%` |
| `h-screen` | `height: 100vh` |
| `min-h-screen` | `min-height: 100vh` |

---

## 四、颜色

### 背景色

```html
<div class="bg-blue-500">蓝色背景</div>
<div class="bg-red-100">浅红背景</div>
<div class="bg-[#ff0000]">自定义颜色</div>
```

### 文字颜色

```html
<p class="text-gray-700">深灰文字</p>
<p class="text-white">白色文字</p>
<p class="text-[#333]">自定义颜色</p>
```

### 边框颜色

```html
<div class="border border-gray-300">灰色边框</div>
```

### 颜色比例

每个颜色有 9 个级别（100-900）：

| 级别 | 描述 |
|------|------|
| 50 | 最浅 |
| 100 | 很浅 |
| 200 | 浅 |
| 300 | 较浅 |
| 400 | 中浅 |
| 500 | 中（默认） |
| 600 | 中深 |
| 700 | 较深 |
| 800 | 深 |
| 900 | 很深 |

```html
<div class="bg-blue-50">最浅蓝</div>
<div class="bg-blue-500">中蓝</div>
<div class="bg-blue-900">最深蓝</div>
```

### 透明度

```html
<div class="bg-blue-500/50">50% 透明度</div>
<div class="bg-blue-500/75">75% 透明度</div>
```

---

## 五、字体

### 字号

| 类名 | CSS |
|------|-----|
| `text-xs` | `font-size: 0.75rem` (12px) |
| `text-sm` | `font-size: 0.875rem` (14px) |
| `text-base` | `font-size: 1rem` (16px) |
| `text-lg` | `font-size: 1.125rem` (18px) |
| `text-xl` | `font-size: 1.25rem` (20px) |
| `text-2xl` | `font-size: 1.5rem` (24px) |
| `text-3xl` | `font-size: 1.875rem` (30px) |
| `text-4xl` | `font-size: 2.25rem` (36px) |

### 字重

| 类名 | CSS |
|------|-----|
| `font-thin` | `font-weight: 100` |
| `font-light` | `font-weight: 300` |
| `font-normal` | `font-weight: 400` |
| `font-medium` | `font-weight: 500` |
| `font-semibold` | `font-weight: 600` |
| `font-bold` | `font-weight: 700` |
| `font-extrabold` | `font-weight: 800` |

### 对齐

| 类名 | CSS |
|------|-----|
| `text-left` | `text-align: left` |
| `text-center` | `text-align: center` |
| `text-right` | `text-align: right` |
| `text-justify` | `text-align: justify` |

### 行高

| 类名 | CSS |
|------|-----|
| `leading-none` | `line-height: 1` |
| `leading-tight` | `line-height: 1.25` |
| `leading-snug` | `line-height: 1.375` |
| `leading-normal` | `line-height: 1.5` |
| `leading-relaxed` | `line-height: 1.625` |
| `leading-loose` | `line-height: 2` |

---

## 六、边框与圆角

### Border

| 类名 | CSS |
|------|-----|
| `border` | `border-width: 1px` |
| `border-2` | `border-width: 2px` |
| `border-0` | `border-width: 0` |
| `border-t` | `border-top-width: 1px` |
| `border-b` | `border-bottom-width: 1px` |
| `border-solid` | `border-style: solid` |
| `border-dashed` | `border-style: dashed` |

### Border Radius

| 类名 | CSS |
|------|-----|
| `rounded-none` | `border-radius: 0` |
| `rounded-sm` | `border-radius: 0.125rem` |
| `rounded` | `border-radius: 0.25rem` |
| `rounded-md` | `border-radius: 0.375rem` |
| `rounded-lg` | `border-radius: 0.5rem` |
| `rounded-xl` | `border-radius: 0.75rem` |
| `rounded-full` | `border-radius: 9999px` |

---

## 七、阴影

| 类名 | CSS |
|------|-----|
| `shadow-sm` | 小阴影 |
| `shadow` | 默认阴影 |
| `shadow-md` | 中阴影 |
| `shadow-lg` | 大阴影 |
| `shadow-xl` | 更大阴影 |
| `shadow-2xl` | 最大阴影 |
| `shadow-none` | 无阴影 |

---

## 八、其他常用

### Overflow

| 类名 | CSS |
|------|-----|
| `overflow-hidden` | `overflow: hidden` |
| `overflow-auto` | `overflow: auto` |
| `overflow-scroll` | `overflow: scroll` |
| `overflow-x-auto` | `overflow-x: auto` |
| `overflow-y-auto` | `overflow-y: auto` |

### Cursor

| 类名 | CSS |
|------|-----|
| `cursor-pointer` | `cursor: pointer` |
| `cursor-not-allowed` | `cursor: not-allowed` |
| `cursor-default` | `cursor: default` |

### Opacity

| 类名 | CSS |
|------|-----|
| `opacity-0` | `opacity: 0` |
| `opacity-50` | `opacity: 0.5` |
| `opacity-100` | `opacity: 1` |

### Transition

| 类名 | CSS |
|------|-----|
| `transition` | `transition: all 150ms cubic-bezier(...)` |
| `transition-colors` | `transition: color, background-color, ...` |
| `transition-opacity` | `transition: opacity` |
| `transition-transform` | `transition: transform` |
| `duration-300` | `transition-duration: 300ms` |
| `ease-in-out` | `transition-timing-function: cubic-bezier(...)` |

---

## 九、任意值 `[]`

如果工具类不满足需求，可以使用任意值：

```html
<!-- 任意颜色 -->
<div class="bg-[#ff0000]">红色</div>

<!-- 任意尺寸 -->
<div class="w-[300px]">300px 宽</div>
<div class="top-[117px]">top: 117px</div>

<!-- 任意 CSS -->
<div class="[mask-type:luminance]">自定义属性</div>

<!-- 任意选择器 -->
<div class="[&:nth-child(3)]:bg-red-500">第三个子元素变红</div>
```

---

## 十、下一步

- 上一章：[Tailwind 入门与配置](/web/styles/tailwind/01-intro/)
- 下一章：[响应式与状态](/web/styles/tailwind/03-responsive/)
