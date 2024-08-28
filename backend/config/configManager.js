import { createRequire } from 'module';
import { ConfigManager } from '@adp/base';
import CONSTANTS from './constants.js';
import { getLogger, addConfigListener } from '../services/logging.js';
import uiConfigService from '../services/uiConfigService.js';

const require = createRequire(import.meta.url);
const defaultConfig = require('./default-config.json');

const logger = getLogger();

class BackendConfigManager extends ConfigManager {
  constructor(...args) {
    super(...args);
    uiConfigService.instantiateUiConfig(this);
    addConfigListener(this);
  }

  getConfig() {
    return this.get(CONSTANTS.CONTAINER_CONFIG_NAME);
  }

  getLoggingConfig() {
    if (!this.getConfig().logging) {
      return undefined;
    }
    return {
      ...this.getConfig().logging,
      ...this.getConfig().dependencies?.logtransformer,
      ...{ tls: { enabled: this.useHttps() } },
    };
  }

  useHttps() {
    return this.getConfig().useHttps;
  }

  verifyClientCertificate() {
    return this.getConfig().verifyClientCertificate === 'required';
  }

  getCertificatePath() {
    return CONSTANTS.CERTIFICATES_DIR;
  }

  getDependenciesConfig() {
    return this.getConfig().dependencies;
  }

  getFaultManagerConfig() {
    return {
      ...this.getConfig().faultIndications,
      ...this.getConfig().dependencies?.faultHandler,
      ...{
        tls: {
          ...this.getConfig().dependencies?.faultHandler?.tls,
          enabled: this.useHttps(),
        },
      },
    };
  }

  getPromConfig() {
    return this.getConfig().dependencies?.prometheus || {};
  }

  getLmConfig() {
    return {
      ...this.getConfig().loggingLicenses,
      ...this.getConfig().dependencies?.licenseManager,
    };
  }

  isLmEnabled() {
    const config = this.getConfig().loggingLicenses || {};
    return !!config.enabled;
  }

  getUIConfig() {
    return this.get(CONSTANTS.UI_CONFIG_NAME);
  }
}

const configManager = new BackendConfigManager(
  [
    {
      name: CONSTANTS.CONTAINER_CONFIG_NAME,
      filePath: CONSTANTS.CONTAINER_CONFIG_FILE,
      defaultValue: defaultConfig,
    },
  ],
  logger,
);

export default configManager;
