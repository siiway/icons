<script setup lang="ts">
import type { Brand, Extra, Lockup } from '~~/shared/schema'
import { ACCENT_COLORS } from '~~/shared/accents'
import { publicUrl } from '~~/shared/assets'

const props = defineProps<{ brand: Brand | null }>()
const open = defineModel<boolean>({ default: false })

const siteConfig = useSiteConfig()
const { t } = useI18n()
const { mode, bgClass } = useBackground()
const { download } = useDownload()

const accentColor = computed(() => ACCENT_COLORS[props.brand?.accent ?? siteConfig.accent])
const bgOptions = computed(
  () =>
    [
      { key: 'checker', label: t('drawer.bgChecker') },
      { key: 'light', label: t('drawer.bgLight') },
      { key: 'dark', label: t('drawer.bgDark') },
    ] as const,
)

function iconUrl(size?: number) {
  const b = props.brand
  return b ? publicUrl(b.id, 'icon', 'icon', b.icon.source, size) : ''
}
function lockupUrl(l: Lockup, size?: number) {
  return props.brand ? publicUrl(props.brand.id, 'lockup', l.id, l.source, size) : ''
}
function extraUrl(e: Extra) {
  return props.brand ? publicUrl(props.brand.id, 'extra', e.id, e.source) : ''
}
function fileName(url: string, base: string) {
  return `${base}${url.slice(url.lastIndexOf('.'))}`
}

function absoluteUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = siteConfig.ogUrl.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

const rawSvgContent = ref('')
const loadingSvg = ref(false)

watch(
  () => props.brand,
  async (b) => {
    if (!b) {
      rawSvgContent.value = ''
      return
    }
    const url = iconUrl()
    loadingSvg.value = true
    try {
      const res = await fetch(url)
      if (res.ok) {
        rawSvgContent.value = await res.text()
      } else {
        rawSvgContent.value = `<!-- Failed to load SVG from ${url} -->`
      }
    } catch {
      rawSvgContent.value = `<!-- Error fetching SVG content -->`
    } finally {
      loadingSvg.value = false
    }
  },
  { immediate: true },
)

const displaySvgContent = computed(() => {
  if (!rawSvgContent.value || !props.brand) return rawSvgContent.value
  let text = rawSvgContent.value
  // If the SVG doesn't have a copyright comment right after <svg>, ensure it is present
  if (!text.includes('<!-- Copyright') && !text.includes('<!--Copyright')) {
    const notice = props.brand.copyright?.owner
      ? `<!-- Copyright (c) ${props.brand.copyright.owner} (${props.brand.copyright.license}) - ${siteConfig.ogUrl}/brand/${props.brand.id}/icon.svg -->`
      : `<!-- Copyright (c) SiiWay Team - ${siteConfig.ogUrl}/brand/${props.brand.id}/icon.svg -->`
    const svgMatch = text.match(/<svg\b[^>]*>/i)
    if (svgMatch && svgMatch.index !== undefined) {
      const pos = svgMatch.index + svgMatch[0].length
      text = text.slice(0, pos) + '\n  ' + notice + text.slice(pos)
    }
  }
  return text
})

const snippet = computed(() => {
  const b = props.brand
  if (!b) return ''
  const svg = absoluteUrl(iconUrl())
  const png = b.icon.sizes.includes(256) ? absoluteUrl(iconUrl(256)) : svg
  return `<!-- ${t('drawer.snippetComment', { name: b.name })} -->
<picture>
  <source srcset="${svg}" type="image/svg+xml" />
  <img src="${png}" alt="${b.name}" width="256" height="256" />
</picture>`
})

const copiedSnippet = ref(false)
const copiedRawSvg = ref(false)

watch(
  () => props.brand,
  () => {
    copiedSnippet.value = false
    copiedRawSvg.value = false
  },
)

async function copySnippet() {
  try {
    await navigator.clipboard.writeText(snippet.value)
    copiedSnippet.value = true
    setTimeout(() => (copiedSnippet.value = false), 1500)
  } catch {
    copiedSnippet.value = false
  }
}

async function copyRawSvg() {
  try {
    await navigator.clipboard.writeText(displaySvgContent.value)
    copiedRawSvg.value = true
    setTimeout(() => (copiedRawSvg.value = false), 1500)
  } catch {
    copiedRawSvg.value = false
  }
}
</script>

<template>
  <USlideover v-model="open" :ui="{ width: 'w-screen max-w-2xl' }">
    <div v-if="brand" class="flex h-full flex-col">
      <header
        class="flex items-start justify-between gap-4 border-b border-t-4 border-zinc-200 p-6 dark:border-zinc-800"
        :style="{ borderTopColor: accentColor }"
      >
        <div class="flex items-center gap-4">
          <div :class="[bgClass, 'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl overflow-hidden']">
            <div v-if="rawSvgContent" class="h-9 w-9 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full" v-html="rawSvgContent" />
            <img v-else :src="iconUrl()" class="h-9 w-9" :alt="brand.name" />
          </div>
          <div>
            <h2 class="text-lg font-semibold">{{ brand.name }}</h2>
            <p v-if="brand.tagline" class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ brand.tagline }}
            </p>
            <a
              v-if="brand.repo"
              :href="`https://github.com/${brand.repo}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs text-primary-500 hover:underline"
            >
              {{ brand.repo }}
            </a>
          </div>
        </div>
        <button
          type="button"
          class="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          :aria-label="t('common.close')"
          @click="open = false"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="flex-1 space-y-8 overflow-y-auto p-6">
        <p v-if="brand.description" class="text-sm text-zinc-600 dark:text-zinc-300">
          {{ brand.description }}
        </p>

        <!-- Preview Section -->
        <section>
          <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.preview') }}</h3>
            <UButtonGroup size="xs">
              <UButton
                v-for="option in bgOptions"
                :key="option.key"
                :variant="mode === option.key ? 'solid' : 'soft'"
                @click="mode = option.key"
              >
                {{ option.label }}
              </UButton>
            </UButtonGroup>
          </div>
          <div :class="[bgClass, 'flex h-48 items-center justify-center rounded-2xl p-4 overflow-hidden']">
            <div v-if="rawSvgContent" class="h-32 w-32 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full" v-html="rawSvgContent" />
            <img v-else :src="iconUrl()" class="h-32 w-32 object-contain" :alt="brand.name" />
          </div>
        </section>

        <!-- Vector SVG Source Code Section -->
        <section>
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.rawSvgTitle') }}</h3>
            <div class="flex gap-2">
              <UButton variant="soft" size="xs" @click="download(iconUrl(), fileName(iconUrl(), 'icon'))">
                {{ t('drawer.downloadSvg') }}
              </UButton>
              <UButton variant="ghost" size="xs" @click="copyRawSvg">
                {{ copiedRawSvg ? t('common.copied') : t('drawer.copyRawSvg') }}
              </UButton>
            </div>
          </div>
          <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <pre class="max-h-56 overflow-auto font-mono text-xs text-zinc-200 selection:bg-primary-500/30"><code>{{ displaySvgContent }}</code></pre>
          </div>
        </section>

        <!-- Usage HTML Snippet -->
        <section>
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.copySnippet') }}</h3>
            <UButton variant="ghost" size="xs" @click="copySnippet">
              {{ copiedSnippet ? t('common.copied') : t('drawer.copySnippet') }}
            </UButton>
          </div>
          <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <pre class="overflow-x-auto font-mono text-xs text-zinc-200 selection:bg-primary-500/30"><code>{{ snippet }}</code></pre>
          </div>
        </section>

        <!-- Sizes Section -->
        <section v-if="brand.icon.sizes.length">
          <h3 class="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.sizes') }}</h3>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              v-for="s in brand.icon.sizes"
              :key="s"
              class="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div :class="[bgClass, 'mb-2 flex h-20 items-center justify-center rounded-lg']">
                <img
                  :src="iconUrl(s)"
                  :width="Math.min(s, 64)"
                  :height="Math.min(s, 64)"
                  class="max-h-14 max-w-14 object-contain"
                  :alt="`icon-${s}`"
                  @error="(e) => ((e.target as HTMLImageElement).src = iconUrl())"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-zinc-500">{{ s }}×{{ s }}</span>
                <button
                  type="button"
                  class="text-xs text-primary-500 hover:underline"
                  @click="download(iconUrl(s), `icon-${s}.png`)"
                >
                  {{ t('common.download') }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Lockups -->
        <section v-if="brand.lockups.length">
          <h3 class="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.lockups') }}</h3>
          <div class="space-y-3">
            <div
              v-for="l in brand.lockups"
              :key="l.id"
              class="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div :class="[bgClass, 'mb-2 flex h-24 items-center justify-center overflow-hidden rounded-lg']">
                <img :src="lockupUrl(l)" class="max-h-16 w-auto" :alt="l.name" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">{{ l.name }}</span>
                <button
                  type="button"
                  class="text-xs text-primary-500 hover:underline"
                  @click="download(lockupUrl(l), fileName(lockupUrl(l), l.id))"
                >
                  {{ t('common.download') }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Extras -->
        <section v-if="brand.extras.length">
          <h3 class="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ t('drawer.extras') }}</h3>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="e in brand.extras"
              :key="e.id"
              class="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div :class="[bgClass, 'mb-2 flex h-20 items-center justify-center rounded-lg']">
                <img :src="extraUrl(e)" class="max-h-12 w-auto" :alt="e.name" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">{{ e.name }}</span>
                <button
                  type="button"
                  class="text-xs text-primary-500 hover:underline"
                  @click="download(extraUrl(e), fileName(extraUrl(e), e.id))"
                >
                  {{ t('common.download') }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Copyright & License Card at the bottom -->
        <section v-if="brand.copyright" class="rounded-xl border border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {{ t('drawer.copyrightTitle') }}
            </h3>
            <span
              class="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              :class="
                brand.copyright.original
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
              "
            >
              {{ brand.copyright.original ? t('drawer.originalBadge') : t('drawer.modifiedBadge') }}
            </span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-800">
              <span class="text-zinc-500 dark:text-zinc-400">{{ t('drawer.copyrightOwner') }}</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-300">{{ brand.copyright.owner }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-800">
              <span class="text-zinc-500 dark:text-zinc-400">{{ t('drawer.copyrightLicense') }}</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-300">
                <a
                  v-if="brand.copyright.licenseUrl"
                  :href="brand.copyright.licenseUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary-500 hover:underline"
                >
                  {{ brand.copyright.license }} ↗
                </a>
                <template v-else>{{ brand.copyright.license }}</template>
              </span>
            </div>
            <div v-if="brand.copyright.author" class="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-800">
              <span class="text-zinc-500 dark:text-zinc-400">{{ t('drawer.copyrightAuthor') }}</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-300">{{ brand.copyright.author }}</span>
            </div>
            <div v-if="brand.copyright.notice" class="pt-2 text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
              {{ brand.copyright.notice }}
            </div>
          </div>
        </section>
      </div>
    </div>
  </USlideover>
</template>
