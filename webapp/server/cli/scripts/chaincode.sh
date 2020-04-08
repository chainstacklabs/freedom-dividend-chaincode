# #!/bin/bash
set -e

trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG

export FABRIC_CFG_PATH=/etc/hyperledger/config
export ORDERER_CA=$DIR_PATH/$ORDERER_CA
export ORDERER_ADDRESS=$ORDERER_ADDRESS
export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED

export CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS
export CORE_PEER_MSPCONFIGPATH=$DIR_PATH/$CORE_PEER_MSPCONFIGPATH
export CORE_PEER_LOCALMSPID=$CORE_PEER_LOCALMSPID
export CORE_PEER_TLS_ROOTCERT_FILE=$DIR_PATH/$CORE_PEER_TLS_ROOTCERT_FILE

installChaincode() {
  /etc/hyperledger/bin/peer lifecycle chaincode package "${DIR_PATH}/${CHAINCODE_PATH}.tar.gz" \
  --lang node \
  --path "${DIR_PATH}/${CHAINCODE_PATH}/contract" \
  --label "${CHAINCODE_NAME}${CHAINCODE_VERSION}"
  /etc/hyperledger/bin/peer lifecycle chaincode install "${DIR_PATH}/${CHAINCODE_PATH}.tar.gz"
}

getChaincodePackageID() {
  PACKAGES=$(/etc/hyperledger/bin/peer lifecycle chaincode queryinstalled | grep "${CHAINCODE_NAME}${CHAINCODE_VERSION}":)
  PACKAGE_ID=${PACKAGES#*Package ID: }
  export PACKAGE_ID=${PACKAGE_ID%,*}

  echo "PACKAGE_ID:" ${PACKAGE_ID}
}


approveChaincode() {
  /etc/hyperledger/bin/peer lifecycle chaincode approveformyorg \
  --name "$CHAINCODE_NAME" \
  --package-id "$PACKAGE_ID" -o "$ORDERER_ADDRESS" \
  --tls \
  --tlsRootCertFiles "$CORE_PEER_TLS_ROOTCERT_FILE" \
  --cafile "$ORDERER_CA" \
  --version "$CHAINCODE_VERSION" \
  --channelID "$CHANNEL_ID" \
  --sequence "$CHAINCODE_SEQUENCE"
}

checkReadiness() {
  /etc/hyperledger/bin/peer lifecycle chaincode checkcommitreadiness -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --tls \
  --cafile "$ORDERER_CA" \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --sequence "$CHAINCODE_SEQUENCE"
}

commitChaincode() {
  /etc/hyperledger/bin/peer lifecycle chaincode commit -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --tls \
  --cafile "$ORDERER_CA" \
  --peerAddresses $CORE_PEER_ADDRESS \
  --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE
}

queryInstalled() {
  /etc/hyperledger/bin/peer lifecycle chaincode queryinstalled \
  --output "${OUTPUT}"
}

queryCommitted() {
  /etc/hyperledger/bin/peer lifecycle chaincode querycommitted -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --tls \
  --cafile "$ORDERER_CA" \
  --peerAddresses "$CORE_PEER_ADDRESS" \
  --tlsRootCertFiles "$CORE_PEER_TLS_ROOTCERT_FILE" \
  --output "${OUTPUT}"
}

install() {
  installChaincode
  getChaincodePackageID

  approveChaincode
  checkReadiness

  commitChaincode
  queryCommitted
}

OUTPUT="plain-text"
if [[ $ACTION == "install" ]]
then
  install
elif [[ $ACTION == "upgrade" ]]
then
  install
elif [[ $ACTION == "queryCommitted" ]]
then
  OUTPUT="json"
  queryCommitted
elif [[ $ACTION == "queryInstalled" ]]
then
  OUTPUT="json"
  queryInstalled
else
  echo "invalid action - ${ACTION}"
fi
