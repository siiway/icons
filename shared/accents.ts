import type { Accent } from './schema'

export const ACCENT_COLORS: Record<Accent, string> = {
  brand: '#3069c9',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
  sky: '#0ea5e9',
  slate: '#64748b',
}

export const ACCENTS = Object.keys(ACCENT_COLORS) as Accent[]
