const path = require('path');
const { Wallets } = require('fabric-network');
const { generateCertPath, seralizePath } = require('./utils/helper');

const connect = () => Wallets.newFileSystemWallet(path.join(process.cwd(), '/fabric/wallets'));
const register = async identityLabel => {
  try {
    const { ADMIN_CERT, ADMIN_PRIVATE_KEY, MSP_ID: mspId } = await generateCertPath();
    const certificate = seralizePath(ADMIN_CERT);
    const privateKey = seralizePath(ADMIN_PRIVATE_KEY);

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
