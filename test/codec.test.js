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

      it('packs a bignumber', async () => {
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

      it('packs a list of integer', async () => {
        const packParam = `list 1;-1;0 end`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_list_of_int',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(result.postState, '0x050200000006000100410000')
      })

      it('packs a list of record', async () => {
        const packParam = `list
          record
            attributeA = ( "hoge" : string );
            attributeB = 1n;
          end;
          record
            attributeA = ( "hoge" : string );
            attributeB = 1n;
          end;
        end`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_list_of_record',
          initialStorage: '("00": bytes)'
        })
        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(
          result.postState,
          `0x05020000001a07070100000004686f6765000107070100000004686f67650001`
        )
      })

      it('packs a list of tuple', async () => {
        const packParam = `list 
        ( ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address),
        list ("0001" : bytes); ("0002" : bytes); end );
        ( ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address),
        list ("0001" : bytes); ("0002" : bytes); end );
        end
        `
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_list_of_tuple',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x05020000006007070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d020000000e0a0000000200010a00000002000207070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d020000000e0a0000000200010a000000020002'
        )
      })

      it('packs an empty list', async () => {
        const packParam = `( nil : list(unit) )` //TIPS: nil is a list. type annotation has to be here but any type is okay.
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_empty_list',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(result.postState, '0x050200000000')
      })

      it('packs a list of list of integer', async () => {
        const packParam = `list list 1;-1;0 end; list 1;-1;0 end; list 1;-1;0 end; end`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_list_of_list_of_int',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x050200000021020000000600010041000002000000060001004100000200000006000100410000'
        )
      })
    })

    describe('bytes_unpack', () => {
      it('unpacks an address', async () => {
        const unpackParam = `("050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: unpackParam,
          entryPoint: 'unpack_address',
          initialStorage: '(None: option(address))'
        })

        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(result.postState, [
          'SOME',
          'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
        ])
      })

      it('unpacks a bignumber', async () => {
        const unpackParam = `("05010000000131": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: unpackParam,
          entryPoint: 'unpack_bignumber',
          initialStorage: '(None: option(string))'
        })

        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(result.postState, ['SOME', '1'])
      })

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

      it('unpacks a list of integers', async () => {
        const unpackParam = `("050200000006000100410000": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: unpackParam,
          entryPoint: 'unpack_list_of_integers',
          initialStorage: '(None: option(list(int)))'
        })

        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(result.postState, ['SOME', [1, -1, 0]])
      })

      it('unpacks a list of records', async () => {
        const unpackParam = `("05020000001a07070100000004686f6765000107070100000004686f67650001": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: unpackParam,
          entryPoint: 'unpack_list_of_records',
          initialStorage: '(None: option(list(sample_record)))'
        })

        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(result.postState, [
          'SOME',
          [
            {
              attributeA: 'hoge',
              attributeB: 1
            },
            {
              attributeA: 'hoge',
              attributeB: 1
            }
          ]
        ])
      })
      it('unpacks a list of tuples', async () => {
        const unpackParam = `("05020000006007070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d020000000e0a0000000200010a00000002000207070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d020000000e0a0000000200010a000000020002": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: unpackParam,
          entryPoint: 'unpack_list_of_tuples',
          initialStorage: '(None: option(list(sample_tuple)))'
        })

        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(result.postState, [
          'SOME',
          [
            ['tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV', ['0x0001', '0x0002']],
            ['tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV', ['0x0001', '0x0002']]
          ]
        ])
      })
    })
  })
})
