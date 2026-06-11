export default {
  // 面试题-首页
  "/interview/": [
    {
      text: "面试题",
      items: [
        { text: "前端面试题", link: "/interview/frontend/" },
        { text: "Java 面试题", link: "/interview/" },
        { text: "Python 面试题", link: "/interview/" },
        { text: "Go 面试题", link: "/interview/" },
      ],
    },
  ],

  // 面试题-前端面试题
  "/interview/frontend/": [
    {
      text: "前端面试题",
      items: [
        { text: "网络", link: "/interview/frontend/network" },
        { text: "浏览器渲染", link: "/interview/frontend/browser" },
        { text: "CSS", link: "/interview/frontend/css" },
        { text: "JavaScript", link: "/interview/frontend/javascript" },
        { text: "TypeScript", link: "/interview/frontend/typescript" },
        { text: "Vue", link: "/interview/frontend/vue" },
        { text: "React", link: "/interview/frontend/react" },
        { text: "Node.js", link: "/interview/frontend/nodejs" },
        { text: "工程化", link: "/interview/frontend/engineering" },
      ],
    },
  ],
  // 前端学习-首页
  "/web/": [
    {
      text: "前端学习",
      items: [
        { text: "样式相关", link: "/web/styles/" },
        { text: "JavaScript 相关", link: "/web/javascript/" },
        { text: "浏览器相关", link: "/web/browser/" },
        { text: "网络相关", link: "/web/network/" },
        { text: "Vue 生态", link: "/web/vue-ecosystem/" },
        { text: "React 生态", link: "/web/react-ecosystem/" },
        { text: "工程化相关", link: "/web/engineering/" },
        { text: "Node.js 相关", link: "/web/nodejs/" },
        { text: "桌面端", link: "/web/desktop/" },
        { text: "Git", link: "/web/git/" },
        { text: "H5", link: "/web/h5/" },
        { text: "小程序", link: "/web/miniprogram/" },
        { text: "功能架构相关", link: "/web/architecture/" },
      ],
    },
  ],

  // 前端学习-样式相关
  "/web/styles/": [
    { text: "📖 样式技术学习指南", link: "/web/styles/" },
    {
      text: "📘 CSS",
      items: [
        { text: "CSS 基础", link: "/web/styles/css/01-basics/" },
        { text: "选择器", link: "/web/styles/css/02-selectors/" },
        { text: "盒模型", link: "/web/styles/css/03-box-model/" },
        { text: "布局", link: "/web/styles/css/04-layout/" },
        { text: "响应式设计", link: "/web/styles/css/05-responsive/" },
        { text: "动画和过渡", link: "/web/styles/css/06-animation/" },
        { text: "预处理器", link: "/web/styles/css/07-preprocessor/" },
        { text: "最佳实践", link: "/web/styles/css/08-best-practices/" },
      ],
    },
    {
      text: "💅 Sass",
      items: [{ text: "Sass 入门", link: "/web/styles/sass/" }],
    },
    {
      text: "🎯 Less",
      items: [{ text: "Less 入门", link: "/web/styles/less/" }],
    },
    {
      text: "🌪️ Tailwind CSS",
      items: [{ text: "Tailwind 入门", link: "/web/styles/tailwind/" }],
    },
  ],

  // 前端学习-JavaScript 相关
  "/web/JavaScript/": [
    { text: "📖 JavaScript 技术学习指南", link: "/web/JavaScript/" },
    {
      text: "📜 JavaScript",
      items: [
        { text: "JS 基础", link: "/web/JavaScript/javascript/01-basics/" },
        {
          text: "函数与作用域",
          link: "/web/JavaScript/javascript/02-functions/",
        },
        { text: "对象与原型", link: "/web/JavaScript/javascript/03-objects/" },
        { text: "异步编程", link: "/web/JavaScript/javascript/04-async/" },
        {
          text: "数组方法与高阶函数",
          link: "/web/JavaScript/javascript/06-arrays/",
        },
        { text: "模块化", link: "/web/JavaScript/javascript/07-modules/" },
        {
          text: "最佳实践",
          link: "/web/JavaScript/javascript/08-best-practices/",
        },
      ],
    },
    {
      text: "📘 TypeScript",
      items: [
        { text: "TS 基础", link: "/web/JavaScript/typescript/01-basics/" },
        { text: "类型系统", link: "/web/JavaScript/typescript/02-types/" },
        { text: "高级特性", link: "/web/JavaScript/typescript/03-advanced/" },
        {
          text: "最佳实践",
          link: "/web/JavaScript/typescript/04-best-practices/",
        },
      ],
    },
    {
      text: "✨ ES6+",
      items: [
        { text: "ES6 核心特性", link: "/web/JavaScript/es6/01-core/" },
        { text: "ES7-ES13 新特性", link: "/web/JavaScript/es6/02-modern/" },
        { text: "内置对象扩展", link: "/web/JavaScript/es6/03-builtins/" },
        { text: "实战应用", link: "/web/JavaScript/es6/04-practice/" },
      ],
    },
    {
      text: "🔧 进阶",
      items: [{ text: "深度学习 Proxy", link: "/web/JavaScript/JS-proxy" }],
    },
  ],

  // 前端学习-浏览器相关
  "/web/browser/": [
    {
      text: "浏览器相关",
      items: [
        { text: "浏览器原理", link: "/web/browser/01-principle/" },
        { text: "Web API", link: "/web/browser/02-web-api/" },
        { text: "性能优化", link: "/web/browser/03-performance/" },
        { text: "浏览器存储", link: "/web/browser/04-storage/" },
      ],
    },
  ],

  // 前端学习-网络相关
  "/web/network/": [
    {
      text: "网络相关",
      items: [],
    },
  ],

  // 前端学习-Vue 生态
  "/web/vue-ecosystem/": [
    {
      text: "Vue 生态",
      items: [{ text: "Vue.js", link: "/web/vue/" }],
    },
  ],

  // 前端学习-React 生态
  "/web/react-ecosystem/": [
    {
      text: "React 生态",
      items: [{ text: "React", link: "/web/react/" }],
    },
  ],

  // 前端学习-工程化相关
  "/web/engineering/": [
    {
      text: "工程化相关",
      items: [
        { text: "Webpack", link: "/web/engineering/01-webpack/" },
        { text: "Vite", link: "/web/engineering/02-vite/" },
        { text: "Rollup", link: "/web/engineering/03-rollup/" },
        { text: "包管理器", link: "/web/engineering/04-package-manager/" },
        { text: "CI/CD", link: "/web/engineering/05-ci-cd/" },
        { text: "代码规范与工具链", link: "/web/engineering/06-code-quality/" },
      ],
    },
  ],

  // 前端学习-Node.js 相关
  "/web/nodejs/": [
    {
      text: "Node.js 相关",
      items: [{ text: "Node.js", link: "/web/node/" }],
    },
  ],

  // 前端学习-桌面端
  "/web/desktop/": [
    {
      text: "桌面端",
      items: [],
    },
  ],

  // 前端学习-Git
  "/web/git/": [
    {
      text: "Git",
      items: [],
    },
  ],

  // 前端学习-H5
  "/web/h5/": [
    {
      text: "H5",
      items: [],
    },
  ],

  // 前端学习-小程序
  "/web/miniprogram/": [
    {
      text: "小程序",
      items: [],
    },
  ],

  // 前端学习-功能架构相关
  "/web/architecture/": [
    {
      text: "功能架构相关",
      items: [],
    },
  ],

  // Java 学习-首页
  "/java/": [
    {
      text: "Java 学习",
      items: [
        { text: "Java 基础", link: "/java/basic/" },
        { text: "Spring", link: "/java/spring/" },
        { text: "Spring Boot", link: "/java/springboot/" },
        { text: "MyBatis", link: "/java/mybatis/" },
        { text: "数据库", link: "/java/database/" },
        { text: "微服务", link: "/java/microservice/" },
      ],
    },
  ],

  // Python 学习-首页
  "/python/": [
    {
      text: "Python 学习",
      items: [
        { text: "Python 基础", link: "/python/basic/" },
        { text: "数据科学", link: "/python/datascience/" },
        { text: "机器学习", link: "/python/ml/" },
        { text: "Web 开发", link: "/python/web/" },
        { text: "自动化脚本", link: "/python/automation/" },
      ],
    },
  ],

  // Go 学习-首页
  "/go/": [
    {
      text: "Go 学习",
      items: [
        { text: "Go 基础", link: "/go/basic/" },
        { text: "并发编程", link: "/go/concurrency/" },
        { text: "Web 开发", link: "/go/web/" },
        { text: "高性能服务", link: "/go/highperformance/" },
      ],
    },
  ],

  // 英语学习-首页
  "/english/": [
    {
      text: "英语学习",
      items: [
        { text: "词汇", link: "/english/vocabulary/" },
        { text: "语法", link: "/english/grammar/" },
        { text: "阅读", link: "/english/reading/" },
        { text: "听力", link: "/english/listening/" },
      ],
    },
  ],

  // 诗词学习-首页
  "/poetry/": [
    {
      text: "诗词学习",
      items: [
        { text: "唐诗", link: "/poetry/tang/" },
        { text: "宋词", link: "/poetry/song/" },
        { text: "元曲", link: "/poetry/yuan/" },
        { text: "现代诗", link: "/poetry/modern/" },
      ],
    },
  ],

  // 前端学习-Node.js分类
  "/web/node/": [
    {
      text: "Node.js",
      items: [{ text: "Node.js 学习", link: "/web/node/" }],
    },
  ],

  // 前端学习-Vue.js分类
  "/web/vue/": [
    {
      text: "Vue.js",
      items: [{ text: "Vue.js 学习", link: "/web/vue/" }],
    },
  ],

  // 前端学习-React分类
  "/web/react/": [
    {
      text: "React",
      items: [{ text: "React 学习", link: "/web/react/" }],
    },
  ],

  // 前端学习-Webpack分类
  "/web/webpack/": [
    {
      text: "Webpack",
      items: [{ text: "Webpack 学习", link: "/web/webpack/" }],
    },
  ],

  // 前端学习-Vite分类
  "/web/vite/": [
    {
      text: "Vite",
      items: [{ text: "Vite 学习", link: "/web/vite/" }],
    },
  ],

  // 前端学习-HTML分类
  "/web/html/": [
    {
      text: "HTML",
      items: [{ text: "HTML 学习", link: "/web/html/" }],
    },
  ],

  // 前端面试分类
  "/interview/JavaScript/": [
    {
      text: "JavaScript",
      items: [{ text: "JavaScript", link: "/interview/JavaScript/111" }],
    },
  ],
  "/interview/TypeScript/": [
    {
      text: "TypeScript",
      items: [{ text: "TypeScript", link: "/interview/TypeScript/222" }],
    },
  ],

  // Java 分类
  "/java/basic/": [
    {
      text: "Java 基础",
      items: [{ text: "Java 基础学习", link: "/java/basic/" }],
    },
  ],
  "/java/spring/": [
    {
      text: "Spring",
      items: [{ text: "Spring 学习", link: "/java/spring/" }],
    },
  ],
  "/java/springboot/": [
    {
      text: "Spring Boot",
      items: [{ text: "Spring Boot 学习", link: "/java/springboot/" }],
    },
  ],
  "/java/mybatis/": [
    {
      text: "MyBatis",
      items: [{ text: "MyBatis 学习", link: "/java/mybatis/" }],
    },
  ],
  "/java/database/": [
    {
      text: "数据库",
      items: [{ text: "数据库学习", link: "/java/database/" }],
    },
  ],
  "/java/microservice/": [
    {
      text: "微服务",
      items: [{ text: "微服务学习", link: "/java/microservice/" }],
    },
  ],

  // Python 分类
  "/python/basic/": [
    {
      text: "Python 基础",
      items: [{ text: "Python 基础学习", link: "/python/basic/" }],
    },
  ],
  "/python/datascience/": [
    {
      text: "数据科学",
      items: [{ text: "数据科学学习", link: "/python/datascience/" }],
    },
  ],
  "/python/ml/": [
    {
      text: "机器学习",
      items: [{ text: "机器学习学习", link: "/python/ml/" }],
    },
  ],
  "/python/web/": [
    {
      text: "Web 开发",
      items: [{ text: "Web 开发学习", link: "/python/web/" }],
    },
  ],
  "/python/automation/": [
    {
      text: "自动化脚本",
      items: [{ text: "自动化脚本学习", link: "/python/automation/" }],
    },
  ],

  // Go 分类
  "/go/basic/": [
    {
      text: "Go 基础",
      items: [{ text: "Go 基础学习", link: "/go/basic/" }],
    },
  ],
  "/go/concurrency/": [
    {
      text: "并发编程",
      items: [{ text: "并发编程学习", link: "/go/concurrency/" }],
    },
  ],
  "/go/web/": [
    {
      text: "Web 开发",
      items: [{ text: "Web 开发学习", link: "/go/web/" }],
    },
  ],
  "/go/highperformance/": [
    {
      text: "高性能服务",
      items: [{ text: "高性能服务学习", link: "/go/highperformance/" }],
    },
  ],

  // 英语分类
  "/english/vocabulary/": [
    {
      text: "词汇",
      items: [{ text: "词汇学习", link: "/english/vocabulary/" }],
    },
  ],
  "/english/grammar/": [
    {
      text: "语法",
      items: [{ text: "语法学习", link: "/english/grammar/" }],
    },
  ],
  "/english/reading/": [
    {
      text: "阅读",
      items: [{ text: "阅读学习", link: "/english/reading/" }],
    },
  ],
  "/english/listening/": [
    {
      text: "听力",
      items: [{ text: "听力学习", link: "/english/listening/" }],
    },
  ],

  // 诗词分类
  "/poetry/tang/": [
    {
      text: "唐诗",
      items: [{ text: "唐诗学习", link: "/poetry/tang/" }],
    },
  ],
  "/poetry/song/": [
    {
      text: "宋词",
      items: [{ text: "宋词学习", link: "/poetry/song/" }],
    },
  ],
  "/poetry/yuan/": [
    {
      text: "元曲",
      items: [{ text: "元曲学习", link: "/poetry/yuan/" }],
    },
  ],
  "/poetry/modern/": [
    {
      text: "现代诗",
      items: [{ text: "现代诗学习", link: "/poetry/modern/" }],
    },
  ],

  // 默认侧边栏（根路径）
  "/": [
    { text: "首页", link: "/" },
    { text: "API 示例", link: "api-examples" },
    { text: "Markdown 示例", link: "markdown-examples" },
  ],
};
