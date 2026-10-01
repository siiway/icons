import { iconsConfigSchema, siteConfigSchema } from './shared/schema'
import { siteConfig } from './site.config'
import { iconsConfig } from './app/data/icons.config'

const site = siteConfigSchema.parse(siteConfig)
iconsConfigSchema.parse(iconsConfig)

export default defineNuxtConfig({
  compatibilityDate: '2026-08-27',
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'zh',
    lazy: true,
    langDir: 'locales',
    locales: [
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'zh',
    },
  },
  app: {
    head: {
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: site.ogUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: site.logo }],
    },
  },
  nitro: {
    preset: 'github_pages',
  },
  devServer: {
    host: '0.0.0.0',
  },
})
