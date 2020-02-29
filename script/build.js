const spawnLigo = require('../test/helper/spawnLigo')
const path = require('path')
const fs = require('fs')
const { releaseInitialStorage } = require('../test/helper/utils')

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
  entryPoint = 'main',
  format = 'text'
}) {
  return [
    'compile-storage',
    contractPath,
    entryPoint,
    `${initialStorage}`,
    `--michelson-format=${format}`
  ]
}

function getCompileParameterArgs({
  contractPath = 'contracts/main.ligo',
  entryPoint = 'main',
  parameterExpression,
  format = 'json'
}) {
  return [
    'compile-parameter',
    contractPath,
    entryPoint,
    `${parameterExpression}`,
    `--michelson-format=${format}`
  ]
}

function build({ output = path.join(__dirname, '../build'), format = 'text' }) {
  const compiledSource = spawnLigo(
    getCompileSourceArgs({
      initialStorage: releaseInitialStorage,
      entryPoint: 'main'
    })
  )
  const compiledStorage = spawnLigo(
    getCompileStorageArgs({
      initialStorage: releaseInitialStorage,
      entryPoint: 'main',
      format: format
    })
  )

  try {
    fs.mkdirSync(output)
  } catch (e) {}
  fs.writeFileSync(path.join(output, 'main.tz'), compiledSource.toString())
  if (format == 'json') {
    fs.writeFileSync(
      path.join(output, 'storage.json'),
      compiledStorage.toString()
    )
  } else {
    fs.writeFileSync(
      path.join(output, 'storage.tz'),
      compiledStorage.toString()
    )
  }
}

build({ format: process.argv[2] })
