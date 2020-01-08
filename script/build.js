const childProcess = require('child_process')
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
  return ['compile-storage', contractPath, entryPoint, `'${initialStorage}'`]
}

function getOpts() {
  return {
    stdio: [process.stdin, 'pipe', 'pipe']
  }
}
function build({ output = path.join(__dirname, '../build') }) {
  const compiledSource = childProcess.spawnSync(
    'ligo',
    getCompileSourceArgs({
      initialStorage,
      entryPoint: 'main'
    }),
    getOpts()
  )
  const compiledStorage = childProcess.spawnSync(
    'ligo',
    getCompileStorageArgs({
      initialStorage,
      entryPoint: 'main'
    }),
    getOpts()
  )

  try {
    fs.mkdirSync(output)
  } catch (e) {}
  fs.writeFileSync(path.join(output, 'main.tz'), compiledSource.toString())
  fs.writeFileSync(path.join(output, 'storage.tz'), compiledStorage.toString())
}

build({})
