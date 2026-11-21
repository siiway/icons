import type { IconScheme } from '~~/shared/assets'

export type BackgroundMode = IconScheme

export function useBackground() {
  const mode = useState<BackgroundMode>('site-bg', () => 'checker')

  const bgClass = computed(() =>
    mode.value === 'light' ? 'bg-white' : mode.value === 'dark' ? 'bg-zinc-900' : 'checkerboard',
  )

  return { mode, bgClass }
}
