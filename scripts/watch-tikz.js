const chokidar = require('chokidar')
const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')

const inputDir = path.join(__dirname, '../docs/tikz')
const outputDir = path.join(__dirname, '../docs/public/tikz')

fs.ensureDirSync(outputDir)

// 缓存：记录上次修改时间
const cache = new Map()

function build(filePath) {
  const stat = fs.statSync(filePath)
  const lastModified = stat.mtimeMs

  if (cache.get(filePath) === lastModified) {
    return // 没变化，跳过
  }

  cache.set(filePath, lastModified)

  const dir = path.dirname(filePath)
  const name = path.basename(filePath, '.tex')

  console.log(`🔄 Building ${name}.tex`)

  try {
    execSync(
      `latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build ${name}.tex`,
      {
        cwd: dir,
        stdio: 'inherit',
      },
    )
    execSync(`pdf2svg build/${name}.pdf ${outputDir}/${name}.svg`, {
      cwd: dir,
      stdio: 'ignore',
    })

    execSync(`svgo ${outputDir}/${name}.svg`, { cwd: dir })

    console.log(`✅ Done: ${name}.svg`)
  } catch {
    console.log(`❌ Error: ${name}`)
  }
}

chokidar
  .watch(inputDir, { ignoreInitial: false })
  .on('add', build)
  .on('change', build)

console.log('👀 Watching (incremental mode)...')
