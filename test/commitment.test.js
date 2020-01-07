const assert = require('assert')
const invokeTest = require('./helper/invokeTest')
const { rmWhiteSpaces, initialStorage } = require('./helper/utils')

describe('CommitmentContract', function() {
  this.timeout(5000)

  describe('submit', () => {
    it('suceed to submit', async () => {
      const testParams = rmWhiteSpaces(`Submit(
        record
          block_number = 1n;
          block_number_string = "1";
          root = "root1";
        end
      )`)

      const result = await invokeTest({
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.equal(result.status, 'ok')
      assert.deepEqual(result.postState.events, {
        0: {
          BlockSubmitted: [
            {
              block_height: 0,
              data: ['SubmittedEvent', [0, 'root']]
            }
          ]
        },
        1: {
          BlockSubmitted: [
            {
              block_height: 0,
              data: ['SubmittedEvent', [1, 'root1']]
            }
          ]
        }
      })
    })

    it('fail to submit', () => {
      const testParams = rmWhiteSpaces(`Submit(
        record
          block_number = 2n;
          block_number_string = "2";
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
