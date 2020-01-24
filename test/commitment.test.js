const assert = require('assert')
const { invokeTest, STATUS } = require('./helper/invokeTest')
const { rmWhiteSpaces, initialStorage } = require('./helper/utils')

describe('CommitmentContract', function() {
  this.timeout(20000)

  describe('submit', () => {
    it('suceed to submit', async () => {
      const testParams = rmWhiteSpaces(`Submit(
        record
          block_number = 1n;
          root = ("010203040506": bytes);
        end
      )`)

      const result = await invokeTest({
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.equal(result.status, STATUS.OK)
      assert.deepEqual(result.postState.commitment_storage.commitments, {
        '0': '0x010200000000',
        '1': '0x010203040506'
      })
      assert.deepEqual(result.postState.events_storage.events.BlockSubmitted, [
        {
          block_height: 0,
          data: ['0x050001', '0x050a00000006010203040506']
        },
        {
          block_height: 0,
          data: ['0x050000', '0x050a00000006010203040500']
        }
      ])
    })

    it('fail to submit', () => {
      const testParams = rmWhiteSpaces(`Submit(
        record
          block_number = 2n;
          root = ("010203040506": bytes);
        end
      )`)

      const result = invokeTest({
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.equal(result.status, STATUS.ERROR)
      assert.deepEqual(result.failwith, 'block_number should be next block')
    })
  })

  describe('verify_inclusion', () => {
    it('suceed to verify inclusion', async () => {
      const initialStorage = rmWhiteSpaces(`False`)
      const testParams = rmWhiteSpaces(`(
        ("0000": bytes),
        ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV": address),
        record
          start_ = 0n;
          end_ = 1n;
        end,
        record
          address_inclusion_proof = record
            leaf_index = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV": address);
            leaf_position = 0n;
            siblings = (map end : map(nat, address_tree_node));
          end;
          interval_inclusion_proof = record
            leaf_index = 0n;
            leaf_position = 0n;
            siblings = (map
              0n -> record
                data = ("0000": bytes);
                start = 0n;
              end
            end : map(nat, interval_tree_node));
          end;
        end,
        ("0000": bytes)
      )`)

      const result = await invokeTest({
        contractPath: 'contracts/test.ligo',
        entryPoint: 'test_verify_inclusion',
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.deepEqual(result.postState, 'true')
    })
  })
})
