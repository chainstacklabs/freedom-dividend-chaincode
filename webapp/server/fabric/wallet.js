const envfile = require('envfile');
const path = require('path');
const { Wallets } = require('fabric-network');
const { rootPath, seralizePath } = require('./utils/helper');

const connect = () => Wallets.newFileSystemWallet(path.join(process.cwd(), '/fabric/wallets'));
const register = async identityLabel => {
  try {
    const env = envfile.parseFileSync('.env');

    const certificate = seralizePath(`${rootPath}/webapp/certs/${env.ADMIN_CERT}`);
    const privateKey = seralizePath(`${rootPath}/webapp/certs/${env.ADMIN_PRIVATE_KEY}`);
    const mspId = env.CORE_PEER_LOCALMSPID;

    const wallet = await connect();

    const existingIdentity = await wallet.get(identityLabel);
    if (existingIdentity) {
      await wallet.remove(identityLabel);
    }

    await wallet.put(identityLabel, {
      credentials: {
        certificate,
        privateKey,
      },
      mspId,
      type: 'X.509',
    });
  } catch (error) {
    console.log(`Error adding to wallet. ${error}`);
    console.log(error.stack);
  }
};

module.exports = {
  register,
  connect,
};
