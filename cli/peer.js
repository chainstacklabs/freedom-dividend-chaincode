const { execute, unlockScriptFolder } = require('./index');
const envfile = require('envfile');
const fs = require('fs');

const upgrade = () => {
  const parsedFile = envfile.parseFileSync('.env');
  parsedFile.CHAINCODE_VERSION = (parseFloat(parsedFile.CHAINCODE_VERSION) + 0.1).toFixed(1);
  parsedFile.CHAINCODE_SEQUENCE = parseFloat(parsedFile.CHAINCODE_SEQUENCE) + 1;

  fs.writeFileSync('./.env', envfile.stringifySync(parsedFile));
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
  
  if (action === 'upgrade') {
    upgrade();
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

