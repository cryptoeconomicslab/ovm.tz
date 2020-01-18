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
    state_object = record
      predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);
      inputs = list ("050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d":bytes) end;
    end;
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
                '0x611050bb088be105b193a250bef9c4bebec26be512e9a29787f315fa30b5748c',
                {
                  subrange: { start_: 0, end_: 1 },
                  state_update: {
                    predicate_address: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
                    inputs: [
                      '0x05070700000001',
                      '0x050000',
                      '0x050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d',
                      '0x0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d02000000210a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
                    ]
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
