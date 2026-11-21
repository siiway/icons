import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { iconsConfig } from '../app/data/icons.config'
import { ICON_VARIANTS } from '../shared/assets'
import type { IconVariant } from '../shared/assets'

const rootDir = resolve('.')
const iconsDir = join(rootDir, 'icons')
const publicDir = join(rootDir, 'public')
const publicBrandDir = join(publicDir, 'brand')

mkdirSync(publicBrandDir, { recursive: true })

// Check for icon_gen executable
function findIconGen(): string | null {
  const localWin = join(rootDir, '.tools', 'bin', 'icon_gen.exe')
  if (existsSync(localWin)) return localWin

  const localLinux = join(rootDir, '.tools', 'bin', 'icon_gen')
  if (existsSync(localLinux)) return localLinux

  try {
    execSync('icon_gen --help', { stdio: 'ignore' })
    return 'icon_gen'
  } catch {
    return null
  }
}

const iconGenBin = findIconGen()
if (iconGenBin) {
  console.log(`[prepare-icons] Found icon_gen binary: ${iconGenBin}`)
} else {
  console.log('[prepare-icons] icon_gen binary not found in PATH or .tools/bin')
}

function isUpToDate(outputPath: string, sourcePaths: string[]): boolean {
  if (!existsSync(outputPath)) return false
  const outputMtime = statSync(outputPath).mtimeMs
  return sourcePaths.every((sourcePath) => outputMtime > statSync(sourcePath).mtimeMs)
}

async function generateVariantSizePngs(
  dir: string,
  sourceDir: string,
  brandId: string,
  variant: IconVariant,
  sizes: number[],
) {
  const svgPath = join(dir, `${variant}.svg`)
  if (!existsSync(svgPath)) {
    console.warn(`[prepare-icons] Warning: public/brand/${brandId}/${variant}.svg not found`)
    return
  }
  if (!sizes.length) return

  const sourceSvgPath = join(sourceDir, `${variant}.svg`)
  const rendererPath = fileURLToPath(import.meta.url)
  const references = existsSync(sourceSvgPath) ? [sourceSvgPath, rendererPath] : [svgPath, rendererPath]
  const pendingSizes = sizes.filter((size) => !isUpToDate(join(dir, `${variant}-${size}.png`), references))
  if (!pendingSizes.length) return

  const largest = Math.max(...pendingSizes)
  const basePng = new Resvg(readFileSync(svgPath), {
    fitTo: { mode: 'width', value: largest },
  })
    .render()
    .asPng()

  for (const size of pendingSizes) {
    const png = await sharp(basePng).resize(size, size, { fit: 'fill' }).png().toBuffer()
    writeFileSync(join(dir, `${variant}-${size}.png`), png)
  }
}

console.log('[prepare-icons] Generating icon sets...')
const startTime = performance.now()

for (const [groupId, group] of Object.entries(iconsConfig.groups)) {
  for (const brand of group.brands) {
    const brandId = brand.id
    const srcDir = join(iconsDir, brandId)
    const iconSvgPath = join(srcDir, 'icon.svg')

    if (!existsSync(iconSvgPath)) {
      console.warn(`[prepare-icons] Warning: icon.svg not found for ${brandId}`)
      continue
    }

    const brandOutDir = join(publicBrandDir, brandId)
    const legacyOutDir = join(publicDir, brandId)
    mkdirSync(brandOutDir, { recursive: true })

    if (iconGenBin) {
      // icon_gen generates the favicon sets and SVG variants; showcase PNGs are
      // generated below for every variant so all sizes stay in sync.
      execSync(`"${iconGenBin}" -i "${iconSvgPath}" -o "${brandOutDir}"`, {
        stdio: 'inherit',
      })
    }

    // Copy any custom source files from icons/<brandId> that icon_gen might not touch
    for (const file of [
      'icon.svg',
      'icon-light.svg',
      'icon-dark.svg',
      'border.svg',
      'border-light.svg',
      'border-dark.svg',
      'old.svg',
      'README.md',
    ]) {
      const srcFile = join(srcDir, file)
      if (existsSync(srcFile)) {
        cpSync(srcFile, join(brandOutDir, file), { force: true })
      }
    }

    // Generate every variant at the configured showcase sizes
    for (const variant of ICON_VARIANTS) {
      await generateVariantSizePngs(brandOutDir, srcDir, brandId, variant, brand.icon.sizes)
    }
    const icon256Path = join(brandOutDir, 'icon-256.png')
    if (existsSync(icon256Path)) {
      cpSync(icon256Path, join(brandOutDir, 'icon.png'), { force: true })
    } else if (brand.icon.sizes.length) {
      console.warn(`[prepare-icons] Warning: 256px PNG missing for ${brandId}, icon.png not generated`)
    }

    // Mirror to legacy root route (/<brandId>/...)
    cpSync(brandOutDir, legacyOutDir, { recursive: true, force: true })

    console.log(`[prepare-icons] Completed ${brandId}`)
  }
}

// Write app/data/icons.json as mirror
const jsonTarget = join(rootDir, 'app', 'data', 'icons.json')
writeFileSync(jsonTarget, JSON.stringify(iconsConfig, null, 2), 'utf-8')

const elapsed = ((performance.now() - startTime) / 1000).toFixed(2)
console.log(`[prepare-icons] All icon sets generated successfully in ${elapsed}s!`)
