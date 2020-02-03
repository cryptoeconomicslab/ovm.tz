const assert = require('assert')
const { invokeTest } = require('./helper/invokeTest')
const { rmWhiteSpaces, initialStorage } = require('./helper/utils')

describe('crypto_check', function() {
  this.timeout(20000)
  it('must check correct signature', async () => {
    const publicKey = 'edpkuuGJ4ssH3N5k7ovwkBe16p8rVX1XLENiZ4FAayrcwUf9sCKXnG'
    const signature =
      '0xc9533d4ec47a18ad0f98e910269b6492635c606010c9481c120bfa3552b80238173597765e17b2' +
      'ce7ba88b8dc788c359431688d89872cf8c808f0eef82bc620b'
    //TODO: Base58 algo will be in ConseilJS
    const params = `
    record
      k = ("${publicKey}" : key);
      s = ("${signature}" : signature);
      b = ("00123456" : bytes);
    end
    `
    const result = await invokeTest({
      parameter: params,
      contractPath: 'test/contracts/check_signature.ligo',
      entryPoint: 'main',
      initialStorage: 'False'
    })
    console.log(result)
  })
})
