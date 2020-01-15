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
  if (source) 
    args.push(`--source=${source}`)
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
  if (resultStr.slice(0, 6) === "ligo: ") {
    resultStr = sanitizeString(resultStr)
    result = parseFailwithResult(resultStr)
  } else {
    result = JSON.parse(resultStr)
  }
  return result
}

function parseFailwithResult(resultStr) {
  const MESSAGE_START_TOKEN = '"message":"'
  const MESSAGE_END_TOKEN = '}","type"'
  const MESSAGE_START_INDEX = resultStr.indexOf(MESSAGE_START_TOKEN) + MESSAGE_START_TOKEN.length
  const MESSAGE_END_INDEX = resultStr.indexOf(MESSAGE_END_TOKEN) + 1
  const MESSAGE_LENGTH = MESSAGE_END_INDEX - MESSAGE_START_INDEX
  let messageStr = resultStr.slice(MESSAGE_START_INDEX, MESSAGE_START_INDEX + MESSAGE_LENGTH)

  let messageObject = JSON.parse(messageStr)

  let hollowedResultStr = resultStr.slice(0, MESSAGE_START_INDEX) + resultStr.slice(MESSAGE_START_INDEX + MESSAGE_LENGTH, resultStr.length)
  let resultObject = JSON.parse(hollowedResultStr.slice(0, 6) === 'ligo: '
    ? hollowedResultStr.slice(6, hollowedResultStr.length)
    : hollowedResultStr)

  resultObject.content.message = {}
  resultObject.content.message.children = [messageObject]
  resultObject.content.title = "error of execution"
  return resultObject
}

function applyParsedLIGO(result) {
  let parsed
  try {
    // Success case: LIGO output will be here
    parsed = parseLIGO(result.content)
    result.postState = parsed
  } catch (e) {
    // Failure case
    if (result.content.title === 'error of execution') {
      // failwith error report
      result.postState = result.content
    } else {
      // compile error and so on
      throw new Error(`parseLIGO failed with ${JSON.stringify(result)}`)
    }
  }
  return result
}

module.exports = {
  STATUS: STATUS,
  invokeTest: function (options) {
    let resultStr = spawnLigo(getArgs(options)).toString()
    let result = parseResult(resultStr)
    reselt = applyParsedLIGO(result)
    return result
  }
}