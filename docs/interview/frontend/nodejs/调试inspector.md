---
title: "调试：inspector"
---

# 调试：inspector

```bash
node --inspect app.js            # 启动 inspector，默认 127.0.0.1:9229
node --inspect-brk app.js        # 在第一行断点
```

然后在 Chrome 打开 `chrome://inspect`，或用 VS Code 「Attach to Node Process」。
