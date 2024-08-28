import express from 'express';
import ticketingService from '../services/ticketingService.js';
import validateTicketInput from '../middleware/validateTicketInput.js';
import validateId from '../middleware/validateTicketId.js';
import HTTP_STATUS from '../utils/httpStatus.js';
import { api } from '../config/index.js';

const { routes } = api;

const router = express.Router();

const TICKET_ID = `${routes.ticket}/:id`;

export default () => {
  router.post(routes.ticket, validateTicketInput, (req, res) => {
    const { ticket } = req;
    ticketingService.createNewTicket(ticket);

    res.sendStatus(HTTP_STATUS.OK);
  });

  router.get(routes.tickets, (_req, res) => res.json(ticketingService.listTickets()));

  router.get(TICKET_ID, validateId, (req, res) => {
    const { id } = req.params;
    res.json(ticketingService.getTicket(id));
  });

  router.put(TICKET_ID, validateId, validateTicketInput, (req, res) => {
    const { id } = req.params;
    ticketingService.updateTicket(id, req.ticket);

    res.sendStatus(HTTP_STATUS.OK);
  });

  router.delete(TICKET_ID, validateId, (req, res) => {
    const { id } = req.params;
    ticketingService.deleteTicket(id);
    res.sendStatus(HTTP_STATUS.OK);
  });

  router.get(routes.helloworld, (req, res) => {
    res.send('Hello World!');
  });

  return router;
};
