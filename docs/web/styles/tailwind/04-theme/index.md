---
title: Tailwind 自定义主题
---

# Tailwind 自定义主题

## 一、配置文件结构

`tailwind.config.js` 是 Tailwind 的核心配置文件：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {}, // 扩展（不覆盖默认值）
  },
  plugins: [],
};
```

### `theme` vs `theme.extend`

| 方式 | 行为 |
|------|------|
| `theme: { colors: {...} }` | **覆盖**默认配置 |
| `theme: { extend: { colors: {...} } }` | **扩展**默认配置（推荐） |

```js
// ❌ 覆盖：会丢失所有默认颜色
module.exports = {
  theme: {
    colors: {
      primary: '#3498db',
    },
  },
};

// ✅ 扩展：保留默认颜色，添加自定义
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
      },
    },
  },
};
```

---

## 二、自定义颜色

### 1. 添加品牌色

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
};
```

使用：

```html
<button class="bg-brand-500 hover:bg-brand-600 text-white">
  品牌色按钮
</button>
```

### 2. 添加单色

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
      },
    },
  },
};
```

### 3. 使用 CSS 变量

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
      },
    },
  },
};
```

```css
:root {
  --color-primary: #3498db;
}
```

---

## 三、自定义字体

### 1. 字体族

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
};
```

使用：

```html
<p class="font-sans">无衬线字体</p>
<p class="font-serif">衬线字体</p>
<code class="font-mono">等宽字体</code>
```

### 2. 字号

```js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.9rem' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
    },
  },
};
```

---

## 四、自定义间距

### 1. 扩展间距

```js
module.exports = {
  theme: {
    extend: {
      spacing: {
        13: '3.25rem', // 52px
        18: '4.5rem',  // 72px
        100: '25rem',  // 400px
      },
    },
  },
};
```

使用：

```html
<div class="p-13">padding: 3.25rem</div>
<div class="mt-18">margin-top: 4.5rem</div>
```

### 2. 自定义断点间距

```js
module.exports = {
  theme: {
    extend: {
      spacing: {
        'safe': 'env(safe-area-inset-top)',
      },
    },
  },
};
```

---

## 五、自定义圆角

```js
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
};
```

使用：

```html
<div class="rounded-4xl">圆角 2rem</div>
```

---

## 六、自定义阴影

```js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
        glow: '0 0 20px rgba(59, 130, 246, 0.5)',
      },
    },
  },
};
```

使用：

```html
<div class="shadow-soft">柔和阴影</div>
<div class="shadow-glow">发光效果</div>
```

---

## 七、自定义动画

```js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
};
```

使用：

```html
<div class="animate-fade-in">淡入</div>
<div class="animate-slide-up">上滑</div>
<div class="animate-wiggle">摇摆</div>
```

---

## 八、自定义断点

```js
module.exports = {
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
  },
};
```

---

## 九、自定义容器

```js
module.exports = {
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
};
```

使用：

```html
<div class="container">
  居中且有 padding 的容器
</div>
```

---

## 十、完整配置示例

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.9rem' }],
      },
      spacing: {
        13: '3.25rem',
        18: '4.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
};
```

---

## 十一、下一步

- 上一章：[响应式与状态](/web/styles/tailwind/03-responsive/)
- 下一章：[@apply 与组件抽取](/web/styles/tailwind/05-apply/)
