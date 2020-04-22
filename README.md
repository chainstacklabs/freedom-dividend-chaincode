# Freedom dividend chaincode

A starter template for building a complete fabric application using Node.js and Vue.js with some included packages and configurations to help jump-start the development process.

There are two parts of this project, web app and [contract](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode) and each part is contained in its own respective folder.

Major packages included and configured (as required)

## Contract
- Includes a sample javascript chaincode with 3 transactions
  - optIn
  - optOut
  - querySSN 
- More [information](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode)

## Web app

### Backend

#### Highlights
* Includes bash script that automates peer chaincode lifecycle for installing and upgrading chaincodes.
* Includes API endpoint to bridge Node.js and Fabric network using bash script.
* Includes sample implementation of Fabric SDK v2.1 for creating gateway and wallets.

[Build Setup](./webapp/server/README.md)

By default this application is configured to work out of the box with a Fabric network deployed on Chainstack, but by
doing minor changes you can easily switch to a network deployed on your local machine.

### Frontend

#### Highlights
* Automatically retrieves and display installed packages and chaincode from backend
* Automatically generate forms base on installed chaincode

[Build Setup](./webapp/client/README.md)
