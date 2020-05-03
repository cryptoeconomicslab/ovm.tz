const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const {rmWhiteSpaces} = require('../test/helper/utils')

function getDeployCommand({bytecode, initialStorage}) {
  return `${path.join(__dirname, 'carthagenet.sh')} client originate contract ovm_contract_test transferring 0 from alice running \
  '${bytecode}' \
  -init '${initialStorage}' \
  --burn-cap 100`
}

function deploy(buildDir) {
  const parameter = rmWhiteSpaces(fs.readFileSync(path.join(buildDir, 'main.tz')).toString())
  const initialStorage = rmWhiteSpaces(fs.readFileSync(path.join(buildDir, 'storage.tz')).toString())
  try {
    const deployCommand = getDeployCommand({bytecode: parameter, initialStorage: initialStorage})
    console.log('Deploying')
    const outputOfDeploy = childProcess
      .execSync(deployCommand)
      .toString()
    console.log('Deployed!')
    return outputOfDeploy
  } catch (e) {
    console.error(e.stdout.toString())
  }
}

deploy(path.join(__dirname, '../build'))
