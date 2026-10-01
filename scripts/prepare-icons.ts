import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { iconsConfig } from '../app/data/icons.config'

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
      // Run icon_gen with -s to generate all showcase sizes + standard favicon sets
      execSync(`"${iconGenBin}" -i "${iconSvgPath}" -o "${brandOutDir}" -s`, {
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
