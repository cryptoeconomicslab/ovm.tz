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
      // check event
      assert.deepEqual(result.postState.events[0], {
        '"Deposited"': [
          {
            block_height: 0,
            data:
              '0x05010000003a7b746f6b656e5f747970653a747a3154477536544e354753657a326e645858654458364c675544764c7a504c716759562c616d6f756e743a317d'
          }
        ]
      })
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
