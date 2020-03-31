# #!/bin/bash
set -e

trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG

export FABRIC_CFG_PATH=/etc/hyperledger/config
export ORDERER_CA=$DIR_PATH/$ORDERER_CA
export ORDERER_ADDRESS=$ORDERER_ADDRESS
export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED

setPeerOne() {
  export CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS_1
  export CORE_PEER_MSPCONFIGPATH=$DIR_PATH/$CORE_PEER_MSPCONFIGPATH_1
  export CORE_PEER_LOCALMSPID=$CORE_PEER_LOCALMSPID_1
  export CORE_PEER_TLS_ROOTCERT_FILE=$DIR_PATH/$CORE_PEER_TLS_ROOTCERT_FILE_1
}

setPeerTwo() {
  export CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS_2
  export CORE_PEER_MSPCONFIGPATH=$DIR_PATH/$CORE_PEER_MSPCONFIGPATH_2
  export CORE_PEER_LOCALMSPID=$CORE_PEER_LOCALMSPID_2
  export CORE_PEER_TLS_ROOTCERT_FILE=$DIR_PATH/$CORE_PEER_TLS_ROOTCERT_FILE_2
}

installChaincode() {
  /etc/hyperledger/bin/peer lifecycle chaincode package "${DIR_PATH}/${CHAINCODE_PATH}.tar.gz" \
  --lang node \
  --path "${DIR_PATH}/${CHAINCODE_PATH}/contract" \
  --label "$CHAINCODE_NAME"
  /etc/hyperledger/bin/peer lifecycle chaincode install "${DIR_PATH}/${CHAINCODE_PATH}.tar.gz"
}

queryInstalled() {
  PACKAGES=$(/etc/hyperledger/bin/peer lifecycle chaincode queryinstalled | grep "$CHAINCODE_NAME":)
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
  --peerAddresses $CORE_PEER_ADDRESS_1 \
  --peerAddresses $CORE_PEER_ADDRESS_2 \
  --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE_1 \
  --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE_2
}

queryCommitted() {
  /etc/hyperledger/bin/peer lifecycle chaincode querycommitted -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --tls \
  --cafile "$ORDERER_CA" \
  --peerAddresses "$CORE_PEER_ADDRESS" \
  --tlsRootCertFiles "$CORE_PEER_TLS_ROOTCERT_FILE"
}

queryChannels() {
  if [[ $PEER == "one" ]]
  then
    setPeerOne
  elif [[ $PEER == "two" ]]
  then
    setPeerTwo
  fi

  /etc/hyperledger/bin/peer channel list
}

install() {
  setPeerOne
  installChaincode
  queryInstalled

  setPeerTwo
  installChaincode
  queryInstalled

  setPeerOne
  approveChaincode
  checkReadiness

  setPeerTwo
  approveChaincode
  checkReadiness

  commitChaincode
  queryCommitted

  setPeerTwo
}

upgrade() {
  echo "upgrading chaincode to version ${CHAINCODE_VERSION} - sequence ${CHAINCODE_SEQUENCE}"
}

if [[ $ACTION == "install" ]]
then
  install
elif [[ $ACTION == "upgrade" ]]
then
  upgrade
elif [[ $ACTION == "queryChannels" ]]
then
  queryChannels
else
  echo "invalid action ${ACTION}"
fi
