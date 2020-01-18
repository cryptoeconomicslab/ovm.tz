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
  source,
  sender
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
  if (sender) args.push(`--sender=${sender}`)
  return args
}

function sanitizeString(resultStr) {
  return resultStr
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
}
function parseResult(resultStr) {
  let result

  // TODO: resultStr can be null in the Travis CI env
  if (resultStr.slice(0, 6) == 'ligo: ') {
    result = parseFailwithResult(resultStr)
  } else {
    result = JSON.parse(resultStr)
  }
  return result
}
function parseFailwithResult(resultStr) {
  let resultObject = JSON.parse(resultStr.slice(6, resultStr.length))
  resultObject.content.children[0].message = JSON.parse(
    sanitizeString(resultObject.content.children[0].message)
  )
  return resultObject
}
function applyParsedLIGO(result) {
  try {
    // Success case: LIGO output will be here
    result.postState = parseLIGO(result.content)
  } catch (e) {
    // Failure case
    if (result.content.title === 'error of execution') {
      // failwith error report
      result.postState = result.content
    } else if (result.content.indexOf('failwith') === 0) {
      const matched = result.content.match(/failwith\("([ -~]*)"\)/)
      result.status = 'error'
      result.failwith = matched[1]
    } else {
      // compile error and so on
      console.log(result.content)
      throw e
    }
  }
  return result
}

module.exports = {
  STATUS: STATUS,
  invokeTest: function(options) {
    let resultStr = spawnLigo(getArgs(options)).toString()
    let result = parseResult(resultStr)
    return applyParsedLIGO(result)
  }
}
