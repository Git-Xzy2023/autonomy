---
title: "路径处理：path 模块"
---

# 路径处理：path 模块

```js
const path = require("path");

path.join("/a", "b", "..", "c"); // '/a/c'  按平台拼接
path.resolve("a", "b", "/c"); // '/c'    从右往左找到第一个绝对路径
path.basename("/a/b/c.txt", ".txt"); // 'c'
path.dirname("/a/b/c.txt"); // '/a/b'
path.extname("/a/b/c.txt"); // '.txt'
path.parse("/a/b/c.txt"); // { root, dir, base, ext, name }
path.isAbsolute("/a"); // true
path.relative("/a/b", "/a/c/d"); // '../c/d'

// 重要：__dirname 是当前文件目录，用 path.join(__dirname, '../static') 才跨平台安全
```
