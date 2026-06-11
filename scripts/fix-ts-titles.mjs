import fs from 'fs';
import path from 'path';

const baseDir = '/Users/qijie/Desktop/徐志远/autonomy/docs/interview/frontend';
const sidebarPath = '/Users/qijie/Desktop/徐志远/autonomy/docs/.vitepress/sidebar.mts';

const modules = [
  { name: 'network', title: '网络面试题' },
  { name: 'browser', title: '浏览器渲染面试题' },
  { name: 'css', title: 'CSS面试题' },
  { name: 'javascript', title: 'JavaScript面试题' },
  { name: 'es', title: 'ES新特性面试题' },
  { name: 'typescript', title: 'TypeScript面试题' },
  { name: 'vue', title: 'Vue面试题' },
  { name: 'nodejs', title: 'Node.js面试题' },
];

function extractTitle(content, filename) {
  const fmMatch = content.match(/^title:\s*"?(.+?)"?\s*$/m);
  if (fmMatch) return fmMatch[1].replace(/^"|"$/g, '');
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  return filename.replace('.md', '');
}

const sidebarEntries = {};
modules.forEach(mod => {
  const dir = path.join(baseDir, mod.name);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => {
      if (a === 'index.md') return -1;
      if (b === 'index.md') return 1;
      return a.localeCompare(b);
    });

  const items = files.map((file, idx) => {
    const fileContent = fs.readFileSync(path.join(dir, file), 'utf-8');
    const title = extractTitle(fileContent, file);
    const slug = file.replace('.md', '');
    const link = file === 'index.md'
      ? `/interview/frontend/${mod.name}/`
      : `/interview/frontend/${mod.name}/${slug}`;
    return `        { text: "${idx + 1}. ${title}", link: "${link}" },`;
  });

  sidebarEntries[mod.name] = items;
});

const output = `export default {
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
        { text: "网络", link: "/interview/frontend/network/" },
        { text: "浏览器渲染", link: "/interview/frontend/browser/" },
        { text: "CSS", link: "/interview/frontend/css/" },
        { text: "JavaScript", link: "/interview/frontend/javascript/" },
        { text: "ES 新特性", link: "/interview/frontend/es/" },
        { text: "TypeScript", link: "/interview/frontend/typescript/" },
        { text: "Vue", link: "/interview/frontend/vue/" },
        { text: "React", link: "/interview/frontend/react" },
        { text: "Node.js", link: "/interview/frontend/nodejs/" },
        { text: "工程化", link: "/interview/frontend/engineering" },
      ],
    },
  ],

  // 面试题-网络
  "/interview/frontend/network/": [
    {
      text: "网络面试题",
      items: [
${sidebarEntries['network'].join('\n')}
      ],
    },
  ],

  // 面试题-浏览器渲染
  "/interview/frontend/browser/": [
    {
      text: "浏览器渲染面试题",
      items: [
${sidebarEntries['browser'].join('\n')}
      ],
    },
  ],

  // 面试题-CSS
  "/interview/frontend/css/": [
    {
      text: "CSS面试题",
      items: [
${sidebarEntries['css'].join('\n')}
      ],
    },
  ],

  // 面试题-JavaScript
  "/interview/frontend/javascript/": [
    {
      text: "JavaScript面试题",
      items: [
${sidebarEntries['javascript'].join('\n')}
      ],
    },
  ],

  // 面试题-ES新特性
  "/interview/frontend/es/": [
    {
      text: "ES新特性面试题",
      items: [
${sidebarEntries['es'].join('\n')}
      ],
    },
  ],

  // 面试题-TypeScript
  "/interview/frontend/typescript/": [
    {
      text: "TypeScript面试题",
      items: [
${sidebarEntries['typescript'].join('\n')}
      ],
    },
  ],

  // 面试题-Vue
  "/interview/frontend/vue/": [
    {
      text: "Vue面试题",
      items: [
${sidebarEntries['vue'].join('\n')}
      ],
    },
  ],

  // 面试题-Node.js
  "/interview/frontend/nodejs/": [
    {
      text: "Node.js面试题",
      items: [
${sidebarEntries['nodejs'].join('\n')}
      ],
    },
  ],

  // 前端学习-首页
  "/learn/frontend/": [
    {
      text: "前端学习",
      items: [
        { text: "HTML", link: "/learn/frontend/" },
      ],
    },
  ],
};
`;

fs.writeFileSync(sidebarPath, output, 'utf-8');
console.log('Done!');
