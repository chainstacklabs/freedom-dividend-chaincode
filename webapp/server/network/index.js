const envfile = require('envfile');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execFile = util.promisify(require('child_process').execFile);

const unlockScriptFolder = () => exec(`chmod -R 777 ${process.cwd()}/chaincodes/scripts`);

const install = () => execFile(`${process.cwd()}/scripts/chaincode.sh`, [], {
  env: Object.assign(
    envfile.parseFileSync('.env'),
    {
      DIR_PATH: process.cwd(),
      ACTION: 'install',
    },
  ),
})
.then(({ stdout, stderr }) => {
  console.log(stdout);
  console.log(stderr);
})
.catch(({ stdout, stderr }) => {
  console.log(stdout);
  console.log(stderr);
});

const upgrade = async () => {
  const parsedFile = envfile.parseFileSync('.env');
  parsedFile.CHAINCODE_VERSION = (parseFloat(parsedFile.CHAINCODE_VERSION) + 0.1).toFixed(1);
  parsedFile.CHAINCODE_SEQUENCE = parseFloat(parsedFile.CHAINCODE_SEQUENCE) + 1;

  fs.writeFileSync('./.env', envfile.stringifySync(parsedFile)) 
};

const main = async () => {
  const [action] = process.argv.slice(2);
  if (!['upgrade', 'install'].includes(action)) {
    console.log('Error: Invalid argument');
    console.log('node contract upgrade or contract install');

    return;
  }

  unlockScriptFolder();

  if (action === 'install') {
    await install();
  }

  if (action === 'upgrade') {
    await upgrade();
  }
};


main();
