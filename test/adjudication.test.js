const assert = require('assert')
const { invokeTest, STATUS } = require('./helper/invokeTest')
const { rmWhiteSpaces, initialStorage } = require('./helper/utils')

describe('AdjudicationContract', function() {
  this.timeout(20000)

  describe('Adjudication', () => {
    const testParams = rmWhiteSpaces(`ClaimProperty(
  record
    claim = record
      predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);
      inputs = map 0n -> ("050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d":bytes) end;
    end;
  end
)`)

    it('claim property', async () => {
      const result = await invokeTest({
        parameter: testParams,
        initialStorage,
        source: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
        sender: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
      })
      assert.equal(result.status, STATUS.OK)
    })
  })
})
