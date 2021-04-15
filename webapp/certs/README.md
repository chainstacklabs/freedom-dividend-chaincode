### Export the required files

In [Chainstack](https://console.chainstack.com/):

1. Network connection profile:
    - Navigate to your Hyperledger Fabric network.
    - Click **Details**.
    - Click **Export connection profile**.
    - Move the exported file to the `webapp/certs/` directory.
1. Orderer TLS certificate:
    - Navigate to the Hyperledger Fabric **Service nodes** tab from the network.
    - Access **Orderer**.
    - Click **Export**
    - Unzip the downloaded folder
    - Move `<Node ID>-cert.pem` file to the `webapp/certs/` directory.
1. Organization identity zip folder:
    - Navigate to your Hyperledger Fabric network.
    - Click **Details**.
    - Access Admin identity
    - Click **Export**
    - Unzip the downloaded folder
    - Move `msp` subdirectory to the `webapp/certs/` directory.
