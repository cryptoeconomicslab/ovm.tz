# ovm.tz

OVM implementation in LIGO on Tezos.


## tips
- `./tests/deposit-tester.sh` and `./tests/commitment-tester.sh` runs contract with default value. Good for smoke testing.
- `initial_storage` has to be updated every time you modify storage type.
  - End of this file has to be end with "no semi-colon" manner. Otherwise you'll see `Parse error ; with <very large column number> with <no file location>` error. It's hard to debug.
- Whole design consists of `entrypoint`, `actions`, `models`. It is imitating MVC-architecture for now.
