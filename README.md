# ovm.tz

OVM contract by LIGO for Tezos

[![Build Status](https://github.com/cryptoeconomicslab/ovm.tz/workflows/Test/badge.svg?branch=master)](https://github.com/cryptoeconomicslab/ovm.tz/actions)

## Development

### Requirement

ovm.tz requires the following to run:

- Node.js v12+
- MacOS, [Ubuntu18.04, 19.04, Debian9, Debian10](https://ligolang.org/docs/intro/installation#debian-linux-package-installation)

### How to install

#### MacOS example

1. Get `docker` command
2. [Install ligo](https://ligolang.org/docs/intro/installation/).
3. install dependencies

#### Debian10 example

```
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common -y
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER # You have to logout and back for refresh user info
docker version
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version
wget https://gitlab.com/ligolang/ligo/-/jobs/438875863/artifacts/raw/dist/package/ubuntu-18.04/ligo_438875863-c04cd691_all.deb
curl -sL https://gist.githubusercontent.com/shogochiai/20f6fa1d2f300e1e042341f1056df4a8/raw/9fb99461c69ce4d2b0bfbc40c1c12d38e647329a/deb.nodesource.com_setup_13.x | bash -
sudo apt update
sudo apt install ./ligo_438875863-c04cd691_all.deb git nodejs npm -y
echo 'PATH=$PATH:/bin' >> ~/.bashrc
source ~/.bashrc
ligo --version
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
npm run init-deploy
npm run build
npm run deploy
```

Check your contract address by using ophash https://arronax.io/tezos/carthagenet/operations/opXXXXX

Eg.
babylonnet address was KT1HdPJmvTK879snXnTRuUdhLwYhh3SxEJA6
carthagenet address was KT1VizrN6cvqkBkJzZyJGwvqXBkmuFBnVJF3

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
