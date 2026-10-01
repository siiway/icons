import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { iconsConfig } from '../app/data/icons.config'

const rootDir = resolve('.')
const iconsDir = join(rootDir, 'icons')
const publicBrandDir = join(rootDir, 'public', 'brand')

mkdirSync(publicBrandDir, { recursive: true })

for (const [groupId, group] of Object.entries(iconsConfig.groups)) {
  for (const brand of group.brands) {
    const brandId = brand.id
    const targetBrandDir = join(publicBrandDir, brandId)
    mkdirSync(targetBrandDir, { recursive: true })

    const srcDir = join(iconsDir, brandId)
    const iconSvgPath = join(srcDir, 'icon.svg')

    if (existsSync(iconSvgPath)) {
      // Copy main icon.svg
      cpSync(iconSvgPath, join(targetBrandDir, 'icon.svg'), { force: true })

      // Also copy variants if they exist in source
      for (const variant of ['icon-light.svg', 'icon-dark.svg', 'border.svg', 'border-light.svg', 'border-dark.svg', 'old.svg']) {
        const vPath = join(srcDir, variant)
        if (existsSync(vPath)) {
          cpSync(vPath, join(targetBrandDir, variant), { force: true })
        }
      }

      console.log(`[prepare-icons] Synced SVG assets for ${brandId}`)
    } else {
      console.warn(`[prepare-icons] Warning: icon.svg not found for ${brandId} at ${iconSvgPath}`)
    }
  }
}

// Write app/data/icons.json as mirror
const jsonTarget = join(rootDir, 'app', 'data', 'icons.json')
writeFileSync(jsonTarget, JSON.stringify(iconsConfig, null, 2), 'utf-8')
console.log(`[prepare-icons] Updated ${jsonTarget}`)
