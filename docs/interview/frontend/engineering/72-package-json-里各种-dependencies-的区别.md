---
title: "dependencies / devDependencies / peerDependencies / optionalDependencies 有什么区别？"
---

# dependencies / devDependencies / peerDependencies / optionalDependencies 有什么区别？

**核心考察点**：对依赖语义是否清晰。

| 字段                   | 含义                   | 是否被安装到最终项目                    | 典型使用                          |
| ---------------------- | ---------------------- | --------------------------------------- | --------------------------------- |
| `dependencies`         | 运行时必需             | 是                                      | 业务代码里真正 import 的库        |
| `devDependencies`      | 开发/构建时使用        | 否（库的消费者不会安装）                | webpack、vite、jest、eslint、tsc  |
| `peerDependencies`     | **由宿主环境提供**     | 不自动安装（npm 7+ 会自动装但仍有警告） | UI 库依赖 react/vue，插件依赖主库 |
| `optionalDependencies` | 可选，安装失败不会中断 | 是（如果能装上）                        | 某些可选的原生模块、性能增强库    |

**peerDependencies 的例子**：

```json
// 一个 UI 组件库的 package.json
{
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  }
}
```

意思是"**请使用这个库的项目自己安装 React**"，库本身不会把 React 打进 bundle。
