const envfile = require('envfile');
const fs = require('fs');
const path = require('path');

const rootPath = process.cwd().includes('webapp')
  ? process.cwd().substring(0, process.cwd().indexOf('webapp'))
  : `${process.cwd()}`;
const seralizePath = fileName => fs.readFileSync(path.resolve(__dirname, fileName), 'utf8');

const getDirectory = (folderPath) => {
  return fs.promises.readdir(folderPath, (err, data) => {
    if (err) throw err;

    return data;
  });
};

const generateCertPath = async () => {
  const {
    CHANNEL_ID,
    CHAINCODE_NAME,
    CHAINCODE_VERSION,
    CHAINCODE_SEQUENCE,
    ORDERER_NAME,
    MSP_ID,
    PEER_NAME,
  } = envfile.parseFileSync(`${rootPath}/webapp/server/.env`);
  const certDirectoryPath = `${rootPath}/webapp/certs`;

  const ADMIN_CERT = await getDirectory(`${certDirectoryPath}/msp/admincerts`).then(([certName]) => {
    return `${certDirectoryPath}/msp/admincerts/${certName}`;
  });
  const ADMIN_PRIVATE_KEY = `${certDirectoryPath}/msp/keystore/priv_sk`;
  const PEER_TLS_ROOTCERT_FILE = await getDirectory(`${certDirectoryPath}/msp/tlscacerts`).then(([certName]) => {
    return `${certDirectoryPath}/msp/tlscacerts/${certName}`;
  });
  
  const ordererName = ORDERER_NAME.split('.').shift();

  return ({
    ADMIN_CERT,
    ADMIN_PRIVATE_KEY,
    CHANNEL_ID,
    CHAINCODE_NAME,
    CHAINCODE_VERSION,
    CHAINCODE_SEQUENCE,
    ORDERER_CA: `${certDirectoryPath}/${ordererName}-cert.pem`,
    ORDERER_ADDRESS: `${ORDERER_NAME}:7050`,
    MSP_ID,
    MSP_PATH: `${certDirectoryPath}/msp`,
    PEER_ADDRESS: `${PEER_NAME}:7051`,
    PEER_TLS_ROOTCERT_FILE,
    ROOT_PATH: rootPath,
  });
};

const flushTmpFolder = () => {
  return fs.promises.rmdir(`${rootPath}/webapp/certs/tmp`, { recursive: true }, (err) => {
    if (err) { throw err; }
  });
};

const makeTmpFolder = async () => {
  if (fs.existsSync(`${rootPath}/webapp/certs/tmp`)){
    await flushTmpFolder();
  }
  return fs.promises.mkdir(`${rootPath}/webapp/certs/tmp`, (err) => {
    if (err) { throw err; }
  });
};

module.exports = {
  flushTmpFolder,
  getDirectory,
  generateCertPath,
  makeTmpFolder,
  seralizePath,
  rootPath,
};
