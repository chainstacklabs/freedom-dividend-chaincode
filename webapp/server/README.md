# Backend

## Install prerequiste
- Node.js, version 12 - V12.13.1 and higher
- NPM tool version 6 or higher
- [nodemon](https://nodemon.io/)

## Add Required .env File
create personalized .env using webapp/server/.env.template

The demo is setup with a Fabric network deployed on Chainstack, you can edit `AS_LOCALHOST`, `Orderer details`, `Admin` values in the `.env` file to have it work with a network deployed on your local machine.
```
AS_LOCALHOST=false
FABRIC_CFG_PATH=/etc/hyperledger/config

# Orderer details
ORDERER_CA=/{ORDERER_ID}-cert.pem
ORDERER_ADDRESS={ORDERER_ADDRESS}:7050

# Chaincode
CHANNEL_ID=defaultchannel
CHAINCODE_PATH=contract
CHAINCODE_NAME=freedomDividend
CHAINCODE_VERSION=1.0
CHAINCODE_SEQUENCE=1

# Admin
ADMIN_CERT=/{MSP_ID}/users/Admin@{ORG_ID}.int.chainstack.com/msp/admincerts/Admin@{ORG_ID}.int.chainstack.com-cert.pem
ADMIN_PRIVATE_KEY=/{MSP_ID}/users/Admin@{ORG_ID}.int.chainstack.com/msp/keystore/priv_sk

CORE_PEER_TLS_ENABLED=true
CORE_PEER_ADDRESS={CORE_PEER_ADDRESS}:7051
CORE_PEER_MSPCONFIGPATH=/{MSP_ID}/users/Admin@{ORG_ID}.int.chainstack.com/msp/
CORE_PEER_LOCALMSPID={CORE_PEER_LOCALMSPID}
CORE_PEER_TLS_ROOTCERT_FILE=/{MSP_ID}/peers/{NODE_ID}.{ORG_ID}.int.chainstack.com/tls/ca.crt

```

## Build Setup

### Step 1: install fabric binaries

```
sudo bash downloadPeerBinary.sh
```

### Step 2: install dependencies

```
cd /webapp/server
npm install
```

### Step 3: start nodejs server

```
### nodemon
npm run dev

### node
npm run start
```

### Step 4: install chaincode
```
node /webapp/server/cli/peer install
```

## Step 5: upgrade chaincode
```
node /webapp/server/cli/peer upgrade
```
