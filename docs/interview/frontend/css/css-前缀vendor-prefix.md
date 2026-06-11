---
title: "CSS 前缀（Vendor Prefix）"
---

# CSS 前缀（Vendor Prefix）

**浏览器厂商为实验性或私有 CSS 属性添加前缀。**

| 前缀       | 浏览器                                   |
| ---------- | ---------------------------------------- |
| `-webkit-` | Chrome、Safari、Edge（新版）、iOS Safari |
| `-moz-`    | Firefox                                  |
| `-ms-`     | IE、旧版 Edge                            |
| `-o-`      | 旧版 Opera                               |

```css
/* 手动添加前缀（不推荐） */
.box {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

/* 使用 Autoprefixer 自动处理 */
/* 只需写标准语法 */
.box {
  transform: rotate(45deg);
  display: flex;
  transition: all 0.3s;
}
/* Autoprefixer 会自动生成带前缀的版本 */
```

---
