# 小x宝社区志愿者小程序

> 一个为志愿者提供轻量级公益服务的微信小程序平台

## 项目概述

本项目是一个基于微信小程序的社区志愿者服务平台，主要功能包括：

- **志愿者注册与管理**：30秒快速注册，支持身份标签选择
- **活动组织**：活动发布、报名、签到、服务时长记录
- **任务分配**：技能匹配的任务发布与完成流程
- **社交互动**：志愿者墙、消息中心、私信功能
- **管理后台**：Web管理端用于审核、统计和运营

## 技术架构

- **前端**：微信小程序原生 + TypeScript + Vant Weapp
- **管理端**：Vue 3 + Element Plus + TypeScript
- **后端**：Supabase Postgres + Edge Functions
- **部署**：小程序云开发 + Supabase + 阿里云CDN

## 项目结构

```
志愿者小程序/
├── miniprogram/          # 微信小程序
│   ├── app.js           # 小程序入口
│   ├── app.json         # 小程序配置
│   ├── app.wxss         # 全局样式
│   └── pages/           # 页面文件
├── admin/               # 管理后台
│   ├── src/
│   │   ├── views/       # 页面组件
│   │   ├── stores/      # 状态管理
│   │   ├── router/      # 路由配置
│   │   └── main.ts      # 入口文件
│   ├── package.json     # 依赖配置
│   └── vite.config.ts   # 构建配置
├── edge-functions/      # 边缘函数
│   ├── functions/       # 函数目录
│   ├── supabase/        # Supabase配置
│   └── package.json     # 依赖配置
├── 需求设计/             # 需求文档
└── .env.example         # 环境变量示例
```

## 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd 志愿者小程序

# 复制环境变量文件
cp .env.example .env
# 编辑 .env 文件，填入实际的配置信息
```

### 2. 小程序开发

```bash
cd miniprogram
# 使用微信开发者工具打开项目
```

### 3. 管理后台开发

```bash
cd admin
npm install
npm run dev
```

### 4. Edge Functions 开发

```bash
cd edge-functions
npm install
supabase start
```

## 功能模块

### 核心功能

1. **用户注册登录**
   - 微信授权登录
   - 手机号验证
   - 身份标签选择

2. **个人中心**
   - 资料编辑
   - 隐私设置
   - 服务时长记录

3. **志愿者墙**
   - 志愿者列表展示
   - 搜索与筛选
   - 公益名片

4. **活动大厅**
   - 活动发布
   - 报名参与
   - 签到记录

5. **任务模块**
   - 任务发布
   - 技能匹配
   - 任务完成

### 管理功能

1. **用户管理**
   - 用户审核
   - 状态管理
   - 数据导出

2. **内容审核**
   - 三审流机制
   - 违规处理

3. **数据看板**
   - 数据统计
   - 趋势分析
   - 报表生成

## 数据库设计

主要数据表：

- `volunteers` - 志愿者主表
- `activities` - 活动表
- `activity_sign` - 活动签到表
- `tasks` - 任务表
- `task_signups` - 任务报名表
- `messages` - 消息表
- `communities` - 社团表

## 部署说明

### 小程序部署

1. 提交小程序审核
2. 配置云函数环境
3. 设置CDN加速

### 管理后台部署

```bash
cd admin
npm run build
# 部署 dist 目录到服务器
```

### Supabase部署

1. 创建Supabase项目
2. 配置环境变量
3. 部署Edge Functions

## 开发规范

- 使用TypeScript进行类型检查
- 遵循ESLint代码规范
- 提交信息使用约定格式
- 功能开发完成后进行单元测试

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题请联系项目负责人或提交Issue。