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

    // let result
    // if (resultStr.slice(0, 6) === 'ligo: ') {
    //   // const MESSAGE_START_TOKEN = '"message":"'
    //   // const MESSAGE_END_TOKEN = '}","type"'
    //   // const MESSAGE_START_INDEX =
    //   //   resultStr.indexOf(MESSAGE_START_TOKEN) + MESSAGE_START_TOKEN.length
    //   // const MESSAGE_END_INDEX = resultStr.indexOf(MESSAGE_END_TOKEN) + 1
    //   // const MESSAGE_LENGTH = MESSAGE_END_INDEX - MESSAGE_START_INDEX
    //   // let messageStr = resultStr.slice(
    //   //   MESSAGE_START_INDEX,
    //   //   MESSAGE_START_INDEX + MESSAGE_LENGTH
    //   // )
    //   // messageStr = messageStr.replace(/\\"/g, '"').replace(/\\n/g, '')
    //   // console.log(messageStr)
    //   // result = {
    //   //   status: 'ok',
    //   //   content: JSON.parse(messageStr)
    //   // }

    //   //TODO: Travis Result always doesn't have backslack and it causes bug.
    //   // let travisResult = '{"status":"error","content":{"title":"error of execution","type":"error","children":[{"title":"alpha error","message":"{ "kind": "temporary",\n  "id": "proto.005-PsBabyM1.michelson_v1.script_rejected", "location": 0,\n  "with": { "string": "block_number should be next block" } }","type":"error","children":[],"infos":[]}],"infos":[]}}'
    //   // .replace(/\\"/g, '"')
    //   // .replace(/\n/g, '')
    //   // console.log('travisResult:', travisResult)
    //   // console.log('resultStr:', resultStr)
    //   result = JSON.parse(resultStr)
    // } else {
    //   result = JSON.parse(resultStr)
    // }
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
