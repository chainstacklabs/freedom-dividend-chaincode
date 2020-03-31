const envfile = require('envfile');
const path = require('path');
const { Wallets } = require('fabric-network');
const { seralizePath } = require('./utils/helper');

const connect = () => Wallets.newFileSystemWallet(path.join(process.cwd(), '/fabric/wallets'));
const register = async identityLabel => {
  try {
    const env = envfile.parseFileSync('.env');
    const { cert, private_key } = seralizePath(
      `${process.cwd()}/${env.ADMIN_IDENTITY_1}`,
    );
    const mspId = env.CORE_PEER_LOCALMSPID_1;
    const wallet = await connect();

    const existingIdentity = await wallet.get(identityLabel);
    if (existingIdentity) {
      console.log(`An identity for the admin user ${identityLabel} already exists in the wallet`);
      await wallet.list().then(console.log);

      return;
    }

    await wallet.put(identityLabel, {
      credentials: {
        certificate: cert,
        privateKey: private_key,
      },
      mspId,
      type: 'X.509',
    });
  } catch (error) {
    console.log(`Error adding to wallet. ${error}`);
    console.log(error.stack);
  }
};

// const installChaincode = async identity => {
//   try {
//     const gateway = await connect(identity);
//     const network = await gateway.getNetwork('defaultchannel');
//     const contract = await network.getContract('freedomDividendV3');

//     return  contract.submitTransaction('querySSN', '286-46-6157');
//   } catch (error) {
//     console.log(error);
//     console.error(`Failed to submit transaction: ${error}`);
//     process.exit(1);
//   }
// };

// Failed to connect to remote gRPC server nd-505-267-963.rg-353-176.int.chainstack.com url:grpcs://nd-505-267-963.rg-353-176.int.chainstack.com:7051 timeout:3000

module.exports = {
  // installChaincode,
  register,
  connect,
};
