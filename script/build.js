const spwanLigo = require('../test/helper/spawnLigo')
const path = require('path')
const fs = require('fs')
const { initialStorage, rmWhiteSpaces } = require('../test/helper/utils')

const eventRecieverInitialStorage = rmWhiteSpaces(
  fs
    .readFileSync(
      path.join(__dirname, '../contracts/event_receiver/initial_storage')
    )
    .toString()
)

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
  const compiledSource = spwanLigo(
    getCompileSourceArgs({
      initialStorage,
      entryPoint: 'main'
    })
  )
  const compiledStorage = spwanLigo(
    getCompileStorageArgs({
      initialStorage,
      entryPoint: 'main'
    })
  )
  const compiledEventStorage = spwanLigo(
    getCompileStorageArgs({
      initialStorage: eventRecieverInitialStorage,
      contractPath: 'contracts/event_receiver/main.ligo',
      entryPoint: 'main'
    })
  )

  try {
    fs.mkdirSync(output)
  } catch (e) {}
  try {
    fs.mkdirSync(path.join(output, 'event_receiver'))
  } catch (e) {}
  fs.writeFileSync(path.join(output, 'main.tz'), compiledSource.toString())
  fs.writeFileSync(path.join(output, 'storage.tz'), compiledStorage.toString())
  fs.writeFileSync(
    path.join(output, 'event_receiver', 'storage.tz'),
    compiledEventStorage.toString()
  )
}

build({})
