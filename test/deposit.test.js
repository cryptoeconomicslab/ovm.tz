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
        result.postState.events_storage.events.CheckpointFinalized[0],
        {
          data: [
            '0x050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d',
            '0x050a0000002028f3a910172a1fd70d8d172600485c764c82761702e650e45448ca53c2135092',
            '0x05070707070200000092070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d070400010a0000000705070700020003070400020a00000003050000070400030a000000480507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000025070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d070700030002'
          ],
          block_height: 0
        }
      )
      const deposit_storage =
        result.postState.deposit_storages[
          'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
        ]
      assert.deepEqual(
        result.postState.deposit_storages[
          'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
        ].deposited_ranges,
        { '3': { start_: 0, end_: 3 } }
      )

      assert.equal(
        result.postState.deposit_storages[
          'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
        ].total_deposited,
        3
      )
      assert.deepEqual(
        deposit_storage.checkpoints[
          '0x28f3a910172a1fd70d8d172600485c764c82761702e650e45448ca53c2135092'
        ],
        {
          subrange: { start_: 2, end_: 3 },
          state_update: {
            predicate_address: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
            inputs: {
              '0': '0x050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d',
              '1': '0x05070700020003',
              '2': '0x050000',
              '3':
                '0x0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000025070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
            }
          }
        }
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
        result.postState.events_storage.events.CheckpointFinalized[0],
        {
          data: [
            '0x050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d',
            '0x050a00000020ce6170f820c3599b11cf1d9f606522c8b03ddce4c9ca4c6dbcd30d10f3099e14',
            '0x05070707070200000092070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d070400010a0000000705070700010002070400020a00000003050000070400030a000000480507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000025070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d070700020001'
          ],
          block_height: 0
        }
      )
      const deposit_storage =
        result.postState.deposit_storages[
          'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
        ]
      assert.equal(deposit_storage.total_deposited, 2)
      assert.deepEqual(deposit_storage.deposited_ranges, {
        2: { start_: 0, end_: 2 }
      })
      assert.deepEqual(
        deposit_storage.checkpoints[
          '0xce6170f820c3599b11cf1d9f606522c8b03ddce4c9ca4c6dbcd30d10f3099e14'
        ],
        {
          subrange: { start_: 1, end_: 2 },
          state_update: {
            predicate_address: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
            inputs: {
              '0': '0x050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d',
              '1': '0x05070700010002',
              '2': '0x050000',
              '3':
                '0x0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000025070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
            }
          }
        }
      )
    })
  })

  describe('FinalizeExit', () => {
    const testParams = rmWhiteSpaces(`FinalizeExit(
  record
	  token_type = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);
    exit_property = record
      predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV": address);
      inputs = map
        0n -> ("05070700010002": bytes);
        1n -> ("0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000092070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d070400010a0000000705070700010002070400020a00000003050000070400030a000000480507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000025070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d": bytes);
      end;
    end;
    deposited_range_id = 2n;
  end
)`)

    it('finalize exit', async () => {
      const result = await invokeTest({
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
        sender: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.deepEqual(result.postState.events_storage.events.ExitFinalized, [
        {
          data: [
            '0x050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d',
            '0x050a00000020ce6170f820c3599b11cf1d9f606522c8b03ddce4c9ca4c6dbcd30d10f3099e14'
          ],
          block_height: 0
        }
      ])
    })
  })

  describe('remove_deposited_range', () => {
    const initialStorage = rmWhiteSpaces(`record
      total_deposited = 5n;
      deposited_ranges = map
        5n -> record
          start_ = 0n;
          end_ = 5n;
        end;
      end;
      checkpoints = (map end : checkpoints);
    end`)
    it('remove 0 to 1', async () => {
      const testParams = rmWhiteSpaces(`(
        record
          start_ = 0n;
          end_ = 1n;
        end,
        5n
      )`)
      const result = await invokeTest({
        contractPath: 'contracts/test.ligo',
        entryPoint: 'test_remove_deposited_range',
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
        sender: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.deepEqual(result.postState.deposited_ranges, {
        '5': {
          start_: 1,
          end_: 5
        }
      })
    })
    it('remove 4 to 5', async () => {
      const testParams = rmWhiteSpaces(`(
        record
          start_ = 4n;
          end_ = 5n;
        end,
        5n
      )`)
      const result = await invokeTest({
        contractPath: 'contracts/test.ligo',
        entryPoint: 'test_remove_deposited_range',
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
        sender: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.deepEqual(result.postState.deposited_ranges, {
        '4': {
          start_: 0,
          end_: 4
        }
      })
    })

    it('fail to remove', async () => {
      const testParams = rmWhiteSpaces(`(
        record
          start_ = 5n;
          end_ = 6n;
        end,
        5n
      )`)
      const result = await invokeTest({
        contractPath: 'contracts/test.ligo',
        entryPoint: 'test_remove_deposited_range',
        parameter: testParams,
        initialStorage,
        sender: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.equal(result.failwith, 'range must be of a depostied range.')
    })
  })
})
