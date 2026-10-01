export type BackgroundMode = 'checker' | 'light' | 'dark'

export function useBackground() {
  const mode = useState<BackgroundMode>('site-bg', () => 'checker')

  const bgClass = computed(() =>
    mode.value === 'light' ? 'bg-white' : mode.value === 'dark' ? 'bg-zinc-900' : 'checkerboard',
  )

  const bgColor = computed(() =>
    mode.value === 'light' ? '#ffffff' : mode.value === 'dark' ? '#0a0a12' : null,
  )

  return { mode, bgClass, bgColor }
}
