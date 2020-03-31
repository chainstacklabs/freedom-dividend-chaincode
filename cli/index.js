const envfile = require('envfile');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execFile = util.promisify(require('child_process').execFile);

const unlockScriptFolder = () => exec(`chmod -R 777 ${process.cwd()}/cli/scripts`);
const execute = ARGS => {
  const args = Object.assign(ARGS, {
    DIR_PATH: process.cwd(),
  });

  return execFile(`${process.cwd()}/cli/scripts/chaincode.sh`, [], {
    env: Object.assign(
      envfile.parseFileSync('.env'),
      args,
    ),
  });
};

module.exports = {
  unlockScriptFolder,
  execute,
};
