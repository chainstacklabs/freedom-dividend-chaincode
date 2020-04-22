import { Gateway } from 'fabric-network';
import { rootPath, seralizePath } from 'fabric/utils/helper';
import { connect as connectWallet } from 'fabric/wallet';
const envfile = require('envfile');

const gateway = new Gateway();

const connect = async identity => {
  const parsedFile = envfile.parseFileSync(`${rootPath}/webapp/server/.env`);
  const connectionProfile = JSON.parse(seralizePath(`${rootPath}/webapp/certs/connection-profile.json`));
  const wallet = await connectWallet();

  console.log(`==========AS_LOCALHOST: ${parsedFile.AS_LOCALHOST}==========`);
  await gateway.connect(connectionProfile, {
    identity: 'user01',
    wallet,
    discovery: { enabled: true, asLocalhost: (parsedFile.AS_LOCALHOST === 'true') }
  });
};

module.exports = {
  gateway,
  connect,
};
