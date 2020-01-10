const assert = require('assert')
const invokeTest = require('./helper/invokeTest')
const { rmWhiteSpaces, initialStorage } = require('./helper/utils')

describe('CommitmentContract', function() {
  this.timeout(10000)

  describe('submit', () => {
    it('suceed to submit', async () => {
      const testParams = rmWhiteSpaces(`Submit(
        record
          block_number = 1n;
          root = "root1";
        end
      )`)

      const result = await invokeTest({
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.equal(result.status, 'ok')
      assert.deepEqual(result.postState.events_storage.events.BlockSubmitted, [
        {
          block_height: 0,
          data: ['SubmittedEvent', [1, 'root1']]
        },
        {
          block_height: 0,
          data: ['SubmittedEvent', [0, 'root']]
        }
      ])
    })

    it('fail to submit', () => {
      const testParams = rmWhiteSpaces(`Submit(
        record
          block_number = 2n;
          root = "root1";
        end
      )`)

      assert.throws(() => {
        invokeTest({
          parameter: testParams,
          initialStorage,
          source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
        })
      })
    })
  })
})
