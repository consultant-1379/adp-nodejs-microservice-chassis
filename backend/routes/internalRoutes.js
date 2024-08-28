import { createRequire } from 'module';
import express from 'express';
import uiConfigService from '../services/uiConfigService.js';
import CONSTANTS from '../config/constants.js';

const require = createRequire(import.meta.url);
const apiConfig = require('../config/api-config.json');

const router = express.Router();

export default () => {
  router.get(
    apiConfig.internal.routes.config,
    uiConfigService.getInstance().getUIConfigMiddleware(),
  );
  // to pervent the invalid favicon request error
  router.get(CONSTANTS.FAVICON_ROUTE, (req, res) => res.sendStatus(404));

  return router;
};
