import api from './api';
import bodyParser from 'body-parser';
import express from 'express';
import history from 'connect-history-api-fallback';
import path from 'path';
import serveStatic from 'serve-static';
import { unlockScriptFolder } from '/cli';
import { register } from '/fabric/wallet';
import { connect } from '/fabric/gateway';

const init = async () => {
  unlockScriptFolder();

  await register('user01');
  await connect('user01');
}

init();
const app = express();

const historyMiddleware = history({
  disableDotRule: true,
  verbose: true
});
const staticFileMiddleware = express.static(path.join(__dirname + '/dist'));
app.use(staticFileMiddleware);
app.use((req, res, next) => {
  if (req.path.includes('api/v1/')) {
    next();
  } else {
    historyMiddleware(req, res, next);
  }
});

app.use(serveStatic(__dirname + '/dist'));
const port = process.env.PORT || 4000;
const hostname = 'localhost';

app.use(bodyParser.json());
app.use('/api/v1', api); 

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
