export default  [
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
  ]