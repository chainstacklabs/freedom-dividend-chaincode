const { execute, unlockScriptFolder } = require('./index');
const envfile = require('envfile');
const fs = require('fs');

const upgrade = async () => {
  const parsedFile = envfile.parseFileSync('.env');
  parsedFile.CHAINCODE_VERSION = (parseFloat(parsedFile.CHAINCODE_VERSION) + 0.1).toFixed(1);
  parsedFile.CHAINCODE_SEQUENCE = parseFloat(parsedFile.CHAINCODE_SEQUENCE) + 1;

  fs.writeFileSync('./.env', envfile.stringifySync(parsedFile));

  // to do: upgrade contract flow
};

const main = async () => {
  const [action] = process.argv.slice(2);
  if (!['upgrade', 'install', 'queryChannel'].includes(action)) {
    console.log('Error: Invalid argument');
    console.log('node contract upgrade or contract install');

    return;
  }
  console.log(`executing cli - ${action} command`);

  unlockScriptFolder();
  
  if (action === 'install') {
    execute({ ACTION: action })
      .then(({ stdout, stderr }) => {
        console.log(stdout);
        console.log(stderr);
      })
      .catch(({ stdout, stderr }) => {
        console.log(stdout);
        console.log(stderr);
      });
  }

  if (action === 'upgrade') {
    await upgrade();
  }
};


main();

