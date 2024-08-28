import dataManager from '../dal/dataManager.js';
import CustomMetric from './metrics/customMetric.js';

class TicketingService {
  startService() {
    this.metric = new CustomMetric('tickets', 'Total number of active tickets');
  }

  createNewTicket(ticket) {
    dataManager.persist(ticket);
    if (this.metric) {
      this.metric.add();
    }
  }

  getTicket(id) {
    return dataManager.findById(id);
  }

  listTickets() {
    return dataManager.list();
  }

  updateTicket(id, newTicket) {
    dataManager.update(id, newTicket);
  }

  deleteTicket(id) {
    dataManager.delete(id);
    if (this.metric) {
      this.metric.remove();
    }
  }

  idExists(id) {
    return dataManager.findById(id) !== undefined;
  }
}

const ticketingService = new TicketingService();
export default ticketingService;
