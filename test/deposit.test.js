const assert = require('assert')
const invokeTest = require('./helper/invokeTest')
const { rmWhiteSpaces, initialStorage } = require('./helper/utils')

describe('DepositContract', function() {
  this.timeout(10000)

  describe('Deposit', () => {
    const testParams = rmWhiteSpaces(`Deposit(
  record
	  token_type = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);
	  amount = 1n;
  end
)`)

    it('deposit 1 tz', async () => {
      const result = await invokeTest({
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.equal(result.status, 'ok')
      // check event
      assert.deepEqual(result.postState.events_storage.events.Deposited, [
        {
          block_height: 0,
          data: ['DepositedEvent', ['tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV', 1]]
        }
      ])
    })

    it('deposit 1 tz without sender', async () => {
      const result = await invokeTest({
        parameter: testParams,
        initialStorage
      })
      assert.equal(result.status, 'ok')
    })
  })
})
