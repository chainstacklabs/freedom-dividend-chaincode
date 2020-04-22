const { rootPath } = require('../fabric/utils/helper');
const { execute, unlockScriptFolder } = require('./index');
const envfile = require('envfile');
const fs = require('fs');

// set .env CONTRACT_VERSION and CONTRACT_SEQUENCE
const setContractVersion = (upgrade = false) => {
  const parsedFile = envfile.parseFileSync(`${rootPath}/webapp/server/.env`);
  parsedFile.CHAINCODE_VERSION = upgrade ? (parseFloat(parsedFile.CHAINCODE_VERSION) + 0.1).toFixed(1) : 1.0;
  parsedFile.CHAINCODE_SEQUENCE = upgrade ? parseFloat(parsedFile.CHAINCODE_SEQUENCE) + 1 : 1;

  fs.writeFileSync(`${rootPath}/webapp/server/.env`, envfile.stringifySync(parsedFile));
};

const main = async () => {
  const [action] = process.argv.slice(2);
  if (!['upgrade', 'install'].includes(action)) {
    console.log('Error: Invalid argument');
    console.log('node contract upgrade or contract install');

    return;
  }
  console.log(`executing cli - ${action} command`);

  unlockScriptFolder();

  if (action === 'install') {
    setContractVersion(false);
  }

  if (action === 'upgrade') {
    setContractVersion(true);
  }

  execute({ ACTION: action })
    .then(({ stdout, stderr }) => {
      console.log(stdout);
      console.log(stderr);
    })
    .catch(({ stdout, stderr }) => {
      console.log(stdout);
      console.log(stderr);
    });
};


main();
