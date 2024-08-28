import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { api, internal } = require('./api-config.json');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export { api, internal };
