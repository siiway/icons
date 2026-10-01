<script setup lang="ts">
import type { Brand } from '~~/shared/schema'
import { ACCENT_COLORS } from '~~/shared/accents'
import { publicUrl } from '~~/shared/assets'

const props = defineProps<{ brand: Brand }>()
defineEmits<{ select: [brand: Brand] }>()

const siteConfig = useSiteConfig()
const { bgClass } = useBackground()

const accentColor = computed(() => ACCENT_COLORS[props.brand.accent ?? siteConfig.accent])
const iconUrl = computed(() => publicUrl(props.brand.id, 'icon', 'icon', props.brand.icon.source))
</script>

<template>
  <button
    type="button"
    class="group flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-6 text-center transition duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50"
    :style="{ '--accent': accentColor }"
    @click="$emit('select', brand)"
  >
    <div
      :class="[
        bgClass,
        'flex h-24 w-24 items-center justify-center rounded-2xl ring-2 ring-transparent transition group-hover:ring-[color:var(--accent)]',
      ]"
    >
      <img :src="iconUrl" class="h-14 w-14" :alt="brand.name" />
    </div>
    <div>
      <div class="font-semibold">{{ brand.name }}</div>
      <div v-if="brand.tagline" class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
        {{ brand.tagline }}
      </div>
      <div v-if="brand.copyright?.license" class="mt-2">
        <span class="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {{ brand.copyright.license }}
        </span>
      </div>
    </div>
  </button>
</template>
