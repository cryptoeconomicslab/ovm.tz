const assert = require('assert')
const { invokeTest, STATUS } = require('./helper/invokeTest')
const CONTRACT_PATH = 'test/contracts/codec.ligo'

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

      it('packs a tuple', async () => {
        const packParam = `(
          ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV": address),
          map
            0n -> ("0001": bytes);
            1n -> ("0002": bytes);
          end
        )`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_tuple',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000016070400000a000000020001070400010a000000020002'
        )
      })

      it('packs a list of integer', async () => {
        const packParam = `map
          0n -> 1;
          1n -> -1;
          2n -> 0
        end`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_list_of_int',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x050200000012070400000001070400010041070400020000'
        )
      })

      it('packs a list of record', async () => {
        const packParam = `map
          0n -> record
            attributeA = ( "hoge" : string );
            attributeB = 1n;
          end;
          1n -> record
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
          `0x0502000000220704000007070100000004686f676500010704000107070100000004686f67650001`
        )
      })

      it('packs a list of tuple', async () => {
        const packParam = `map 
        0n -> ( ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address),
        map 0n -> ("0001" : bytes); 1n -> ("0002" : bytes); end );
        1n -> ( ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address),
        map 0n -> ("0001" : bytes); 1n -> ("0002" : bytes); end );
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
          '0x0502000000780704000007070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000016070400000a000000020001070400010a0000000200020704000107070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000016070400000a000000020001070400010a000000020002'
        )
      })

      it('packs an empty list', async () => {
        const packParam = `( map end : map(nat, unit) )`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_empty_list',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(result.postState, '0x050200000000')
      })

      it('packs a list of list of integer', async () => {
        const packParam = `map
          0n -> map
            0n -> 1;
            1n -> -1;
            2n -> 0
          end;
          1n -> map
            0n -> 1;
            1n -> -1;
            2n -> 0
          end;
          2n -> map
            0n -> 1;
            1n -> -1;
            2n -> 0
          end;
        end`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_list_of_list_of_int',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x050200000051070400000200000012070400000001070400010041070400020000070400010200000012070400000001070400010041070400020000070400020200000012070400000001070400010041070400020000'
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
          {
            attributeA: 'hoge',
            attributeB: 1
          }
        ])
      })

      it('unpacks a tuple', async () => {
        const packParam = `("0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000016070400000a000000020001070400010a000000020002":bytes)`
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
        const unpackParam = `("050200000012070400000001070400010041070400020000": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: unpackParam,
          entryPoint: 'unpack_list_of_integers',
          initialStorage: '(None: option(map(nat, int)))'
        })

        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(result.postState, ['SOME', [1, -1, 0]])
      })

      it('unpacks a list of records', async () => {
        const unpackParam = `("0502000000220704000007070100000004686f676500010704000107070100000004686f67650001": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: unpackParam,
          entryPoint: 'unpack_list_of_records',
          initialStorage: '(None: option(map(nat, sample_record)))'
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
        const unpackParam = `("0502000000780704000007070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000016070400000a000000020001070400010a0000000200020704000107070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000016070400000a000000020001070400010a000000020002": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: unpackParam,
          entryPoint: 'unpack_list_of_tuples',
          initialStorage: '(None: option(map(nat, sample_tuple)))'
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
