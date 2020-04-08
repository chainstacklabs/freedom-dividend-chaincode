const envfile = require('envfile');
const path = require('path');
const { Wallets } = require('fabric-network');
const { seralizePath } = require('./utils/helper');

const connect = () => Wallets.newFileSystemWallet(path.join(process.cwd(), '/fabric/wallets'));
const register = async identityLabel => {
  try {
    const env = envfile.parseFileSync('.env');

    const certificate = seralizePath(`${process.cwd()}/${env.ADMIN_CERT}/`);
    const privateKey = seralizePath(`${process.cwd()}/${env.ADMIN_PRIVATE_KEY}/`);
    const mspId = env.CORE_PEER_LOCALMSPID;

    const wallet = await connect();

    const existingIdentity = await wallet.get(identityLabel);
    if (existingIdentity) {
      console.log(`An identity for the admin user ${identityLabel} already exists in the wallet`);
      await wallet.list().then(console.log);

      return;
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
