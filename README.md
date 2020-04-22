# Freedom dividend chaincode

A starter template for building a complete Hyperledger Fabric v2 application using Node.js and Vue.js with some included packages and configurations to help jumpstart the development process.

There are two parts of this project, a [web app](https://chainstack.com/deploy-a-hyperledger-fabric-v2-web-app-using-sdk-for-node-js/) and a [contract](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode), and each part is contained in its own respective folder.

Major packages are inlcuded and configured (as required).

## Contract

- Includes a sample JavaScript chaincode with 3 transactions:
  - optIn
  - optOut
  - querySSN

See also the [chaincode tutorial](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode).

## Web app

### Backend

#### Highlights

- Includes a bash script that automates peer chaincode lifecycle for installing and upgrading chaincodes.
- Includes an API endpoint to bridge Node.js and Hyperledger Fabric v2 network using the bash script.
- Includes a sample implementation of Hyperledger Fabric SDK v2.1 for creating gateway and wallets.

[Build Setup](./webapp/server/README.md)

By default, this application is configured to work out of the box with a Hyperledger Fabric v2 network deployed on Chainstack, but by
doing minor changes you can easily switch to a network deployed on your local machine.

### Frontend

#### Highlights

- Automatically retrieves and displays the installed packages and chaincode from the backend.
- Automatically generates forms based on installed chaincode.

[Build Setup](./webapp/client/README.md)

See also the [web app tutorial](https://chainstack.com/deploy-a-hyperledger-fabric-v2-web-app-using-sdk-for-node-js/).
