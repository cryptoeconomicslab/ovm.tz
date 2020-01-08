const childProcess = require('child_process')
const parseLIGO = require('./parse')

function getArgs({
  parameter,
  initialStorage,
  contractPath = 'contracts/main.ligo',
  entryPoint = 'main',
  source
}) {
  let args = [
    'dry-run',
    contractPath,
    entryPoint,
    `${parameter}`,
    `${initialStorage}`,
    '--amount=1',
    '--format=json'
  ]
  if (source) args.push(`--source=${source}`)
  return args
}

function getOpts() {
  return {
    stdio: [process.stdin, 'pipe', 'pipe']
  }
}

module.exports = function(options) {
  let result = JSON.parse(
    childProcess
      .spawnSync('ligo', getArgs(options), getOpts())
      .stdout.toString()
  )
  result.postState = parseLIGO(result.content)
  return result
}
