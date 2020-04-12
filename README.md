# Freedom dividend chaincode

A starter template for building a complete fabric application using Node.js and Vue.js with some included packages and configurations to help jump-start the development process.

There are two parts of this project, webapp and [contract](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode) and each part is contained in its own respective folder.

Major packages inlcuded and configured (as required)

## Contract
- includes a sample javascript chaincode with 3 transactions
  - optIn
  - optOut
  - querySSN 
- more [information](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode)

## Webapp

### Backend

#### Highlights
* includes bash script that automates peer chaincode lifecycle for installing and upgrading chaincodes.
* includes api endpoint to bridge node.js and fabric network using bash script
* includes sample implementation of fabric sdk v2.1 for creating gateway and wallets

[Build Setup](./webapp/server/README.md)

By default this application is configured to work out of the box with a fabric network deployed on Chainstack, but by
doing minor changes you can easily switch to a network deployed on your local machine.

### Frontend

#### Highlights
* automatically retrieves and display installed packages and chaincode from backend
* automatically generates forms base on installed chaincode

[Build Setup](./webapp/client/README.md)
