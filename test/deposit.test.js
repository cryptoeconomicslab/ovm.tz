const assert = require('assert')
const { invokeTest, STATUS } = require('./helper/invokeTest')
const { rmWhiteSpaces, initialStorage } = require('./helper/utils')

describe('DepositContract', function() {
  this.timeout(20000)

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
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
        sender: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.equal(result.status, STATUS.OK)
      // check event
      assert.deepEqual(
        result.postState.events_storage.events.CheckpointFinalized,
        [
          {
            data: [
              'CheckpointFinalizedEvent',
              [
                'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
                '0x6ea2433c4521befc68eeb0295eb0025c22c681fb9ae270f1a3a892233a6e7920',
                {
                  subrange: { start_: 0, end_: 1 },
                  state_update: {
                    range: { start_: 0, end_: 1 },
                    property: {
                      predicate_address: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
                      inputs: ['0x53c1edca8bd5c21c61d6f1fd091fa51d562aff1d']
                    },
                    plasma_block_number: 0,
                    deposit_address: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
                  }
                }
              ]
            ],
            block_height: 0
          }
        ]
      )
    })

    it('deposit 1 tz without sender', async () => {
      const result = await invokeTest({
        parameter: testParams,
        initialStorage
      })
      assert.equal(result.status, STATUS.OK)
    })
  })
})
