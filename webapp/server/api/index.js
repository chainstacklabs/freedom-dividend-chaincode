import express from 'express';
import { gateway } from 'fabric/gateway';
import { execute } from 'cli';
const api = express();

api.get('/network', (req, res, next) => {
  // demo bridge between node.js and peer cli bash command
  const channels = Array.from(gateway.client.channels.keys());

  Promise.all([
    execute({ ACTION: 'queryInstalled', PEER: 'one' }),
    execute({ ACTION: 'queryCommitted', PEER: 'one' })
  ]).then(([installed, committed]) => {
    res.send({
      channels,
      installed_chaincodes: JSON.parse(installed.stdout).installed_chaincodes,
      chaincode_definitions: JSON.parse(committed.stdout).chaincode_definitions,
    });
  })
  .catch(next);
});

api.get('/chaincode/:chaincode', async (req, res, next) => {
  try {
    const channels = Array.from(gateway.client.channels.keys());

    const network = await gateway.getNetwork(channels[0]);
    const contract = await network.getContract(req.params.chaincode);
    const response = await contract.evaluateTransaction('org.hyperledger.fabric:GetMetadata');

    res.send(JSON.parse(response.toString()));
  } catch(e) {
    res.status(500).json(e.message);
  }
});

api.post('/chaincode/transaction', async (req, res, next) => {
  try {
    const channels = Array.from(gateway.client.channels.keys());

    const network = await gateway.getNetwork(channels[0]);
    const contract = await network.getContract(req.body.contract);
    const response = await contract.submitTransaction(...req.body.args);

    res.send(response.toString());
  } catch(e) {
    res.status(500).json(e.message);
  }
});

export default api;
