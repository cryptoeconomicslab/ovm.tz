const fs = require('fs')
const path = require('path')

const rmWhiteSpaces = s => s.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')

const initialStorage = rmWhiteSpaces(
  fs
    .readFileSync(path.join(__dirname, '../testdata/initial_storage'))
    .toString()
)

const releaseInitialStorage = rmWhiteSpaces(
  fs.readFileSync(path.join(__dirname, '../testdata/release')).toString()
)

module.exports = {
  rmWhiteSpaces,
  initialStorage,
  releaseInitialStorage
}
