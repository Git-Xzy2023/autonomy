---
title: "request / response 对象"
---

# request / response 对象

- **request**：`method`、`url`、`headers`（小写）、`httpVersion`、可读流 body、`socket`
- **response**：`statusCode`、`setHeader(name, val)`、`writeHead(code, headers)`、`write(chunk)`、`end(chunk)`、可写流
