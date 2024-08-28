class DataManager {
  constructor() {
    this.collection = [];
  }

  persist(data) {
    this.collection = [...this.collection, data];
  }

  findById(id) {
    return this.collection.find((data) => data.id === id);
  }

  list() {
    return this.collection;
  }

  update(id, newData) {
    const index = this.collection.findIndex((data) => data.id === id);
    this.collection[index] = newData;
  }

  delete(id) {
    const index = this.collection.findIndex((data) => data.id === id);
    this.collection.splice(index, 1);
  }
}

const dataManager = new DataManager();
export default dataManager;
