import crypto from 'crypto';

class TicketModel {
  constructor(params) {
    this.id = params.id ? params.id : crypto.randomBytes(16).toString('hex');
    this.title = params.title;
    this.description = params.description;
    this.dateCreated = new Date(params.dateCreated).valueOf();
  }
}

export default TicketModel;
