# Algorithm-Visualizer · 让算法“动”起来

[English](#english) | [中文](#中文)

---

<a name="中文"></a>
## 项目简介
Algorithm-Visualizer 是一款轻量级、可交互的**算法可视化学习平台**。  
无需安装，打开浏览器即可直观理解排序、搜索、图论等经典算法的执行过程。  
教学、面试、自学都好用 👉 [立即体验](https://your-username.github.io/algorithm-visualizer)

![preview](resources/demo-images/home-demo.gif)

---

## ✨ 核心特色
| 功能 | 描述 |
|---|---|
| 🎨 实时动画 | 基于 Anime.js 的丝滑动画，每一步操作一目了然 |
| 🕹️ 交互式控制台 | 速度/数据量/随机种子均可调，支持单步回放 |
| 📊 性能面板 | 实时展示时间、比较/交换次数、复杂度曲线 |
| 📜 同步代码高亮 | 当前执行行与可视化完全同步，支持多语言切换 |
| 📱 全端适配 | 桌面、平板、手机自适应，支持触摸手势 |
| 🌓 深色模式 | 自动读取系统主题，也可手动切换 |

---

## 🚀 快速开始
1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/algorithm-visualizer.git
   cd algorithm-visualizer
   ```

2. **一键启动**
   ```bash
   # 推荐使用 Node ≥ 16
   npm install
   npm start
   ```
   浏览器自动打开 `http://localhost:3000`

3. **打包部署**
   ```bash
   npm run build
   # dist/ 目录可直接上传到 GitHub Pages、Vercel、OSS 等
   ```

---

## 📂 文件结构
```
algorithm-visualizer
├─ index.html               # 主页
├─ sorting.html             # 排序可视化
├─ search.html              # 搜索可视化
├─ graph.html               # 图论可视化
├─ js/
│  ├─ main.js               # 通用路由 & UI
│  ├─ sorting-algorithms.js # 排序算法 & 动画
│  ├─ search-algorithms.js  # 搜索算法
│  └─ graph-algorithms.js   # 图论算法
├─ resources/               # 图片、图标、演示截图
└─ README.md
```

---

## 🎓 教学用法
| 场景 | 建议 |
|---|---|
| 课堂演示 | 投影后放慢速度，单步讲解，配合代码高亮 |
| 课后练习 | 让学生自己调整数据规模，观察复杂度曲线 |
| 算法对比 | 同一数据集运行快排 vs 归并，直观对比性能 |
| 作业截图 | 性能面板一键截图，实验报告直接贴图 |

---

## 🛠️ 技术栈
- **可视化**：Anime.js + SVG + Canvas  
- **图表**：ECharts（复杂度曲线）  
- **布局**：Flex + Grid，PostCSS 自动补全  
- **代码高亮**：Prism.js  
- **兼容性**：Chrome ≥ 80、Firefox ≥ 75、Safari ≥ 13、Edge ≥ 80

---

## 🤝 贡献指南
我们欢迎一切形式的贡献！  
**流程**：
1. Fork 仓库
2. 新建分支 `feat/xxx` 或 `fix/xxx`
3. 提交 PR 并描述改动 / 附上截图

详细规范请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 开源协议
MIT © Algorithm-Visualizer Contributors

---

## 📬 联系我
- issues：[GitHub Issues](https://github.com/your-username/algorithm-visualizer/issues)
- 邮件：aorightyan@gmail.com 

---

<a name="english"></a>
## English README

### Introduction
Algorithm-Visualizer is an **interactive educational platform** that makes algorithms intuitive through real-time animations.  
No installation required—just open the browser and start learning sorting, searching and graph algorithms in seconds.

### Quick Start
```bash
git clone https://github.com/your-username/algorithm-visualizer.git
cd algorithm-visualizer
npm install
npm start
```
Visit `http://localhost:3000` and enjoy!

### Features
- Live animation synced with code highlighting
- Adjustable speed & data size
- Performance metrics (time, comparisons, swaps)
- Dark/light theme
- Fully responsive

### License
MIT License
