export default {
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
  }