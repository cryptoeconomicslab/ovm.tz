const parseLIGO = require('./parse')
const spawnLigo = require('./spawnLigo')

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

module.exports = function(options) {
  let resultStr = spawnLigo(getArgs(options)).toString()

  let isDebug = false
  isDebug = true
  if (isDebug && resultStr.slice(0, 6) === 'ligo: ') {
    resultStr = resultStr.slice(6, resultStr.length)
    console.error(JSON.parse(resultStr).content)
    throw new Error("Couldn't parse stdout.")
  }
  let result = JSON.parse(resultStr)
  result.postState = parseLIGO(result.content)
  return result
}
