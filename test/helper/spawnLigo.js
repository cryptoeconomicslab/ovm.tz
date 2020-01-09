const childProcess = require('child_process')

module.exports = function(args) {
  const subProcess = childProcess.spawnSync('ligo', args, {
    stdio: [process.stdin, 'pipe', 'pipe']
  })
  console.log(subProcess.stderr.toString())
  console.log(subProcess.stdout.toString())

  return subProcess.stdout
}
