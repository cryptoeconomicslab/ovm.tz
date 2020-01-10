const childProcess = require('child_process')
const path = require('path')

function getStartCommand() {
  return `${path.join(__dirname, 'babylonnet.sh')} start`
}

function getClientConfigCommand() {
  return `${path.join(
    __dirname,
    'babylonnet.sh'
  )} client -P 443 -A tezos-dev.cryptonomic-infra.tech -S config update`
}

function getClientActivate({ account }) {
  return `${path.join(
    __dirname,
    'babylonnet.sh'
  )} client activate account alice with '${JSON.stringify(account)}'`
}

function deploy() {
  try {
    console.log('start initializing')
    childProcess.execSync(getStartCommand({}))
    childProcess.execSync(getClientConfigCommand({}))
    childProcess.execSync(
      getClientActivate({ account: require('../account.json') })
    )
    console.log('initialized')
  } catch (e) {
    if (e.message == "Cannot find module '../account.json'") {
      console.log(e.message)
      console.log('Please make account.json')
    } else if (e.stdout) {
      console.log(e.stdout.toString())
    } else {
      throw e
    }
  }
}

deploy()
