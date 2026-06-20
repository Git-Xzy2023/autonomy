---
title: "手写一个简单的 Plugin"
---

# 手写一个简单的 Plugin

**核心考察点**：对 Webpack 插件生命周期是否熟悉。

Plugin 就是一个带 `apply(compiler)` 方法的对象。通过 `compiler.hooks.xxxx.tap` 来订阅事件。

```js
// my-plugin.js
class MyPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    // emit 钩子：输出 assets 到 output 目录前触发
    compiler.hooks.emit.tapAsync("MyPlugin", (compilation, callback) => {
      // 在产物里新增一个文件
      compilation.assets["version.txt"] = {
        source: () => `version: ${this.options.version}`,
        size: () => this.options.version.length,
      };
      callback();
    });

    // 其他常用钩子：
    // compiler.hooks.done.tap(...)      构建完成
    // compiler.hooks.compilation.tap(...) 每次 compilation 创建时
    // compilation.hooks.optimizeChunkAssets.tapAsync(...) 处理 chunk 产物
  }
}
module.exports = MyPlugin;
```
