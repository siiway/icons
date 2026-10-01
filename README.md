# SiiWay Icons

SiiWay 官方图标展示站点与图标资源库。

本项目前端展示站点基于 [ReCloudStudio/icon-showcase](https://github.com/ReCloudStudio/icon-showcase) 进行改造，前端页面代码遵循 [MIT 许可证](./LICENSE-CODE)。

除特殊说明外，本项目包含的图标作品版权归属如下：
**Copyright (c) 2026 SiiWay Team. 保留所有权利 (All Rights Reserved).**
详细的图标作品版权说明参见 [LICENSE.md](./LICENSE.md) 及各图标页面详情。

---

## 项目图标分组

- **SiiWay**
  - [SiiWay Icon](./icons/siiway/)
  - [SWDrive](./icons/swdrive/)
  - [Prism](./icons/prism/)
  - [Glint](./icons/glint/)
  - [NextBridge](./icons/nextbridge/)
  - [SiiWay CLI](./icons/cli/)
  - [Workbench](./icons/workbench/)
  - [Claude Review](./icons/claude-review/)
  - [Vellum](./icons/vellum/)
- **Sleepy Project**
  - [Sleepy Icon](./icons/sleepy/)

---

## 本地开发与构建

本展示站点基于 **Nuxt 4** 与 **Bun** 构建：

```bash
# 安装依赖
bun install

# 准备图标产物与配置
bun run prepare-icons

# 启动开发服务器
bun run dev

# 静态打包构建 (GitHub Pages)
bun run generate
```

## 统一图标规范

在 SVG 文件顶部添加版权注释：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!-- Copyright (c) SiiWay Team, All Rights Reserved - https://icons.siiway.org/icons/siiway/icon.svg -->
```

所有衍生的各种尺寸 PNG、ICO 及亮/暗色背景图标将在构建阶段通过 CI 自动化处理，仓库中仅需维护透明矢量 SVG 源文件。
