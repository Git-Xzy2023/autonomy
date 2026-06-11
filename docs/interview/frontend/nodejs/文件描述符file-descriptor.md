---
title: "文件描述符（File Descriptor）"
---

# 文件描述符（File Descriptor）

Unix 哲学「一切皆文件」。每个打开的文件/套接字都对应一个非负整数 fd。用完必须关，否则会耗尽文件句柄。

```js
fs.open("file.txt", "r", (err, fd) => {
  if (err) throw err;
  fs.read(fd, Buffer.alloc(1024), 0, 1024, 0, (err, bytesRead, buf) => {
    // ...
    fs.close(fd, () => {}); // 必须关闭
  });
});
```
