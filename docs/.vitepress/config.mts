import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";
import nav from "./nav.mts";
import sidebar from './sidebar.mts'
const vitepressSidebarOptions = { 
  documentRootPath: "/docs", 
  collapsed: false, //折叠组关闭 
  collapseDepth: 1, //折叠组2级菜单 
  removePrefixAfterOrdering: true, //删除前缀，必须与prefixSeparator一起使用
  prefixSeparator: "_", //删除前缀的符号
}; 
export default defineConfig({
  title: "Autonomy",
  description: "A VitePress Site",
  // header标签里面插入的内容
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  // 将base属性移到这里（顶层配置）     // 部署的时候需要注意该参数避免样式丢失
  base: "/autonomy/",
  themeConfig: {
    // 网站的logo
    logo: "/logo.jpg",
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
    nav,
    // 将sidebar从数组改为对象形式，实现路径匹配
    // sidebar: generateSidebar(vitepressSidebarOptions), 
    sidebar,
    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/ChinaCarlos" }],

  },
});
