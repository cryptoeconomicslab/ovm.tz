const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const { initialStorage } = require('../test/helper/utils')

function getCommand({
  initialStorage,
  contractPath = 'contracts/main.ligo',
  entryPoint = 'main'
}) {
  return `ligo compile-contract ${contractPath} ${entryPoint}`
}

function getCompileStorageCommand({
  initialStorage,
  contractPath = 'contracts/main.ligo',
  entryPoint = 'main'
}) {
  return `ligo compile-storage ${contractPath} ${entryPoint} '${initialStorage}'`
}

function build({ output = path.join(__dirname, '../build') }) {
  const result = childProcess
    .execSync(
      getCommand({
        initialStorage,
        entryPoint: 'main'
      })
    )
    .toString()
  const resultStorage = childProcess
    .execSync(
      getCompileStorageCommand({
        initialStorage,
        entryPoint: 'main'
      })
    )
    .toString()

  try {
    fs.mkdirSync(output)
  } catch (e) {
    console.error(e)
  }
  fs.writeFileSync(path.join(output, 'main.tz'), result)
  fs.writeFileSync(path.join(output, 'storage.tz'), resultStorage)
}

build({})
