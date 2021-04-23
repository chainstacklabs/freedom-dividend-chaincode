# Freedom dividend chaincode

This project contains the web app that we will be spinnnig and connecting to the Hyperledger Fabric network deployed on [Chainstack](https://chainstack.com).

This is a two-part project:

* [Web app](https://chainstack.com/deploy-a-hyperledger-fabric-v2-web-app-using-sdk-for-node-js/) in the `webapp` directory.
* [Contract](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode) in the `contract` directory.

## Contract

- Includes a sample JavaScript chaincode with 3 transactions:
  - optIn
  - optOut
  - querySSN

## Web app

### Backend

#### Highlights

- Includes a bash script that automates peer chaincode lifecycle for installing and upgrading chaincodes.
- Includes an API endpoint to bridge Node.js and Hyperledger Fabric v2 network using the bash script.
- Includes a sample implementation of Hyperledger Fabric SDK v2.1 for creating gateway and wallets.

[Build setup](./webapp/server/README.md)

By default, this application is configured to work out of the box with a Hyperledger Fabric v2 network deployed on Chainstack, but by
doing minor changes you can easily switch to a network deployed on your local machine.

### Frontend

#### Highlights

- Automatically retrieves and displays the installed packages and chaincode from the backend.
- Automatically generates forms based on installed chaincode.

[Build setup](./webapp/client/README.md)
