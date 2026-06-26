---
title: VueUse 组合式工具库
---

# VueUse 组合式工具库

> VueUse 是 Vue 3 生态最重要的 Composition API 工具集合，提供 200+ 个开箱即用的 composables，涵盖浏览器 API、状态管理、动画、传感器、网络等场景。

---

## 一、为什么用 VueUse

### 1.1 痛点

```ts
// 不用 VueUse：手写监听窗口大小
import { ref, onMounted, onUnmounted } from 'vue';

const width = ref(window.innerWidth);
function update() { width.value = window.innerWidth; }
onMounted(() => window.addEventListener('resize', update));
onUnmounted(() => window.removeEventListener('resize', update));
```

```ts
// 用 VueUse：一行搞定
import { useWindowSize } from '@vueuse/core';
const { width, height } = useWindowSize();
```

### 1.2 优势

- ✅ **开箱即用**：200+ 常用 composables
- ✅ **类型完善**：原生 TypeScript
- ✅ **Tree Shaking**：按需引入
- ✅ **无依赖**：仅依赖 Vue
- ✅ **可移植**：可在 SSR / Node 中使用
- ✅ **活跃维护**：Vue 团队成员维护

---

## 二、安装与导入

```bash
npm install @vueuse/core
npm install @vueuse/components  # 可选：组件版本
npm install @vueuse/integrations  # 可选：第三方集成
```

```ts
import { useMouse, useLocalStorage } from '@vueuse/core';
```

---

## 三、常用工具分类

### 3.1 浏览器 API

| Composable          | 说明                          |
| ------------------- | ----------------------------- |
| `useWindowSize`     | 窗口大小                       |
| `useMouse`          | 鼠标位置                       |
| `useMouseInElement` | 鼠标在元素内位置               |
| `useEventListener`  | 事件监听（自动清理）           |
| `useScroll`         | 滚动状态                       |
| `useIntersectionObserver` | 元素可见性              |
| `useLocalStorage`   | localStorage 响应式            |
| `useSessionStorage` | sessionStorage 响应式          |
| `useStorage`        | 通用存储                       |
| `useClipboard`      | 剪贴板                         |
| `usePermission`     | 浏览器权限                     |
| `useFavicon`        | 修改 favicon                   |
| `useTitle`          | 修改标题                       |
| `useFullscreen`     | 全屏                           |
| `useDark`           | 暗色模式                       |
| `usePreferredDark`  | 系统暗色模式偏好               |
| `useMediaQuery`     | 媒体查询                       |
| `useBreakpoints`    | 断点                           |
| `useNetwork`        | 网络状态                       |
| `useOnline`         | 在线状态                       |
| `useDocumentVisibility` | 页面可见性                |

```ts
import { useMouse, useLocalStorage, useEventListener } from '@vueuse/core';

const { x, y } = useMouse();

const token = useLocalStorage('token', '');

useEventListener(window, 'scroll', () => {
  console.log('scroll');
});
```

### 3.2 传感器

| Composable            | 说明                          |
| --------------------- | ----------------------------- |
| `useDeviceMotion`     | 设备加速度                     |
| `useDeviceOrientation` | 设备方向                     |
| `useGeolocation`      | 地理位置                       |
| `useBattery`          | 电池状态                       |
| `useNetwork`          | 网络信息                       |
| `usePointerLock`      | 鼠标锁定                       |
| `useSpeechRecognition` | 语音识别                    |
| `useSpeechSynthesis`  | 语音合成                       |

```ts
import { useBattery } from '@vueuse/core';
const { charging, level, chargingTime, dischargingTime } = useBattery();
```

### 3.3 动画与过渡

| Composable        | 说明                          |
| ----------------- | ----------------------------- |
| `useTransition`   | 响应式过渡动画                |
| `useRafFn`        | requestAnimationFrame         |
| `useIntervalFn`   | 定时器                         |
| `useTimeoutFn`    | 延时器                         |
| `useNow`          | 当前时间                       |
| `useDateFormat`   | 日期格式化                     |
| `useTimeAgo`      | "3 分钟前"                     |

```ts
import { useTransition } from '@vueuse/core';

const input = ref(0);
const output = useTransition(input, {
  duration: 1000,
});
```

### 3.4 响应式工具

| Composable         | 说明                          |
| ------------------ | ----------------------------- |
| `toRef`            | reactive 属性转 ref            |
| `toRefs`           | 全部转 ref                     |
| `reactiveOmit`     | 排除指定属性                   |
| `reactivePick`     | 挑选指定属性                   |
| `useDebounce`      | 防抖 ref                       |
| `useDebounceFn`    | 防抖函数                       |
| `useThrottle`      | 节流 ref                       |
| `useThrottleFn`    | 节流函数                       |
| `refDebounced`     | ref 防抖                       |
| `whenever`         | 条件为真时执行                 |
| `useTimeoutPoll`   | 定时轮询                       |
| `useInterval`      | 定时器                         |

```ts
import { useDebounceFn, useThrottleFn } from '@vueuse/core';

const debouncedFn = useDebounceFn((text) => {
  console.log('搜索:', text);
}, 300);

const throttledFn = useThrottleFn(() => {
  console.log('滚动');
}, 100);
```

### 3.5 状态管理

| Composable            | 说明                          |
| --------------------- | ----------------------------- |
| `useStorage`          | 通用存储                       |
| `useLocalStorage`     | localStorage                  |
| `useSessionStorage`   | sessionStorage                |
| `useStorageAsync`     | 异步存储                       |
| `useMemoize`          | 函数缓存                       |
| `useManualRefHistory` | 手动快照                      |
| `useRefHistory`       | ref 历史记录                   |
| `useDebouncedRefHistory` | 防抖历史                   |

```ts
import { useRefHistory } from '@vueuse/core';

const state = ref(0);
const { history, undo, redo, canUndo, canRedo } = useRefHistory(state);
```

### 3.6 网络请求

| Composable            | 说明                          |
| --------------------- | ----------------------------- |
| `useFetch`            | fetch 包装                    |
| `useEventSource`      | EventSource (SSE)            |
| `useWebSocket`        | WebSocket                     |
| `useShare`            | 分享 API                      |
| `usePermission`       | 权限请求                       |

```ts
import { useFetch } from '@vueuse/core';

const { data, error, isFetching } = useFetch('/api/users').json();
```

---

## 四、实战案例

### 4.1 防抖搜索

```vue
<script setup>
import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const keyword = ref('');
const results = ref([]);

const search = useDebounceFn(async () => {
  if (!keyword.value) return;
  const res = await fetch(`/api/search?q=${keyword.value}`);
  results.value = await res.json();
}, 300);

watch(keyword, search);
</script>

<template>
  <input v-model="keyword" placeholder="搜索..." />
  <ul>
    <li v-for="r in results" :key="r.id">{{ r.name }}</li>
  </ul>
</template>
```

### 4.2 IntersectionObserver 懒加载

```vue
<script setup>
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

const target = ref(null);
const isVisible = ref(false);

const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    isVisible.value = isIntersecting;
    if (isIntersecting) stop(); // 只触发一次
  },
  { threshold: 0.5 }
);
</script>

<template>
  <div ref="target" v-if="isVisible">
    可见时加载内容
  </div>
</template>
```

### 4.3 暗色模式切换

```vue
<script setup>
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <button @click="toggleDark()">
    {{ isDark ? '🌙' : '☀️' }}
  </button>
</template>
```

### 4.4 localStorage 同步

```vue
<script setup>
import { useLocalStorage } from '@vueuse/core';

const settings = useLocalStorage('settings', {
  theme: 'light',
  language: 'zh-CN',
  notifications: true,
});
// 修改自动同步到 localStorage
settings.value.theme = 'dark';
</script>
```

### 4.5 网络状态感知

```vue
<script setup>
import { useNetwork, useOnline } from '@vueuse/core';

const { isOnline, offlineAt, downlink, effectiveType } = useNetwork();
const online = useOnline();
</script>

<template>
  <div v-if="!online" class="offline-banner">⚠️ 网络断开</div>
  <p>当前网络：{{ effectiveType }} ({{ downlink }}Mbps)</p>
</template>
```

### 4.6 组合多个工具

```vue
<script setup>
import { useMouse, useWindowSize } from '@vueuse/core';
import { computed } from 'vue';

const { x, y } = useMouse();
const { width, height } = useWindowSize();

const relativeX = computed(() => x.value / width.value);
const relativeY = computed(() => y.value / height.value);
</script>
```

---

## 五、进阶用法

### 5.1 响应式系统

```ts
import { whenever, watchOnce } from '@vueuse/core';

// 条件为真时执行
whenever(isLoggedIn, () => {
  fetchUserInfo();
});

// 只监听一次
watchOnce(count, () => {
  console.log('count 第一次变化');
});
```

### 5.2 可暂停的 watch

```ts
import { pausableWatch } from '@vueuse/core';

const { stop, pause, resume } = pausableWatch(count, (newVal) => {
  console.log(newVal);
});

pause();   // 暂停监听
resume();  // 恢复监听
```

### 5.3 asyncComputed

```ts
import { asyncComputed } from '@vueuse/core';

const data = asyncComputed(async () => {
  const res = await fetch('/api/data');
  return res.json();
}, null);

// 模板中 data 自动更新
```

### 5.4 组件版本

```vue
<script setup>
import { UseMouse } from '@vueuse/components';
</script>

<template>
  <UseMouse v-slot="{ x, y }">
    鼠标位置：{{ x }}, {{ y }}
  </UseMouse>
</template>
```

---

## 六、集成第三方

```ts
// 集成 axios
import { useAxios } from '@vueuse/integrations/useAxios';
import axios from 'axios';

const { data, error, isLoading, abort } = useAxios('/api/users', {
  method: 'GET',
});
```

```ts
// 集成 Fuse.js
import { useFuse } from '@vueuse/integrations/useFuse';
const { results } = useFuse(search, list);
```

```ts
// 集成 Qrcode
import { useQRCode } from '@vueuse/integrations/useQRCode';
const qrcode = useQRCode('https://example.com');
```

---

## 七、性能与优化

### 7.1 选择性启用

```ts
// Tree Shaking：只导入用到的
import { useMouse } from '@vueuse/core';
// 而非 import * as VueUse from '@vueuse/core';
```

### 7.2 事件清理

VueUse 自动处理事件清理，无需手动 `removeEventListener`：

```ts
useEventListener(window, 'scroll', handler); // 组件卸载时自动移除
```

### 7.3 注意 SSR

部分 API 仅在浏览器可用，SSR 时需条件引入：

```ts
if (import.meta.client) {
  const { useMouse } = await import('@vueuse/core');
}
```

---

## 八、学习建议

1. **常用 API**：useMouse、useEventListener、useStorage、useDark 是日常必备
2. **工具函数**：useDebounceFn、useThrottleFn 替代手写防抖节流
3. **组合使用**：多个 composable 组合能解决复杂场景
4. **查文档**：200+ API 不必全记，[文档](https://vueuse.org/) 是最佳参考

---

## 参考

- [VueUse 官方文档](https://vueuse.org/)
- [VueUse 函数列表](https://vueuse.org/functions.html)
