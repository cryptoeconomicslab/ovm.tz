const childProcess = require('child_process')

function getCommand({
  parameter,
  initialStorage,
  contractPath = 'contracts/main.ligo',
  entryPoint = 'main',
  source = 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
}) {
  const command = `ligo dry-run ${contractPath} ${entryPoint} '${parameter}' '${initialStorage}' --amount=1 --source=${source} --format=json`
  return command
}

module.exports = function(options) {
  return JSON.parse(childProcess.execSync(getCommand(options)).toString())
}
