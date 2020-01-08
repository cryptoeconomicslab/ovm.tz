const childProcess = require('child_process')

module.exports = function(args) {
  return childProcess.spawnSync('ligo', args, {
    stdio: [process.stdin, 'pipe', 'pipe']
  }).stdout
}
