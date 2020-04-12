const envfile = require('envfile');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execFile = util.promisify(require('child_process').execFile);
const { rootPath } = require('../fabric/utils/helper');

const unlockScriptFolder = () => exec(`chmod -R 777 ${rootPath}/webapp/server/cli/scripts`);
const execute = ARGS => {
  const args = Object.assign(ARGS, {
    ROOT_PATH: rootPath,
  });

  return execFile(`${rootPath}/webapp/server/cli/scripts/chaincode.sh`, [], {
    env: Object.assign(
      envfile.parseFileSync(`${rootPath}/webapp/server/.env`),
      args,
    ),
  });
};

module.exports = {
  unlockScriptFolder,
  execute,
};
