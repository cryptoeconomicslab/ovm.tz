const assert = require('assert')
const invokeTest = require('./helper/invokeTest')
const fs = require('fs')
const path = require('path')

const rmWhiteSpaces = s => s.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')

const initialStorage = rmWhiteSpaces(
  fs.readFileSync(path.join(__dirname, './testdata/initial_storage')).toString()
)

describe('DepositContract', function() {
  this.timeout(5000)

  describe('Deposit', () => {
    const testParams = rmWhiteSpaces(`Deposit(
  record
	  token_type = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);
	  token_type_string = "tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV";
	  amount = 1n;
	  amount_string = "1";
  end
)`)

    it('deposit 1 tz', () => {
      const result = invokeTest({
        parameter: testParams,
        initialStorage
      })
      assert.equal(result.status, 'ok')
      // TODO: parse content
      // assert.equal(result.content, initialStorage)
    })
  })
})
