# SiiWay Icons

SiiWay 官方图标库，由 [XiaoYuan151](//github.com/XiaoYuan151), [xhc861](//github.com/xhc861) 和 [wyf9](//github.com/wyf9) 提供.

The official siiway icons provided by [XiaoYuan151](//github.com/XiaoYuan151), [xhc861](//github.com/xhc861) and [wyf9](//github.com/wyf9).

- **[SiiWay Icon](./siiway/)**
- **[SWDrive](./swdrive/)**
- **[Sleepy Icon](./sleepy/)**

特别感谢 [XiaoYuan151](//github.com/XiaoYuan151) 对 SiiWay SVG 图标的重绘!

Special thanks to [XiaoYuan151](//github.com/XiaoYuan151) for re-drawing SiiWay's SVG icons!

**版权所有 (c) 2025 SiiWay Team. 保留所有权利.**

**Copyright (c) 2025 SiiWay Team. All Rights Reserved.**

# Resources

- **SVG to PNG Converter**: <https://www.freeconvert.com/svg-to-png>
- **Favicon Converter**: <https://favicon.io/favicon-converter/>
- HTML 标签配置:

```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
```

## 统一规范

1. 在 SVG 文件顶部添加注释:

```html
<?xml version="1.0" encoding="UTF-8"?> <!-- 需要在此行下方, 否则文件将损坏 -->
<!-- Copyright (c) SiiWay Team, All Rights Reserved - https://icons.siiway.org/path/to/file.svg -->
```

2. 使用 `Favicon Converter` 将 SVG 转换为 **不同大小的 PNG + ICO + `Webmanifest`**
3. 最终提供的颜色和尺寸: **黑色, 白色, 透明** **斜体尺寸放在 favicon 目录*

- **透明 SVG**: **`256x256`**
- **黑色 & 白色 PNG**: **`512x512`, `128x128`, `32x32`**
- *透明 PNG*: **`512x512`, `192x192`, `180x180`, `32x32`, `16x16`**
- *透明 ICO*: `48x48`
- SVG 更改图标尺寸方式:

```html
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg"> <!-- 给 svg 元素增加 width 和 height 属性 (须在 defs 外) -->
```

- SVG 添加背景色方式:

```html
<rect width="100%" height="100%" fill="black" /> <!-- black / white -->
```

- PNG & ICO 填充背景色 [脚本](./.tools/replace_transparent.py) 使用:

```bash
cd siiway # or other dirs
cp favicon favicon-light -r && cd favicon-light
uv run ../../.tools/replace_transparent.py white && rm ./*.bak
cd ..
cp favicon favicon-dark -r && cd favicon-dark
uv run ../../.tools/replace_transparent.py black && rm ./*.bak
cd ..
```

4. 在子目录的 README 中添加以下内容, 以便 Actions 自动生成目录树:

```md
<!-- AUTO_FILE_LIST_START -->

<!-- AUTO_FILE_LIST_END -->
```

5. 目录结构示例:

```bash
$ tree
.
├── favicon
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   └── site.webmanifest
├── favicon-dark
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   └── site.webmanifest
├── favicon-light
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   └── site.webmanifest
├── icon-dark.svg
├── icon-light.svg
├── icon.svg
└── README.md

4 directories, 25 files
```
