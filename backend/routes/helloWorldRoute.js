import { createRequire } from 'module';
import express from 'express';

const require = createRequire(import.meta.url);
const apiConfig = require('../config/api-config.json');

const router = express.Router();

export default () => {
  router.get(apiConfig.api.routes.helloworld, (_req, res) => res.json({ message: 'Hello World!' }));
  return router;
};
