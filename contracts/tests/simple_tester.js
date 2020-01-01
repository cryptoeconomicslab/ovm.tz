const chalk = require("chalk")
const figlet = require("figlet")
const inquirer = require("inquirer")
const clear = require("clear")
const clui = require("clui")
const shell = require("shelljs/global")
const child_process = require("child_process")
var argv = require('minimist')(process.argv.slice(2));
const ALL_PHRASE = "Test All✋"
let currentDir = pwd().toString().split("/").pop()
let TEST_BASEDIR = currentDir === "contracts" ? "./tests" : "./contracts/tests"
const Diff = require('diff')

clear()
console.log(
  chalk.yellow(figlet.textSync("ovm.tz", { horizontalLayout: 'full' }))
)
process.stdout.write('\n');

const Spinner = clui.Spinner
let countdown = new Spinner(`Test Running...`, ['◜','◠','◝','◞','◡','◟']);
let testfiles = ls(TEST_BASEDIR).filter(name=>{
  let matched = name.match(/test_.+_[0-9]{3}\.sh/)
  return !!matched && matched.length > 0
})
testfiles.unshift(ALL_PHRASE)

;(
  (!!argv._[1] && argv._[1].length > 0) ?
    ask(testfiles)
  :
    (argv._[0] == "all") ? 
      skip(testfiles)
    :
      ask(testfiles)
)
.then(res=>{
  countdown.start();
  let i = 1
  let pid = setInterval(_=>{
    if (i === 0) {
      process.stdout.write('\n');
      countdown.stop()

      let selectedTestfiles;
      clearInterval(pid)
      if(res.selectedTestfiles[0] == ALL_PHRASE){
        testfiles.shift()
        selectedTestfiles = testfiles;
      } else {
        selectedTestfiles = res.selectedTestfiles
      }
      selectedTestfiles.map(name=>{
        let shellResult = child_process.spawnSync(`bash`, [`${TEST_BASEDIR}/${name}`], {stdio: [process.stdin, 'pipe', 'pipe']})
        shellResult.command = name
        return shellResult
      }).map(res=>{
        process.stdout.write('\n');
        if(res.status !== 0) {
          echo(chalk.white.bgRed(`### Failed: ${res.command} `));
          if(!!res.stderr || !!res.stdout){
            echo(chalk.red(`Stdout: ${res.stdout.toString()}`));
            echo(chalk.red(`Stderr: ${res.stderr.toString()}`));
          } else {
            echo(chalk.white(`No error message.`));
          }
        } else {
          echo(chalk.white.bgGreen(`### Passed: ${res.command} ]]]`));
          if(res.stdout){
            let initialStorage = cat(`${TEST_BASEDIR}/storages/initial_storage`).stdout
            let resultStorage = /tuple\[\s+list\[\s+Operation\(.+\)\s+\]((.|\s)+)\s+\]/
              .exec(res.stdout.toString())[1]

            let changes = Diff.diffTrimmedLines(initialStorage, resultStorage)
            let readableChanges = changes.map(diff=>{
              console.log("diff.value", diff.value)
              console.log('-----------------------')
              return diff.value
              .replace(/(\]|end;|end)/g,"")//TODO: deposited_range.end_ is being affected
              .split(/\r\n|\r|\n/)
                .join("\n") 
            }).join("==================================\n")
            // TODO: Currently we have only an option: eye grepping
            // (Because the pre(michelson) - post(dry-run) data format is incomparable.) 
            console.log('changes', readableChanges)
          } else {
            echo(chalk.white(`No outputs.`));
          }
        }
      })
    }
    i--;
  }, 1000)
}).catch(err=>{ console.error(err) })




function ask(testfiles){
  return inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Which will you test?',
      name: 'selectedTestfiles',
      choices: testfiles,
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one test.';
        }
        return true;
      }
    }
  ])
}

function skip(testfiles){
  console.log(testfiles[0]);
  return new Promise((resolve, reject)=>{
    resolve({ selectedTestfiles: [testfiles[0]] })
  })
}