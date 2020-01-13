const parseLIGO = require('./parse')
const spawnLigo = require('./spawnLigo')
const STATUS = {
  OK: 'ok',
  ERROR: 'error'
}
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

module.exports = {
  STATUS: STATUS,
  invokeTest: function(options) {
    let resultStr = spawnLigo(getArgs(options)).toString()
    let result = JSON.parse(
      resultStr.slice(0, 6) === 'ligo: '
        ? resultStr.slice(6, resultStr.length)
        : resultStr
    )

    let parsed
    try {
      parsed = parseLIGO(result.content)
      result.postState = parsed
    } catch (e) {
      if (result.content.title === 'error of execution') {
        let failwithMessage = JSON.parse(result.content.children[0].message)
        result.postState = failwithMessage
      } else {
        throw new Error(`parseLIGO failed with ${resultStr}`)
      }
    }
    return result
  }
}
