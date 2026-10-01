<script setup lang="ts">
import { ACCENT_COLORS } from '~~/shared/accents'

const colorMode = useColorMode()
const siteConfig = useSiteConfig()
const { t, te, locale, setLocale } = useI18n()

const siteAccentColor = computed(() => ACCENT_COLORS[siteConfig.accent])

const localeOptions = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
]

const description = computed(() =>
  te('home.description') ? t('home.description') : siteConfig.description,
)

useHead(() => ({
  title: t('meta.title', { name: siteConfig.name }),
  meta: [
    { name: 'description', content: description.value },
    { property: 'og:title', content: t('meta.title', { name: siteConfig.name }) },
    { property: 'og:description', content: description.value },
  ],
}))

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div
    class="relative flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-[#0a0a12] dark:text-white"
    :style="{ '--site-accent': siteAccentColor }"
  >
    <div class="pointer-events-none fixed inset-0 z-0">
      <div class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:64px_64px] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
      <div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-500/10 blur-[128px]" />
      <div class="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-500/10 blur-[128px]" />
    </div>

    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:left-4 focus:top-4 focus:rounded-full focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
    >
      {{ t('common.skipToContent') }}
    </a>

    <header class="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/20">
          <img :src="siteConfig.logo" class="h-5 w-5" alt="" />
        </div>
        <span class="text-lg font-bold tracking-tight">{{ siteConfig.name }}</span>
      </div>
      <div class="flex items-center gap-2">
        <USelect
          :model-value="locale"
          :options="localeOptions"
          :aria-label="t('common.language')"
          icon="i-heroicons-language"
          size="sm"
          variant="none"
          class="w-36"
          :ui="{
            rounded: 'rounded-full',
            base: 'rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800',
            padding: { sm: 'px-2.5 py-1.5' },
            gap: { sm: 'gap-x-1' },
            icon: { base: 'text-zinc-500 dark:text-zinc-400' },
          }"
          @update:model-value="setLocale"
        />
        <button
          class="rounded-full p-2 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
          :aria-label="colorMode.value === 'dark' ? t('common.switchToLight') : t('common.switchToDark')"
          :title="colorMode.value === 'dark' ? t('common.switchToLight') : t('common.switchToDark')"
          @click="toggleTheme"
        >
          <svg v-if="colorMode.value === 'dark'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </button>
      </div>
    </header>

    <main id="main" class="relative z-10 flex-1">
      <NuxtPage />
    </main>

    <footer class="relative z-10 border-t border-zinc-200 px-6 py-12 dark:border-zinc-900">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 text-xs text-zinc-500 dark:text-zinc-700 sm:flex-row sm:justify-between">
        <div>&copy; {{ new Date().getFullYear() }} {{ siteConfig.footer }}. {{ t('common.rights') }}</div>
        <a
          :href="siteConfig.github"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          GitHub
        </a>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  scroll-behavior: smooth;
}

::selection {
  background-color: color-mix(in srgb, var(--site-accent, #3069c9) 25%, transparent);
  color: inherit;
}

.dark ::selection {
  background-color: color-mix(in srgb, var(--site-accent, #3069c9) 35%, transparent);
}

*:focus-visible {
  outline: 2px solid var(--site-accent, #3069c9);
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
