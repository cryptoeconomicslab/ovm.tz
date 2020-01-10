const assert = require('assert')
const invokeTest = require('./helper/invokeTest')
const { rmWhiteSpaces } = require('./helper/utils')
const contractPath = 'test/contracts/codec.ligo'
const packedFile = 'test/testdata/packed.txt'
const unpackedFile = 'test/testdata/unpacked.txt'
let PACKED_MASTER
let UNPACKED_MASTER
const fs = require('fs')
const childProcess = require('child_process')

/*
 * Preparing the master test data
 */
if (fs.existsSync(packedFile) && fs.existsSync(unpackedFile)) {
  console.log('There is a codec master seed. Loading seed files.')
  PACKED_MASTER = rmWhiteSpaces(fs.readFileSync(packedFile).toString()).trim()
  UNPACKED_MASTER = rmWhiteSpaces(
    fs.readFileSync(unpackedFile).toString()
  ).trim()
} else {
  console.error('There is no codec master seed. Running seeder.')
  childProcess.execSync('npm run init-codec-test')
}

/*
 * Constants for Codec Contract Execution
 */
const initialStorage = `
record
  binary = ("000000" : bytes);
  struct = record
    attributeA = ( "0" : string );
    attributeB = 0n;
  end;
end
`
const packString = 'hoge'
const packNat = '1'
const packParam = `PACK(record
  attributeA = ( "${packString}" : string );
  attributeB = ${packNat}n;
end)`

const unpackParam = `UNPACK( ("0507070100000004686f67650001": bytes) )`

/*
 * Testcases
 */
describe('CodecContract', function() {
  this.timeout(10000)

  describe('Codec', () => {
    it('has the exact same pack parameter with the master data', async () => {
      assert.equal(unpackParam.indexOf(PACKED_MASTER) >= 0, true)
    })

    it('has the exact same unpack parameter with the master data', async () => {
      assert.equal(UNPACKED_MASTER.indexOf(packString) >= 0, true)
      assert.equal(UNPACKED_MASTER.indexOf(`+${packNat}`) >= 0, true)
    })

    it('packs a record', async () => {
      const result = await invokeTest({
        contractPath,
        parameter: packParam,
        initialStorage
      })
      assert.equal(result.status, 'ok')
      assert.deepEqual(result.postState.binary, `0x${PACKED_MASTER}`)
    })

    it('unpacks a binary', async () => {
      const result = await invokeTest({
        contractPath,
        parameter: unpackParam,
        initialStorage
      })
      const status = result.status
      const attributeA = result.postState.struct.attributeA
      const attributeB = result.postState.struct.attributeB

      assert.equal(status, 'ok')
      assert.equal(
        `{attributeB = +${attributeB} , attributeA = "${attributeA}"}`,
        UNPACKED_MASTER
      )
    })
  })
})
