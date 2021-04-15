const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execFile = util.promisify(require('child_process').execFile);
const { rootPath, generateCertPath } = require('../fabric/utils/helper');

const unlockScriptFolder = () => exec(`chmod -R 777 ${rootPath}/webapp/server/cli/scripts`);
const execute = async (ARGS) => {
  const certs = await generateCertPath();

  return execFile(`${rootPath}/webapp/server/cli/scripts/chaincode.sh`, [], {
    env: Object.assign(
      certs,
      ARGS,
    ),
    maxBuffer: 10 * 1024 * 1024
  });
};

module.exports = {
  execute,
  unlockScriptFolder,
};
