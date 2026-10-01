import type { SiteConfig } from './shared/schema'

export const siteConfig = {
  name: 'SiiWay Icons',
  description: 'SiiWay 与 Sleepy Project 官方项目图标展示与资源库：矢量 SVG 源码与多尺寸图像下载。',
  logo: '/brand/siiway/icon.svg',
  accent: 'emerald',
  ogUrl: 'https://icons.siiway.org',
  github: 'https://github.com/siiway/icons',
  footer: 'SiiWay Team',
  defaultGroup: 'siiway',
  links: [
    { label: 'SiiWay Home', url: 'https://siiway.org' },
    { label: 'GitHub Organization', url: 'https://github.com/siiway' },
  ],
} satisfies SiteConfig
