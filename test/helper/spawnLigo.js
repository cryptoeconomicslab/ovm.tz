const childProcess = require('child_process')

module.exports = function(args) {
  console.log(args)
  const subProcess = childProcess.spawnSync('ligo', args, {
    stdio: [process.stdin, 'pipe', 'pipe']
  })
  console.log(subProcess.stderr.toString())
  return subProcess.stdout
}
