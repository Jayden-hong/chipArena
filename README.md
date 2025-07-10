# AI算力竞技场

本项目基于 Next.js 15 + shadcn/ui + Tailwind CSS，聚焦多模态推理、芯片/模型对比、参数配置与智能助手体验，适合本地开发和二次扩展。

## 环境要求
- Node.js 18.x 或 20.x（建议与团队统一版本）
- 推荐使用 npm、yarn 或 pnpm

## 安装依赖
```bash
npm install
# 或
# yarn
# 或
# pnpm install
```

## 启动开发环境
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```
默认访问：http://localhost:3000

## 技术栈
- Next.js 15
- shadcn/ui（Radix UI 封装）
- Tailwind CSS
- lucide-react（图标）
- next-themes（深色模式）

## 主要功能
- 芯片/模型多选与对比
- 推理参数配置化
- 多模态输入（文本+图片）
- 推理结果卡片与雷达图
- 智能助手悬浮入口
- 深色/浅色自适应

## 常见问题
- **依赖未装全？** 运行 `npm install` 即可。
- **端口被占用？** 修改 `package.json` 里的 `dev` 脚本或本地端口。
- **环境变量？** 如需对接后端API，请联系项目负责人获取 `.env` 文件。

## 其他
如遇到本地无法启动、依赖冲突等问题，请及时在群内反馈或联系项目维护人。
