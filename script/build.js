const spawnLigo = require('../test/helper/spawnLigo')
const path = require('path')
const fs = require('fs')
const { initialStorage } = require('../test/helper/utils')

function getCompileSourceArgs({
  initialStorage,
  contractPath = 'contracts/main.ligo',
  entryPoint = 'main'
}) {
  return ['compile-contract', contractPath, entryPoint]
}

function getCompileStorageArgs({
  initialStorage,
  contractPath = 'contracts/main.ligo',
  entryPoint = 'main'
}) {
  return ['compile-storage', contractPath, entryPoint, `${initialStorage}`]
}

function build({ output = path.join(__dirname, '../build') }) {
  const compiledSource = spawnLigo(
    getCompileSourceArgs({
      initialStorage,
      entryPoint: 'main'
    })
  )
  const compiledStorage = spawnLigo(
    getCompileStorageArgs({
      initialStorage,
      entryPoint: 'main'
    })
  )

  try {
    fs.mkdirSync(output)
  } catch (e) {}
  fs.writeFileSync(path.join(output, 'main.tz'), compiledSource.toString())
  fs.writeFileSync(path.join(output, 'storage.tz'), compiledStorage.toString())
}

build({})
