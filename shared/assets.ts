import type { Asset, AssetSource } from './schema'

export type AssetKind = 'icon' | 'lockup' | 'extra'

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
