const assert = require('assert')
const invokeTest = require('./helper/invokeTest')
const { rmWhiteSpaces, initialStorage } = require('./helper/utils')

describe('getStorage', function() {
  this.timeout(15000)

  describe('getStorage', () => {
    const testParams = rmWhiteSpaces(`GetStorage(0)`)

    it('getStorage(0)', async () => {
      const result = await invokeTest({
        parameter: testParams,
        initialStorage
      })
      assert.equal(result.status, 'ok')
    })
  })
})
