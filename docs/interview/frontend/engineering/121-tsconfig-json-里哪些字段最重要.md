---
title: "tsconfig.json 里哪些字段最重要？"
---

# tsconfig.json 里哪些字段最重要？

**常见"工程化必用"字段**：

```jsonc
{
  "compilerOptions": {
    "target": "ES2020", // 输出语言版本
    "module": "ESNext", // 模块系统
    "moduleResolution": "bundler", // 模块解析方式
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true, // 所有严格检查
    "noUnusedLocals": true, // 未使用的局部变量报错
    "noUnusedParameters": true, // 未使用的函数参数报错
    "noImplicitReturns": true, // 所有代码路径必须有返回
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx", // React 17+ JSX 转换
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true, // 跳过声明文件检查，加快速度
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true, // 每个文件都是独立模块（和 esbuild 配合）
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "outDir": "dist",
    "declaration": true, // 输出 .d.ts
    "declarationMap": true, // 声明文件的 sourcemap，IDE 跳转用
    "sourceMap": true,
    "types": ["vite/client", "node"], // 声明哪些全局类型可用
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
}
```

**工程化实践**：多个 tsconfig 通过 `extends` 继承（tsconfig.base.json + tsconfig.app.json + tsconfig.node.json）。Vite 项目默认就这么组织。
