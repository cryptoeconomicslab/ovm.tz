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
      inputs = map 0n -> ("050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d":bytes) end;
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
                '0xce6170f820c3599b11cf1d9f606522c8b03ddce4c9ca4c6dbcd30d10f3099e14',
                {
                  subrange: { start_: 1, end_: 2 },
                  state_update: {
                    predicate_address: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
                    inputs: {
                      '0':
                        '0x050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d',
                      '1': '0x05070700010002',
                      '2': '0x050000',
                      '3':
                        '0x0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000025070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
                    }
                  }
                }
              ]
            ],
            block_height: 0
          }
        ]
      )

      assert.deepEqual(
        result.postState.branches['tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV']
          .deposited_ranges,
        { '2': { start_: 0, end_: 2 } }
      )

      assert.equal(
        result.postState.branches['tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV']
          .total_deposited,
        2
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

  describe('FinalizeCheckpoint', () => {
    const testParams = rmWhiteSpaces(`FinalizeCheckpoint(
  record
	  token_type = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);
    checkpoint_property = record
      predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV": address);
      inputs = map
        0n -> ("05070700010002": bytes);
        1n -> ("0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000092070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d070400010a0000000705070700010002070400020a00000003050000070400030a000000480507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000025070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d": bytes);
      end;
    end;
  end
)`)

    it('finalize checkpoint 1 to 2', async () => {
      const result = await invokeTest({
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
        sender: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.deepEqual(
        result.postState.events_storage.events.CheckpointFinalized,
        [
          {
            data: [
              'CheckpointFinalizedEvent',
              [
                'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
                '0xce6170f820c3599b11cf1d9f606522c8b03ddce4c9ca4c6dbcd30d10f3099e14',
                {
                  subrange: { start_: 1, end_: 2 },
                  state_update: {
                    predicate_address: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
                    inputs: {
                      '0':
                        '0x050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d',
                      '1': '0x05070700010002',
                      '2': '0x050000',
                      '3':
                        '0x0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000025070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
                    }
                  }
                }
              ]
            ],
            block_height: 0
          }
        ]
      )
    })
  })
})
