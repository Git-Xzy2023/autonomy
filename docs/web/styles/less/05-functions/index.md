---
title: Less 函数与运算
---

# Less 函数与运算

## 一、运算

Less 支持基本的数学运算：

```less
@base: 10px;

.container {
  width: @base + 20px;   // 30px
  height: @base * 2;     // 20px
  margin: @base - 5px;   // 5px
  padding: @base / 2;    // 5px
}
```

### 带单位的运算

```less
// 相同单位
@width: 100px;
.box {
  width: @width + 50px;   // 150px
  margin: @width - 20px;  // 80px
}

// 不同单位（Less 会转换）
.box {
  width: 10cm + 20mm;     // 12cm
  font-size: 16px + 2pt;  // 18.666px
}
```

### 颜色运算

```less
@color: #3498db;

.lighter { background: @color + #111; }  // #44a9ec
.darker { background: @color - #111; }   // #2488ca
```

---

## 二、内置函数

### 1. 颜色函数

```less
@color: #3498db;

// 明度调整
lighten(@color, 20%);   // 变亮
darken(@color, 20%);    // 变暗

// 饱和度调整
saturate(@color, 20%);  // 增加饱和度
desaturate(@color, 20%); // 降低饱和度

// 色相调整
spin(@color, 30);       // 色相旋转 30 度
hue(@color);            // 获取色相
saturation(@color);     // 获取饱和度
lightness(@color);      // 获取明度

// 透明度
fade(@color, 50%);      // 设置为 50% 透明度
fadein(@color, 20%);    // 增加 20% 不透明度
fadeout(@color, 20%);   // 增加 20% 透明度
alpha(@color);          // 获取透明度

// 混合
mix(red, blue);         // 混合两种颜色
greyscale(@color);      // 灰度
contrast(@color);       // 返回对比色（黑或白）

// 其他
tint(@color, 20%);      // 与白色混合
shade(@color, 20%);     // 与黑色混合
```

### 2. 数学函数

```less
ceil(2.4);        // 3
floor(2.9);       // 2
round(2.4);       // 2
percentage(0.5);  // 50%
sqrt(16);         // 4
abs(-10);         // 10
sin(0);           // 0
cos(0);           // 1
min(1, 2, 3);     // 1
max(1, 2, 3);     // 3
mod(10, 3);       // 1
pow(2, 3);        // 8
pi();             // 3.14159...
```

### 3. 字符串函数

```less
escape('hello world');     // 'hello%20world'
e('calc(100% - 10px)');    // 转义，输出 calc(100% - 10px)
%('color: %s', red);       // 格式化字符串
replace('hello', 'l', 'r'); // 'herro'
```

### 4. 列表函数

```less
@list: 1, 2, 3, 4;

length(@list);      // 4
extract(@list, 2);  // 2（索引从 1 开始）
```

### 5. 类型判断函数

```less
isnumber(10px);      // true
isstring('hello');   // true
iscolor(red);        // true
iskeyword(keyword);  // true
isurl(url(...));     // true
ispixel(10px);       // true
isem(1em);           // true
ispercentage(50%);   // true
isunit(10px, px);    // true
```

### 6. 颜色定义函数

```less
rgb(52, 152, 219);           // #3498db
rgba(52, 152, 219, 0.5);     // rgba(52, 152, 219, 0.5)
hsl(204, 70%, 53%);          // #3498db
hsla(204, 70%, 53%, 0.5);    // hsla(204, 70%, 53%, 0.5)
hsv(204, 76%, 86%);          // HSV 颜色
```

---

## 三、自定义函数

Less **不支持**自定义函数（这是与 Sass 的重要区别）。但可以用 Mixin 模拟：

```less
// 用 mixin 模拟函数
.rem(@px) {
  @result: (@px / 16) * 1rem;
}

.title {
  .rem(24px);
  font-size: @result;  // 1.5rem
}
```

或者使用带返回值的 mixin：

```less
.calculate-rem(@px) {
  @rem-value: (@px / 16) * 1rem;
}

.title {
  .calculate-rem(24px);
  font-size: @rem-value;  // 1.5rem
}
```

---

## 四、颜色函数实战

### 主题色生成

```less
@primary: #3498db;

.btn-primary {
  background: @primary;
  &:hover { background: darken(@primary, 10%); }
  &:active { background: darken(@primary, 20%); }
  &:disabled { background: lighten(@primary, 20%); }
}
```

### 对比色自动选择

```less
@bg: #3498db;

.card {
  background: @bg;
  color: contrast(@bg, black, white);  // 自动选择对比色
}
```

### 颜色透明度

```less
@primary: #3498db;

.overlay {
  background: fade(@primary, 50%);  // 50% 透明度
}
```

---

## 五、下一步

- 上一章：[Mixin](/web/styles/less/04-mixin/)
- 下一章：[守卫与循环](/web/styles/less/06-guard-loop/)
