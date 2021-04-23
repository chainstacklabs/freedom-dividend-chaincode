# Backend

## Install prerequisites

- Node.js version 12.13.1 and higher
- NPM version 6 or higher
- [nodemon](https://nodemon.io/)

## Update the .env file

The demo is set up with a Hyperledger Fabric v2 network deployed on Chainstack, replace the following values `MSP_ID`, `ORDERER_NAME` and `PEER_NAME` with the Hyperledger Fabric network details from Chainstack console.

```bash
AS_LOCALHOST=false

CHANNEL_ID=defaultchannel
CHAINCODE_NAME=freedomDividendContract
CHAINCODE_VERSION=1
CHAINCODE_SEQUENCE=1

# Org
MSP_ID=Org1MSP

# Orderer
ORDERER_NAME=orderer.example.com

# Peer
PEER_NAME=peer0.org1.example.com

```

## Build setup

### Step 1: install Hyperledger Fabric binaries

```bash
### mac
bash downloadPeerBinary.sh

### linux
bash downloadPeerBinary.sh linux
```

### Step 2: install dependencies

```bash
cd /webapp/server
npm install
```

### Step 3: start Node.js server

```bash
### nodemon
npm run dev

### node
npm run start
```
