import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Autonomy",
  description: "A VitePress Site",
  // header标签里面插入的内容
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  // 将base属性移到这里（顶层配置）     // 部署的时候需要注意该参数避免样式丢失
  base: "/autonomy/",
  themeConfig: {
    // 网站的logo
    logo: "/logo.svg",
    // 文章右侧大纲目录
    outline: {
      level: [2, 6],
      label: "目录",
    },
    //自定义上下页名
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // 主题
    darkModeSwitchLabel: "深浅模式",
    // 返回顶部label
    returnToTopLabel: "返回顶部",
    // 搜索
    search: {
      provider: "local",
    },
    // 页脚
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2023-present China Carlos",
    },
    // 文档的最后更新时间
    lastUpdated: {
    text: "Updated at",
    formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
    nav: [
      { text: "Home", link: "/" },
      // 前端学习分类（URL包含/learning前缀）
      { 
        text: "前端学习",
        items: [
          { text: "JavaScript", link: "/learning/JavaScript/JS-proxy" },  // 添加/learning前缀
          { text: "TypeScript", link: "/learning/TypeScript/TS-base" }   // 添加/learning前缀
        ]
      },
      // 前端面试分类（保持原有URL结构）
      { 
        text: "前端面试",
        items: [
          { text: "JavaScript", link: "/interview/JavaScript/111" },
          { text: "TypeScript", link: "/interview/TypeScript/222" }
        ]
      }
    ],

    // 将sidebar从数组改为对象形式，实现路径匹配
    sidebar: {
      // 前端学习-JavaScript分类
      '/learning/JavaScript/': [
        {
          text: 'JavaScript',
          items: [
            { text: '深度学习 Proxy', link: '/learning/JavaScript/JS-proxy' }, // 相对路径
            // 可添加其他JavaScript文档
            // { text: 'Promise详解', link: 'JS-promise' }
          ]
        }
      ],
      
      // 前端学习-TypeScript分类
      '/learning/TypeScript/': [
        {
          text: 'TypeScript',
          items: [
            { text: 'TypeScript 基础', link: '/learning/TypeScript/TS-base' }, // 修正为learning路径
            { text: 'TypeScript 进阶', link: '/learning/TypeScript/TS-advance' }
          ]
        }
      ],
      
      // 前端面试分类
      '/interview/JavaScript/': [
        {
          text: 'JavaScript',
          items: [
            { text: 'JavaScript', link: '/interview/JavaScript/111' },
          ]
        }
      ],
      '/interview/TypeScript/': [
        {
          text: 'TypeScript',
          items: [
            { text: 'TypeScript', link: '/interview/TypeScript/222' },
          ]
        }
      ],
      
      // 默认侧边栏（根路径）
      '/': [
        { text: '首页', link: '/' },
        { text: 'API 示例', link: 'api-examples' },
        { text: 'Markdown 示例', link: 'markdown-examples' }
      ]
    },
    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/ChinaCarlos" }],

  },
});
