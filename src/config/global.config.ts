import { join } from 'path';
import { address } from 'ip';

export default {
  env: process.env.NODE_ENV,
  appName: 'NestApplication',
  ip: address('public', 'ipv4'),
  port: process.env.NEST_APPLICATION_PORT || 3002,
  rootDir: join(__dirname, '..'),
};
