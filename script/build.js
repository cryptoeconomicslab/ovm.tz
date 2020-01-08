const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const { initialStorage } = require('../test/helper/utils')

function getCompileSourceCommand({
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
  const outputOfCompileSource = childProcess.execSync(
    getCompileSourceCommand({
      initialStorage,
      entryPoint: 'main'
    })
  )
  const outputOfCompileStorage = childProcess.execSync(
    getCompileStorageCommand({
      initialStorage,
      entryPoint: 'main'
    })
  )

  try {
    fs.mkdirSync(output)
  } catch (e) {}
  fs.writeFileSync(
    path.join(output, 'main.tz'),
    outputOfCompileSource.toString()
  )
  fs.writeFileSync(
    path.join(output, 'storage.tz'),
    outputOfCompileStorage.toString()
  )
}

build({})
