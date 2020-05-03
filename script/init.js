const childProcess = require('child_process')
const path = require('path')
const ACCOUNT_FILE = './account.json'
function getStartCommand() {
  return `${path.join(__dirname, 'carthagenet.sh')} start`
}

function getClientConfigCommand() {
  return `${path.join(__dirname, 'carthagenet.sh')} client -P 443 -A tezos-dev.cryptonomic-infra.tech -S config update`
}

function getClientActivate() {
  // For MacOS? return `${path.join(__dirname, 'carthagenet.sh')} client activate
  // account alice with '${JSON.stringify(account)}'` For Debian10
  return `${path.join(__dirname, 'carthagenet.sh')} client activate account alice with 'container:${ACCOUNT_FILE}'`
}

function deploy() {
  try {
    console.log('start initializing')
    childProcess.execSync(getStartCommand({}))
    childProcess.execSync(getClientConfigCommand({}))
    childProcess.execSync(getClientActivate())
    console.log('initialized')
  } catch (e) {
    if (e.message == `Cannot find module '{ACCOUNT_FILE}'`) {
      console.log(e.message)
      console.log(`Please make '${ACCOUNT_FILE}'`)
    } else if (e.stdout) {
      console.log(e.stdout.toString())
    } else {
      throw e
    }
  }
}

deploy()
