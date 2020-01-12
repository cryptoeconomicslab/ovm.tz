const assert = require('assert')
const invokeTest = require('./helper/invokeTest')

const CONTRACT_PATH = 'test/contracts/codec.ligo'
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
    describe('bytes_pack', () => {
      it('packs an address', async () => {
        const packParam = `("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_address',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
        )
      })

      it('packs an bignumber', async () => {
        const packParam = `("1" : string)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_bignumber',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(result.postState, '0x05010000000131')
      })

      it('packs a record', async () => {
        const packParam = `record
        attributeA = ( "hoge" : string );
        attributeB = 1n;
      end`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_sample_record',
          initialStorage: '("00": bytes)'
        })
        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(result.postState, `0x0507070100000004686f67650001`)
      })

      it('packs a property record', async () => {
        const packParam = `record
          predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address);
          inputs = list ("0001" : bytes); ("0002" : bytes); end;
        end`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_property_record',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x050707020000000e0a0000000200010a0000000200020a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
        )
      })

      it('packs a tuple', async () => {
        const packParam = `(
        ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address),
        list ("0001" : bytes); ("0002" : bytes); end
      )`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_tuple',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d020000000e0a0000000200010a000000020002'
        )
      })
    })

    describe('bytes_unpack', () => {
      it('unpacks a record', async () => {
        const unpackParam = `("0507070100000004686f67650001": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
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

      it('unpacks a property record', async () => {
        const packParam = `("050707020000000e0a0000000200010a0000000200020a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d":bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'unpack_property_record',
          initialStorage: `(None: option(property_record))`
        })
        assert.deepEqual(result.postState, [
          'SOME',
          {
            predicate_address: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
            inputs: ['0x0001', '0x0002']
          }
        ])
      })

      it('unpacks a tuple', async () => {
        const packParam = `("0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d020000000e0a0000000200010a000000020002":bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
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
})
