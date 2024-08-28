export default class {
  constructor(options) {
    this.data = options;
  }

  readLicensesInfo() {
    return this.data;
  }

  setLicenseManagerConfig(data) {
    this.data = data;
  }
}
