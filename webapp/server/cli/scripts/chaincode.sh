#!/bin/bash
set -e

trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG

FABRIC_PATH="$(dirname "$0")/../../../../hlf"

export FABRIC_BIN_PATH="${FABRIC_PATH}/bin"
export FABRIC_CFG_PATH="${FABRIC_PATH}/config"

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ADDRESS=$PEER_ADDRESS
export CORE_PEER_LOCALMSPID=$MSP_ID
export CORE_PEER_MSPCONFIGPATH=$MSP_PATH
export CORE_PEER_TLS_ROOTCERT_FILE=$PEER_TLS_ROOTCERT_FILE

discoverPeers() {
   ${FABRIC_BIN_PATH}/discover \
  --peerTLSCA "$PEER_TLS_ROOTCERT_FILE" \
  --userKey "$ADMIN_PRIVATE_KEY" \
  --userCert "$ADMIN_CERT" \
  --MSP "$MSP_ID" \
  peers --server "$PEER_ADDRESS" \
  --channel "$CHANNEL_ID"
}

discoverConfig() {
  ${FABRIC_BIN_PATH}/discover \
  --peerTLSCA "$PEER_TLS_ROOTCERT_FILE" \
  --userKey "$ADMIN_PRIVATE_KEY" \
  --userCert "$ADMIN_CERT" \
  --MSP "$MSP_ID" \
  config --server "$PEER_ADDRESS" \
  --channel "$CHANNEL_ID"
}

installChaincode() {
  ${FABRIC_BIN_PATH}/peer lifecycle chaincode package "${ROOT_PATH}/${CHAINCODE_NAME}.tar.gz" \
  --lang node \
  --path "${ROOT_PATH}/contract" \
  --label "${CHAINCODE_NAME}${CHAINCODE_VERSION}"
  ${FABRIC_BIN_PATH}/peer lifecycle chaincode install "${ROOT_PATH}/${CHAINCODE_NAME}.tar.gz"
}

getChaincodePackageID() {
  PACKAGES=$(${FABRIC_BIN_PATH}/peer lifecycle chaincode queryinstalled | grep "${CHAINCODE_NAME}${CHAINCODE_VERSION}":)
  PACKAGE_ID=${PACKAGES#*Package ID: }
  export PACKAGE_ID=${PACKAGE_ID%,*}

  echo "PACKAGE_ID:" ${PACKAGE_ID}
}

approveChaincode() {
  ${FABRIC_BIN_PATH}/peer lifecycle chaincode approveformyorg \
  --name "$CHAINCODE_NAME" \
  --package-id "$PACKAGE_ID" -o "$ORDERER_ADDRESS" \
  --tls \
  --tlsRootCertFiles "$PEER_TLS_ROOTCERT_FILE" \
  --cafile "$ORDERER_CA" \
  --version "$CHAINCODE_VERSION" \
  --channelID "$CHANNEL_ID" \
  --sequence "$CHAINCODE_SEQUENCE"
  # --init-required \
}

checkReadiness() {
  ${FABRIC_BIN_PATH}/peer lifecycle chaincode checkcommitreadiness -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --tls \
  --cafile "$ORDERER_CA" \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --output "${OUTPUT}"
  # --init-required \
}

commitChaincode() {
  PEER_ADDRESSES_LIST=(${PEER_ADDRESSES}) && 
  TLS_ROOTCERT_FILES_LIST=(${TLS_ROOTCERT_FILES}) && 
  ${FABRIC_BIN_PATH}/peer lifecycle chaincode commit -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --tls \
  --cafile "$ORDERER_CA" \
  ${PEER_ADDRESSES_LIST[@]/#/ --peerAddresses } \
  ${TLS_ROOTCERT_FILES_LIST[@]/#/ --tlsRootCertFiles }
  # --init-required \
}

queryInstalled() {
  ${FABRIC_BIN_PATH}/peer lifecycle chaincode queryinstalled \
  --output "${OUTPUT}"
}

queryCommitted() {
  ${FABRIC_BIN_PATH}/peer lifecycle chaincode querycommitted -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --tls \
  --cafile "$ORDERER_CA" \
  --peerAddresses "$PEER_ADDRESS" \
  --tlsRootCertFiles "$PEER_TLS_ROOTCERT_FILE" \
  --output "${OUTPUT}"
}

queryApproved() {
  ${FABRIC_BIN_PATH}/peer lifecycle chaincode queryapproved -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --name "$CHAINCODE_NAME" \
  --output "${OUTPUT}"
}

invokeChaincode() {
  PEER_ADDRESSES_LIST=(${PEER_ADDRESSES}) && 
  TLS_ROOTCERT_FILES_LIST=(${TLS_ROOTCERT_FILES}) && 
  ${FABRIC_BIN_PATH}/peer chaincode invoke -o "$ORDERER_ADDRESS" \
  --tls \
  --cafile "$ORDERER_CA" \
  --channelID "$CHANNEL_ID" \
  --name "$CHAINCODE_NAME" \
  ${PEER_ADDRESSES_LIST[@]/#/ --peerAddresses } \
  ${TLS_ROOTCERT_FILES_LIST[@]/#/ --tlsRootCertFiles } \
  -c "{\"Args\": ${ARGS}}"
}

OUTPUT="plain-text"
if [[ $ACTION == "invoke" ]]
then
  invokeChaincode
elif [[ $ACTION == "install" ]]
then
  installChaincode
elif [[ $ACTION == "approve" ]]
then
  approveChaincode
elif [[ $ACTION == "commit" ]]
then
  commitChaincode
elif [[ $ACTION == "queryCommitted" ]]
then
  OUTPUT="json"
  queryCommitted
elif [[ $ACTION == "queryInstalled" ]]
then
  OUTPUT="json"
  queryInstalled
elif [[ $ACTION == "queryApproved" ]]
then
  OUTPUT="json"
  queryApproved
elif [[ $ACTION == "checkReadiness" ]]
then
  OUTPUT="json"
  checkReadiness
elif [[ $ACTION == "discoverConfig" ]]
then
  discoverConfig
elif [[ $ACTION == "discoverPeers" ]]
then
  discoverPeers
else
  echo "invalid action - ${ACTION}"
fi
