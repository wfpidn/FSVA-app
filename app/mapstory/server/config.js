
import path from 'path';

export const root = path.normalize(__dirname + '/..');

if (path.basename(root) !== 'mapstory') {
  throw new Error('Must be executed in "mapstory" root directory');
}

export default {
  host: '127.0.0.1',
  port: 3005,
  root
};
