#!/bin/bash
export FABRIC_VERSION=2.0.1
export FABRIC_PATH=/etc/hyperledger
export FABRIC_BIN_PATH=${FABRIC_PATH}/bin
export FABRIC_CFG_PATH=${FABRIC_PATH}/config
export FABRIC_SOURCES_PATH=${FABRIC_PATH}/sources
export FABRIC_BINARY_FILE=hyperledger-fabric-darwin-amd64-${FABRIC_VERSION}.tar.gz

mkdir -p ${FABRIC_SOURCES_PATH}  # Also creates FABRIC_PATH
wget -q https://github.com/hyperledger/fabric/releases/download/v${FABRIC_VERSION}/${FABRIC_BINARY_FILE} -O - \
    | tar xz -C ${FABRIC_PATH}
wget -q https://github.com/hyperledger/fabric/archive/v${FABRIC_VERSION}.tar.gz -O - \
    | tar xz -C ${FABRIC_SOURCES_PATH}
mv ${FABRIC_SOURCES_PATH}/fabric-${FABRIC_VERSION}/sampleconfig/* ${FABRIC_CFG_PATH}
rm -rf ${FABRIC_SOURCES_PATH}
ls ${FABRIC_BIN_PATH}
