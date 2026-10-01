import { z } from 'zod'

export const accentSchema = z.enum([
  'brand',
  'indigo',
  'violet',
  'emerald',
  'rose',
  'amber',
  'sky',
  'slate',
])
export type Accent = z.infer<typeof accentSchema>

export const assetSourceSchema = z.union([
  z.string(),
  z.object({ type: z.literal('local'), path: z.string() }),
])
export type AssetSource = z.infer<typeof assetSourceSchema>

export const assetSchema = z.object({
  source: assetSourceSchema,
  sizes: z.array(z.number().int().positive()).default([]),
  sizeSource: z.string().optional(),
})
export type Asset = z.infer<typeof assetSchema>

export const lockupSchema = assetSchema.extend({
  id: z.string(),
  name: z.string(),
})
export type Lockup = z.infer<typeof lockupSchema>

export const extraSchema = z.object({
  id: z.string(),
  name: z.string(),
  source: assetSourceSchema,
})
export type Extra = z.infer<typeof extraSchema>

export const copyrightSchema = z.object({
  owner: z.string(),
  license: z.string(),
  licenseUrl: z.string().optional(),
  author: z.string().optional(),
  original: z.boolean().default(true),
  notice: z.string().optional(),
})
export type Copyright = z.infer<typeof copyrightSchema>

export const brandSchema = z.object({
  id: z.string(),
  name: z.string(),
  repo: z.string().optional(),
  ref: z.string().optional(),
  url: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  accent: accentSchema.optional(),
  copyright: copyrightSchema.optional(),
  icon: assetSchema,
  lockups: z.array(lockupSchema).default([]),
  extras: z.array(extraSchema).default([]),
})
export type Brand = z.infer<typeof brandSchema>

export const groupLogoSchema = z.union([
  z.boolean(),
  z.object({ type: z.literal('local'), path: z.string() }),
])

export const groupSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  description: z.string().optional(),
  logo: groupLogoSchema.optional(),
  brands: z.array(brandSchema),
})
export type Group = z.infer<typeof groupSchema>

export const iconsConfigSchema = z.object({
  groups: z.record(z.string(), groupSchema),
})
export type IconsConfig = z.infer<typeof iconsConfigSchema>

export const siteConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  accent: accentSchema,
  ogUrl: z.string(),
  github: z.string(),
  footer: z.string(),
  defaultGroup: z.string(),
  links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
})
export type SiteConfig = z.infer<typeof siteConfigSchema>
