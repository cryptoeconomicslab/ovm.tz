const parseLIGO = require('./parse')
const spwanLigo = require('./spawnLigo')

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
  let result = JSON.parse(spwanLigo(getArgs(options)).toString())
  result.postState = parseLIGO(result.content)
  return result
}
