<script setup lang="ts">
import type { Brand } from '~~/shared/schema'
import { publicUrl } from '~~/shared/assets'

const siteConfig = useSiteConfig()
const { t, te } = useI18n()
const { groups } = useIcons()

const description = computed(() =>
  te('home.description') ? t('home.description') : siteConfig.description,
)

const groupIds = Object.keys(groups)
const activeGroupId = ref(
  groupIds.includes(siteConfig.defaultGroup) ? siteConfig.defaultGroup : groupIds[0]!,
)
const activeGroup = computed(() => groups[activeGroupId.value]!)

function groupLogoFor(gid: string) {
  const group = groups[gid]
  if (!group?.logo) return null
  if (typeof group.logo === 'object') return `/${group.logo.path}`
  const first = group.brands[0]
  return first ? publicUrl(first.id, 'icon', 'icon', first.icon.source) : null
}

const tabs = groupIds.map((id) => ({
  id,
  name: groups[id]!.name,
  logo: groupLogoFor(id),
}))

const selected = ref<Brand | null>(null)
const drawerOpen = ref(false)

function selectBrand(brand: Brand) {
  selected.value = brand
  drawerOpen.value = true
}
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ siteConfig.name }} {{ t('home.heading') }}</h1>
      <p class="mt-3 text-zinc-500 dark:text-zinc-400">{{ description }}</p>
    </div>

    <div class="mb-8 flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-800">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
        :class="
          activeGroupId === t.id
            ? 'border-primary-500 text-primary-500'
            : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
        "
        @click="activeGroupId = t.id"
      >
        <img v-if="t.logo" :src="t.logo" class="h-5 w-5" alt="" />
        {{ t.name }}
      </button>
    </div>

    <div class="mb-6 flex flex-wrap items-baseline justify-between gap-2">
      <div>
        <h2 class="text-xl font-semibold">{{ activeGroup.name }}</h2>
        <p v-if="activeGroup.description" class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {{ activeGroup.description }}
        </p>
      </div>
      <a
        v-if="activeGroup.url"
        :href="activeGroup.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-primary-500 hover:underline"
      >
        {{ activeGroup.url }}
      </a>
    </div>

    <div v-if="activeGroup.brands.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <BrandCard v-for="b in activeGroup.brands" :key="b.id" :brand="b" @select="selectBrand" />
    </div>
    <p v-else class="py-16 text-center text-sm text-zinc-500">{{ t('home.empty') }}</p>

    <BrandDrawer v-model="drawerOpen" :brand="selected" />
  </UContainer>
</template>
