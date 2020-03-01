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
          5n,
          ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV": address),
          ("68656c6c6f": bytes)
        )`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_tuple',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x050707070700050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0a0000000568656c6c6f'
        )
      })

      it('packs a list of integer', async () => {
        const packParam = `map
          0n -> 1n;
          1n -> 2n;
          2n -> 3n
        end`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'pack_list_of_int',
          initialStorage: `("00": bytes)`
        })
        assert.deepEqual(
          result.postState,
          '0x050200000012070400000001070400010002070400020003'
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
        0n -> ( ("7465737431" : bytes), 1n );
        1n -> ( ("7465737432" : bytes), 2n );
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
          '0x0502000000240704000007070a00000005746573743100010704000107070a0000000574657374320002'
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
            0n -> 1n;
            1n -> 3n;
            2n -> 4n
          end;
          1n -> map
            0n -> 2n;
            1n -> 4n;
            2n -> 6n
          end;
          2n -> map
            0n -> 10n;
            1n -> 11n;
            2n -> 12n
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
          '0x05020000005107040000020000001207040000000107040001000307040002000407040001020000001207040000000207040001000407040002000607040002020000001207040000000a07040001000b07040002000c'
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
        const packParam = `("050707070700050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0a0000000568656c6c6f":bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: packParam,
          entryPoint: 'unpack_tuple',
          initialStorage: `(None: option(sample_tuple))`
        })
        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(result.postState, [
          'SOME',
          [5, 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV', '0x68656c6c6f']
        ])
      })

      it('unpacks a list of integers', async () => {
        const unpackParam = `("050200000012070400000001070400010002070400020003": bytes)`
        const result = await invokeTest({
          contractPath: CONTRACT_PATH,
          parameter: unpackParam,
          entryPoint: 'unpack_list_of_integers',
          initialStorage: '(None: option(map(nat, int)))'
        })

        assert.deepEqual(result.status, STATUS.OK)
        assert.deepEqual(result.postState, ['SOME', [1, 2, 3]])
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
        const unpackParam = `("0502000000240704000007070a00000005746573743100010704000107070a0000000574657374320002": bytes)`
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
            ['0x7465737431', 1],
            ['0x7465737432', 2]
          ]
        ])
      })
    })
  })
})
