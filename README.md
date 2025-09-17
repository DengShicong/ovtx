# OV Price Comparison Tool

一个基于 React 的 OV TERRA vs OV2500 价格对比工具，支持多语言界面和动态图表展示。

## 🚀 功能特性

- **价格对比分析**: OV TERRA 与 OV2500 多年期价格对比（1/3/5/7年）
- **多语言支持**: 支持中文和英文界面切换
- **动态图表**: 使用 Chart.js 实现交互式价格趋势图表
- **预设模板**: 内置哈工大、商丘医专、广达项目等模板配置
- **自动匹配**: Terra 组合自动匹配到 OV2500 对应配置
- **响应式设计**: 基于 Tailwind CSS 的现代化 UI 设计
- **动画效果**: 使用 Framer Motion 实现流畅的页面动画

## 🛠️ 技术栈

- **前端框架**: React 18.3.1
- **构建工具**: Vite 5.4.20
- **样式框架**: Tailwind CSS 3.4.10
- **图表库**: Chart.js 4.4.3 + React-Chartjs-2 5.2.0
- **动画库**: Framer Motion 11.0.8
- **3D图形**: Three.js + React Three Fiber (可选扩展)
- **工具库**: clsx, tailwind-merge

## 📦 安装

确保你的环境中已安装 Node.js (推荐 16.0 或更高版本)。

```bash
# 克隆项目
git clone <repository-url>
cd ov-price-react

# 安装依赖
npm install
```

## 🚦 运行

### 开发环境

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动，支持热重载。

### 生产构建

```bash
npm run build
```

构建文件将输出到 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
ov-price-react/
├── src/
│   ├── components/          # React 组件
│   ├── lib/                # 工具库和配置
│   ├── App.jsx             # 主应用组件
│   ├── main.jsx            # 应用入口
│   └── index.css           # 全局样式
├── dist/                   # 构建输出目录
├── index.html              # HTML 模板
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
└── postcss.config.js       # PostCSS 配置
```

## 🎯 主要功能

### 价格对比
- 支持 OV TERRA 与 OV2500 的详细价格对比
- 多时间维度分析（1年、3年、5年、7年）
- 实时计算总价和年均价格

### 模板系统
- **哈工大模板**: 预配置的哈尔滨工业大学方案
- **商丘医专模板**: 商丘医学高等专科学校配置
- **广达项目模板**: 广达相关项目配置

### 智能匹配
- Terra 组合自动匹配到最优 OV2500 配置
- 统一套餐应用功能
- 手动和自动组合模式切换

## 🔧 配置

### Vite 配置
项目使用 Vite 作为构建工具，配置文件为 `vite.config.js`：

```javascript
export default {
  plugins: [react()],
  server: {
    host: true  // 允许外部访问
  }
}
```

### Tailwind CSS
使用 Tailwind CSS 进行样式管理，支持表单插件和自定义配置。

## 📊 图表功能

项目集成了 Chart.js，支持：
- 线性图表展示价格趋势
- 柱状图对比不同配置
- 交互式图表操作
- 自定义图表样式和动画

## 🌐 多语言支持

内置中英文语言包，支持：
- 界面文本本地化
- 货币符号适配（¥ / $）
- 数字格式化显示

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📄 许可证

本项目采用私有许可证，版本 1.0.0。

## 📞 联系

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**注意**: 本工具专门用于 OV 产品价格分析，请确保在合适的业务场景中使用。