let TICKETS = [
  {
    title: 'Mock title',
    description: 'Mock description',
  },
];

class DataManager {
  persist(data) {
    TICKETS = [...TICKETS, data];
  }

  findById() {
    return TICKETS[0];
  }

  list() {
    return TICKETS;
  }

  update(data) {
    TICKETS[0] = data;
  }

  delete() {
    TICKETS.pop();
  }
}

const dataManager = new DataManager();
export default dataManager;
