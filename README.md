# PhotoStudio Pro - 专业照片美化工具

一款功能强大且易于使用的在线照片美化应用，专为摄影师、设计师和社交媒体内容创作者打造。

![PhotoStudio Pro](https://img.shields.io/badge/Version-1.0-orange) ![License](https://img.shields.io/badge/License-MIT-blue) ![Platform](https://img.shields.io/badge/Platform-Web-green)

## ✨ 核心功能

### 1. 专业调色功能
- **基础调整**: 曝光、对比度、高光、阴影、白色色阶、黑色色阶
- **色彩调整**: 色温、色调、自然饱和度、饱和度
- **细节优化**: 清晰度、去朦胧、锐化、降噪、暗角、颗粒感
- **曲线调整**: RGB/红/绿/蓝通道独立曲线，支持多点控制
- **HSL调整**: 8种颜色（红、橙、黄、绿、青、蓝、紫、洋红）的色相、饱和度、亮度独立调节
- **色彩分离**: 高光和阴影独立着色，可调平衡

### 2. 丰富滤镜效果
内置12款精选滤镜：
- 自然、鲜艳、戏剧、情绪
- 暖调、冷调、褪色、哑光
- 复古、电影、金色时刻、极地

### 3. 模拟胶片效果
收录50+款经典胶片模拟：

#### 富士 Fujifilm (8款)
- Velvia 50/100 (高饱和正片)
- Provia 100F (标准正片)
- Astia 100F (柔和正片)
- Pro 400H (专业负片)
- Superia 400 (消费负片)
- C200 (经济负片)
- Classic Chrome (经典正片)

#### 柯达 Kodak (8款)
- Portra 160/400/800 (人像负片)
- Ektar 100 (风光负片)
- Gold 200 (消费负片)
- UltraMax 400 (消费负片)
- ColorPlus 200 (经济负片)
- Ektachrome E100 (正片)

#### 哈苏 Hasselblad (6款)
- Natural (自然色彩)
- Portrait (人像模式)
- Landscape (风光模式)
- Vibrant (鲜艳模式)
- Soft (柔和模式)
- XPAN (经典模式)

#### 依尔福 Ilford 黑白 (8款)
- HP5 Plus / Delta 100/400/3200
- FP4 Plus / Pan F Plus
- SFX 200 (红外)
- XP2 Super (C41黑白)

#### 爱克发 Agfa (6款)
- Vista 200/400
- Ultra 50 (高饱和)
- Optima 100
- Precisa CT100 (正片)
- APX 100 (黑白)

#### 电影胶片 Cinematic (8款)
- Vision3 50D/250D/500T
- CineStill 800T/50D
- Teal & Orange (好莱坞风格)
- Bleach Bypass (漂白跳过)
- Cross Process (交叉冲洗)

### 4. 实时预览功能
- 所有调整实时生效
- 一键对比原图
- 支持缩放查看细节
- 完整编辑历史记录
- 撤销/重做功能

### 5. 插件支持与扩展性
- AI智能增强
- 背景模糊
- 光晕效果
- 自定义插件接口

## 🚀 部署指南

### GitHub Pages 部署

1. Fork 本仓库或创建新仓库
2. 上传 `index.html` 文件
3. 进入仓库 Settings → Pages
4. Source 选择 `main` 分支
5. 点击 Save，等待部署完成
6. 访问 `https://[用户名].github.io/[仓库名]/`

### Cloudflare Pages 部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages → Create a project
3. 连接 Git 仓库或直接上传文件
4. Framework preset 选择 `None`
5. Build command 留空
6. Build output directory 设为 `/`
7. 点击 Save and Deploy

### 本地运行

直接在浏览器中打开 `index.html` 文件即可使用。

## 📖 使用说明

### 基本操作
1. **上传图片**: 拖拽图片到画布区域，或点击"选择文件"按钮
2. **调整参数**: 在左侧面板中拖动滑块调整各项参数
3. **应用预设**: 在右侧面板选择滤镜或胶片效果
4. **调整强度**: 使用底部"效果强度"滑块控制预设强度
5. **对比原图**: 点击左上角"对比原图"开关
6. **导出图片**: 点击"导出"按钮保存编辑后的图片

### 快捷键
- `Ctrl/Cmd + Z`: 撤销
- `Ctrl/Cmd + Shift + Z`: 重做
- `Ctrl/Cmd + S`: 导出图片

### 曲线编辑
- 单击添加控制点
- 拖动控制点调整曲线
- 双击删除控制点（首尾点除外）
- 使用预设快速应用常用曲线

## 🛠 技术栈

- **纯前端实现**: HTML5 + CSS3 + JavaScript
- **图像处理**: Canvas API
- **无需服务器**: 完全在浏览器本地运行
- **零依赖**: 无需安装任何第三方库

## 📁 项目结构

```
photostudio/
├── index.html      # 主应用文件（包含所有代码）
└── README.md       # 项目文档
```

## 🎨 设计特点

- **暗色专业主题**: 参考 Lightroom/Capture One 专业软件设计
- **直观的操作界面**: 清晰的功能分区和操作逻辑
- **流畅的动画效果**: 精心设计的交互反馈
- **响应式布局**: 适配不同屏幕尺寸

## 📝 开发计划

- [ ] 批量处理功能
- [ ] 自定义预设保存
- [ ] 图层和蒙版
- [ ] 更多滤镜效果
- [ ] 局部调整工具
- [ ] WebGL 加速渲染

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**PhotoStudio Pro** - 让每一张照片都能展现最美的一面 ✨
