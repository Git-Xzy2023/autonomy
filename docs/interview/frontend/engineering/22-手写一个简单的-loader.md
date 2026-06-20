---
title: "手写一个简单的 Loader"
---

# 手写一个简单的 Loader

**核心考察点**：对 Loader API 是否熟悉。

```js
// my-loader.js
// Loader 是一个接收源码、返回（或回调）新源码 + sourcemap 的函数
module.exports = function (source, sourceMap, meta) {
  // this 是 loader context，有各种 API：
  // this.query / this.getOptions()  —— 拿到配置
  // this.callback(err, content, sourceMap, meta)  —— 异步返回
  // this.async()                     —— 声明异步
  // this.emitFile(path, content)     —— 写文件

  // 简单例子：把源码中的 'FOO' 替换成 'bar'
  const result = source.replace(/FOO/g, "bar");

  // 同步返回
  return result;
  // 或 this.callback(null, result, sourceMap, meta);
};

// 使用：{ test: /\.js$/, loader: path.resolve('./my-loader.js') }
```
