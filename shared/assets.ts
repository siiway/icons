import type { Asset, AssetSource } from './schema'

export type AssetKind = 'icon' | 'lockup' | 'extra'

export type IconScheme = 'checker' | 'light' | 'dark'

export const ICON_VARIANTS = [
  'icon',
  'icon-light',
  'icon-dark',
  'border',
  'border-light',
  'border-dark',
] as const

export type IconVariant = (typeof ICON_VARIANTS)[number]

const ICON_VARIANT_BY_SCHEME = {
  checker: { tight: 'icon', padded: 'border' },
  light: { tight: 'icon-light', padded: 'border-light' },
  dark: { tight: 'icon-dark', padded: 'border-dark' },
} as const satisfies Record<IconScheme, Record<'tight' | 'padded', IconVariant>>

export function iconVariant(isPadded: boolean, scheme: IconScheme): IconVariant {
  return ICON_VARIANT_BY_SCHEME[scheme][isPadded ? 'padded' : 'tight']
}

export function iconVariantFileName(variant: IconVariant, size?: number): string {
  return size ? `${variant}-${size}.png` : `${variant}.svg`
}

export function iconVariantUrl(brandId: string, variant: IconVariant, size?: number): string {
  return `/brand/${brandId}/${iconVariantFileName(variant, size)}`
}

export function localName(kind: AssetKind, id: string, source: string, size?: number): string {
  const ext = source.slice(source.lastIndexOf('.'))
  if (kind === 'icon') return size ? `icon-${size}.png` : `icon${ext}`
  return size ? `${id}-${size}.png` : `${id}${ext}`
}

export function publicUrl(
  brandId: string,
  kind: AssetKind,
  id: string,
  source: AssetSource,
  size?: number,
): string {
  if (typeof source !== 'string') {
    return `/${source.path}`
  }
  // When size is requested, use brand size derivative if configured
  return `/brand/${brandId}/${localName(kind, id, source, size)}`
}

export function sourceSvgUrl(brandId: string, source: AssetSource): string {
  if (typeof source !== 'string') {
    return `/${source.path}`
  }
  return `/brand/${brandId}/icon.svg`
}

export function hasSizeVariants(asset: Asset): boolean {
  return typeof asset.source === 'string' && !!asset.sizeSource && asset.sizes.length > 0
}

export function repoUrl(repo: string): string {
  return `https://github.com/${repo}`
}
