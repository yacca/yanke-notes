const { exec } = require('child_process')
const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')

const inputDir = path.join(__dirname, '../docs/tikz')
const outputDir = path.join(__dirname, '../docs/public/tikz')

fs.ensureDirSync(outputDir)

const files = glob.sync('**/*.tex', { cwd: inputDir })

function run(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

async function build(file) {
  const name = path.basename(file, '.tex')
  const dir = path.join(inputDir, path.dirname(file))

  console.log(`🔧 ${file}`)

  try {
    await run(
      `latexmk -pdf -interaction=nonstopmode -halt-on-error -silent -outdir=build ${name}.tex`,
      dir,
    )
    await run(`pdf2svg build/${name}.pdf ${outputDir}/${name}.svg`, dir)
    await run(`svgo ${outputDir}/${name}.svg`, dir)

    console.log(`✅ ${name}`)
  } catch {
    console.log(`❌ ${name}`)
  }
}

;(async () => {
  await Promise.all(files.map(build))
  console.log('🚀 All done (parallel)')
})()
