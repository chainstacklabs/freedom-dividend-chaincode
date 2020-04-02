#### Setup Environment
- download peer binary on your local machine `sudo bash downloadPeerBinary.sh`
- download relevant certs to project folder
- create .env file base on .env.template *
- setup repo dependencies with `npm install`
- start node.js server
```
// Start node.js Server
$ npm run start
// Or start server with nodemon (requires nodemon to be installed on your local machine)
// npm i nodemon -g
$ npm run startnodemon
```
#### setup chaincode on fabric network
- install chaincode via bash script on network `node cli/peer install`
- upgrade chaincode via bash script on network `node cli/peer upgrade`
  - ensure chaincode binary has been updated
  - version and sequence will be automatically updated

#### chaincode interaction via node.js api endpoint
Submit chaincode transaction
```
curl --location --request POST 'http://localhost:4000/api/v1/chaincode/transaction' \
--header 'Content-Type: application/json' \
--data-raw '{
  "contract": "freedomDividendV6",
  "args": ["optIn", "286-46-6159", "Word"]
}'
```
Query chaincode
```
curl --location --request POST 'http://localhost:4000/api/v1/chaincode/transaction' \
--header 'Content-Type: application/json' \
--data-raw '{
  "contract": "freedomDividendV5",
  "args": [ "querySSN", "286-46-6159" ]
}'
```
Query network details
```
curl --location --request GET 'http://localhost:4000/api/v1/network'
```