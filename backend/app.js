import * as path from 'path';
import v8 from 'v8';
import { fileURLToPath } from 'url';
import express from 'express';
import configManager from './config/configManager.js';
import { load } from './loaders/index.js';
import { getLogger } from './services/logging.js';
import certificateManager from './services/certificateManager.js';
import CONSTANTS from './config/constants.js';
import pmService from './services/pmService.js';
import ticketingService from './services/ticketingService.js';
import licenseManager from './services/licenseManager.js';

const app = express();
app.disable('x-powered-by');

const logger = getLogger();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

logger.info('The current configs are as follows:');
logger.info(JSON.stringify(configManager.getConfig(), null, 4));

const heapStatistics = v8.getHeapStatistics();
logger.info(
  `Heap size memory limit is set to ${Math.round(heapStatistics.heap_size_limit / 1024 / 1024)}MB.`,
);

pmService.applyPromMiddleware(app);
ticketingService.startService();

if (process.env.NODE_ENV === 'production') {
  app.use(CONSTANTS.FRONTEND_ROUTE, express.static(path.join(__dirname, '../frontend')));
}

if (process.env.NODE_ENV === 'bridge') {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { createProxyMiddleware } = require('http-proxy-middleware');
  app.use(
    CONSTANTS.FRONTEND_ROUTE,
    createProxyMiddleware({
      target: 'http://localhost:8080',
      followRedirects: true,
      logLevel: 'debug',
      pathRewrite: {
        [`${CONSTANTS.FRONTEND_ROUTE}`]: '',
      },
    }),
  );
}

// Run Loaders
load(app);

if (configManager.isLmEnabled()) {
  licenseManager.readLicensesInfo().then((licensesInfo) => {
    if (licensesInfo) {
      logger.info(JSON.stringify(licensesInfo));
    }
  });
}

// needed to close the app gracefully in tests
app.close = () => {
  pmService.shutDown();
  configManager.stopAllConfigWatch();
  certificateManager.stopCertificateWatch();
};

export default app;
