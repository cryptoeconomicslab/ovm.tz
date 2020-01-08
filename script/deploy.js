const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const { rmWhiteSpaces } = require('../test/helper/utils')

function getDeployCommand({ bytecode, initialStorage }) {
  return `${path.join(
    __dirname,
    'babylonnet.sh'
  )} client originate contract ovm_contract_test transferring 0 from alice running \
  '${bytecode}' \
  -init '${initialStorage}' \
  --burn-cap 5.337`
}

function deploy() {
  const parameter = rmWhiteSpaces(
    fs.readFileSync(path.join(__dirname, '../build', 'main.tz')).toString()
  )
  const initialStorage = rmWhiteSpaces(
    fs.readFileSync(path.join(__dirname, '../build', 'storage.tz')).toString()
  )
  try {
    const command = getDeployCommand({
      bytecode: parameter,
      initialStorage: initialStorage
    })
    const result = childProcess.execSync(command).toString()
    console.log('deployed!')
    return result
  } catch (e) {
    console.error(e.stdout.toString())
  }
}

deploy()
