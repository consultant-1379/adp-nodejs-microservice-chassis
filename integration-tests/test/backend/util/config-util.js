class ConfigUtil {
  constructor() {
    if (process.env.KUBERNETES_MASTER_NODE && process.env.SERVICE_PATH) {
      this.SERVICE_URL = `https://${process.env.KUBERNETES_MASTER_NODE}${process.env.SERVICE_PATH}`;
    } else {
      this.SERVICE_URL = 'http://localhost:3001';
    }
  }

  getServiceUrl() {
    return this.SERVICE_URL;
  }
}

export default new ConfigUtil();
