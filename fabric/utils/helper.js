import fs from 'fs';
import path from 'path';

const seralizePath = fileName => JSON.parse(fs.readFileSync(path.resolve(__dirname, fileName), 'utf8'));

module.exports = {
  seralizePath,
};
