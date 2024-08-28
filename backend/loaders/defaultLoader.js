import { createRequire } from 'module';
import express from 'express';
import bodyParser from 'body-parser';
import { getInternalRoutes, getTicketingRoutes, getHelloWorldRoute } from '../routes/index.js';
import { getAuditLogger } from '../services/auditLogging.js';

const require = createRequire(import.meta.url);
const apiConfig = require('../config/api-config.json');

// Loads the express module, initializes routes and settings.

export default (app) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(express.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '50mb' }));
  // Add Express middleware for audit logging
  app.use('/', (req, res, next) => {
    req.loggerAudit = getAuditLogger({
      req,
      res,
    });
    next();
  });

  // Load API routes
  app.use(apiConfig.api.prefix, getTicketingRoutes(), getHelloWorldRoute());
  app.use(apiConfig.internal.prefix, getInternalRoutes());

  // Return the express app
  return app;
};
