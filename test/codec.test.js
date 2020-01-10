const assert = require('assert')
const invokeTest = require('./helper/invokeTest')
const ContractPath = 'test/contracts/codec.ligo'

/*
 * Testcases
 */
describe('CodecContract', function() {
  this.timeout(10000)

  describe('Codec', () => {
    it('pack record', async () => {
      const packParam = `record
        predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address);
        inputs = list ("0001" : bytes); ("0002" : bytes); end;
      end`
      const result = await invokeTest({
        contractPath: ContractPath,
        parameter: packParam,
        entryPoint: 'pack_record',
        initialStorage: `("00": bytes)`
      })
      assert.deepEqual(
        result.postState,
        '0x050707020000000e0a0000000200010a0000000200020a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
      )
    })

    it('pack tuple', async () => {
      const packParam = `(
        ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address),
        list ("0001" : bytes); ("0002" : bytes); end
      )`
      const result = await invokeTest({
        contractPath: ContractPath,
        parameter: packParam,
        entryPoint: 'pack_tuple',
        initialStorage: `("00": bytes)`
      })
      assert.deepEqual(
        result.postState,
        '0x0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d020000000e0a0000000200010a000000020002'
      )
    })

    it('unpack record', async () => {
      const packParam = `("050707020000000e0a0000000200010a0000000200020a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d":bytes)`
      const result = await invokeTest({
        contractPath: ContractPath,
        parameter: packParam,
        entryPoint: 'unpack_record',
        initialStorage: `(None: option(sample_record))`
      })
      assert.deepEqual(result.postState, [
        'SOME',
        {
          predicate_address: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV',
          inputs: ['0x0001', '0x0002']
        }
      ])
    })

    it('unpack tuple', async () => {
      const packParam = `("0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d020000000e0a0000000200010a000000020002":bytes)`
      const result = await invokeTest({
        contractPath: ContractPath,
        parameter: packParam,
        entryPoint: 'unpack_tuple',
        initialStorage: `(None: option(sample_tuple))`
      })
      assert.deepEqual(result.postState, [
        'SOME',
        ['tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV', ['0x0001', '0x0002']]
      ])
    })
  })
})
