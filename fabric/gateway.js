import { Gateway } from 'fabric-network';
import { seralizePath } from 'fabric/utils/helper';
import { connect as connectWallet } from 'fabric/wallet';

const gateway = new Gateway();

const connect = async identity => {
  const connectionProfile = seralizePath('./../../connection-profile.json');
  const wallet = await connectWallet();

  await gateway.connect(connectionProfile, {
    identity: 'thomas',
    wallet,
    discovery: { enabled: true, asLocalhost: false }
  });
};

module.exports = {
  gateway,
  connect,
};
