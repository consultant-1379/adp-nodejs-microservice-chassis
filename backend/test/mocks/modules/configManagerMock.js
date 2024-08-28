import { EventEmitter } from 'events';
import { createRequire } from 'module';
import CONSTANTS from '../../../config/constants.js';

const require = createRequire(import.meta.url);
const defaultConfig = require('../../../config/default-config.json');
const defaultUIConfig = require('../../../config/default-config-ui.json');

class ConfigManagerMock extends EventEmitter {
  get(configName) {
    switch (configName) {
      case CONSTANTS.CONTAINER_CONFIG_NAME:
        return defaultConfig;
      case CONSTANTS.UI_CONFIG_NAME:
        return defaultUIConfig;
      default:
        return {};
    }
  }

  startConfigWatch() {
    return null;
  }

  stopAllConfigWatch() {
    return null;
  }

  getConfig() {
    return null;
  }

  discoverIngress() {
    return null;
  }

  useHttps() {
    return null;
  }

  verifyClientCertificate() {
    return null;
  }

  getCertificatePath() {
    return null;
  }

  getDependenciesConfig() {
    return null;
  }

  getLoggingConfig() {
    return null;
  }

  getPromConfig() {
    return null;
  }

  getFaultManagerConfig() {
    return null;
  }

  getUIConfig() {
    return null;
  }
}

export default ConfigManagerMock;
