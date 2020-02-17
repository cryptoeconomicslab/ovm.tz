# ovm.tz

OVM contract by LIGO for Tezos

[![Build Status](https://github.com/cryptoeconomicslab/ovm.tz/workflows/Test/badge.svg?branch=master)](https://github.com/cryptoeconomicslab/ovm.tz/actions)

## Development

### How to install

1. [Install ligo](https://ligolang.org/docs/intro/installation/).
2. install dependencies

```
npm i
```

### How to test

```
npm test
```

## Roadmap

- [x] test tool with LIGO dry run
- [x] Deposit
- [x] Submit
- [ ] Exit
- [ ] Basic Challenge
- [ ] Plasma exit and checkpoint Predicate
- [ ] Ownership Predicate
- [ ] test tool with tezos node
- [ ] dynamic call

### Challenges

- dynamic call

How do we get data from another contract through dynamic call

- event

Layer 2 protocols require event data from layer 1. This data is used on-chain calculation but will not be stored in storage.
