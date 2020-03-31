import express from 'express';
import { gateway } from 'fabric/gateway';
import { execute } from 'cli';
const api = express();

api.get('/network', (req, res, next) => {
  // demo bridge between node.js and peer cli bash command
  execute({ ACTION: 'queryChannels', PEER: 'one' })
    .then(response => {
      res.send(response.stdout);
    }).catch(err => {
      next(err);
    });
});

api.post('/chaincode/transaction', async (req, res, next) => {
  try {
    const network = await gateway.getNetwork('defaultchannel');
    const contract = await network.getContract(req.body.contract);
    const response = await contract.submitTransaction(...req.body.args);

    res.send(response.toString());
  } catch(e) {
    next(e);
  }
});

export default api;
