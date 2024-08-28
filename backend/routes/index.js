import express from 'express';
import ticketingRoutes from './ticketingRoutes.js';
import internalRoutes from './internalRoutes.js';
import invalidRoutes from './invalidRoutes.js';
import helloworldRoute from './helloWorldRoute.js';

const router = express.Router();

const getInternalRoutes = () => {
  router.use(internalRoutes());
  return router;
};

const getTicketingRoutes = () => {
  router.use(ticketingRoutes());
  return router;
};

const getInvalidRoutes = () => {
  router.use(invalidRoutes());
  return router;
};

const getHelloWorldRoute = () => {
  router.use(helloworldRoute());
  return router;
};

export { getInternalRoutes, getTicketingRoutes, getInvalidRoutes, getHelloWorldRoute };
