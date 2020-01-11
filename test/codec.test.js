const assert = require('assert')
const invokeTest = require('./helper/invokeTest')
const contractPath = 'test/contracts/codec.ligo'

const STATUS = {
  OK: 'ok',
  ERROR: 'error'
}

/*
 * Testcases
 */
describe('CodecContract', function() {
  this.timeout(20000)

  describe('Codec', () => {
    it('packs a record', async () => {
      const packParam = `record
        attributeA = ( "hoge" : string );
        attributeB = 1n;
      end`
      const result = await invokeTest({
        contractPath,
        parameter: packParam,
        entryPoint: 'pack_sample_record',
        initialStorage: '("000000": bytes)'
      })
      assert.deepEqual(result.status, STATUS.OK)
      assert.deepEqual(result.postState, `0x0507070100000004686f67650001`)
    })

    it('unpacks a binary', async () => {
      const unpackParam = `("0507070100000004686f67650001": bytes)`
      const result = await invokeTest({
        contractPath,
        parameter: unpackParam,
        entryPoint: 'unpack_sample_record',
        initialStorage: '(None: option(sample_record))'
      })

      assert.deepEqual(result.status, STATUS.OK)
      assert.deepEqual(result.postState, [
        'SOME',
        { attributeA: 'hoge', attributeB: 1 }
      ])
    })

    it('unpack tuple', async () => {
      const packParam = `("0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d020000000e0a0000000200010a000000020002":bytes)`
      const result = await invokeTest({
        contractPath,
        parameter: packParam,
        entryPoint: 'unpack_tuple',
        initialStorage: `(None: option(sample_tuple))`
      })
      assert.deepEqual(result.status, STATUS.OK)
      assert.deepEqual(result.postState, [
        'SOME',
        ['tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV', ['0x0001', '0x0002']]
      ])
    })
  })
})
