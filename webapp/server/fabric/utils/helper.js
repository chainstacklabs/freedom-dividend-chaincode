const fs = require('fs');
const path = require('path');

const rootPath = process.cwd().includes('webapp')
  ? process.cwd().substring(0, process.cwd().indexOf('webapp'))
  : `${process.cwd()}/`;
const seralizePath = fileName => fs.readFileSync(path.resolve(__dirname, fileName), 'utf8');

module.exports = {
  seralizePath,
  rootPath,
};
