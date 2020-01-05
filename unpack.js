const tezbridge = require("tezbridge-crypto/dist").default
// let bytes = '0x\2433\244\171\132$:Dh\204&\243 \216\154\003D\218i\153\209\248\172Tq\003\006\030\140\177\154U'.replace(/\\/g,"").toUpperCase()
let bytes = '2433244171132$:Dh204&243 216154003D218i153209248172Tq003006030140177154U'.toUpperCase()


const micheline = tezbridge.codec.decodeRawBytes(bytes)
console.log(micheline)