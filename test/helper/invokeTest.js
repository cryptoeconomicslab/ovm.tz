const childProcess = require('child_process')
const parseLIGO = require('./parse')

function getCommand({
  parameter,
  initialStorage,
  contractPath = 'contracts/main.ligo',
  entryPoint = 'main',
  source
}) {
  const command = `ligo dry-run ${contractPath} ${entryPoint} '${parameter}' '${initialStorage}' --amount=1 ${
    source ? `--source=${source}` : ''
  } --format=json`
  return command
}

module.exports = function(options) {
  let result = JSON.parse(childProcess.execSync(getCommand(options)).toString())
  result.postState = parseLIGO(result.content)
  return result
}
