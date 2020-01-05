const assert = require('assert')
const invokeTest = require('./helper/invokeTest')
const { rmWhiteSpaces, initialStorage } = require('./helper/utils')

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
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.equal(result.status, 'ok')
      // TODO: parse content
      // assert.equal(result.content, initialStorage)
    })

    it('deposit 1 tz without sender', () => {
      const result = invokeTest({
        parameter: testParams,
        initialStorage
      })
      assert.equal(result.status, 'ok')
    })
  })
})
