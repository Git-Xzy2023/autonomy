---
title: "viewport 是什么？如何设置？"
---

# viewport 是什么？如何设置？

**viewport（视口）是用户在网页上可见的区域，在移动设备上尤为重要。**

```html
<!-- 标准 viewport 设置 -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

**viewport 属性说明：**

| 属性                 | 说明                 |
| -------------------- | -------------------- |
| `width=device-width` | 视口宽度等于设备宽度 |
| `initial-scale=1.0`  | 初始缩放比例为 1     |
| `maximum-scale=1.0`  | 最大缩放比例为 1     |
| `minimum-scale=1.0`  | 最小缩放比例为 1     |
| `user-scalable=no`   | 禁止用户手动缩放     |

---
