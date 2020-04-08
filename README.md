# ovm.tz

OVM contract by LIGO for Tezos

[![Build Status](https://github.com/cryptoeconomicslab/ovm.tz/workflows/Test/badge.svg?branch=master)](https://github.com/cryptoeconomicslab/ovm.tz/actions)

## Development

### Requirement
ovm.tz requires the following to run:

- Node.js v10+
- MacOS, [Ubuntu18.04, 19.04, Debian9, Debian10](https://ligolang.org/docs/intro/installation#debian-linux-package-installation)

### How to install

#### MacOS example
1. Get `docker` command
2. [Install ligo](https://ligolang.org/docs/intro/installation/).
3. install dependencies

#### Debian10 example
```
wget https://gitlab.com/ligolang/ligo/-/jobs/438875863/artifacts/raw/dist/package/ubuntu-18.04/ligo_438875863-c04cd691_all.deb
sudo apt update
sudo apt install ./ligo_438875863-c04cd691_all.deb git nodejs npm -y
echo 'PATH=$PATH:/bin' >> ~/.bashrc
source ~/.bashrc
ligo
git clone https://github.com/cryptoeconomicslab/ovm.tz.git
cd ovm.tz
```

#### Common
```
npm i
```

### How to test

```
npm test
```

### How to deploy

You should create `account.json` in root and run `npm run init-deploy` before deploy.

#### How to get `account.json`
1. Go [faucet](https://faucet.tzalpha.net/)
2. Click "I'm not a robot"
3. Click "Get Testnet ꜩ"
4. Copy or download the JSON string


```
npm run build
npm run deploy
```

Check https://arronax-beta.cryptonomic.tech

testnet address is KT1HdPJmvTK879snXnTRuUdhLwYhh3SxEJA6

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
