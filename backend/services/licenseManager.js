import { LicenseManager } from '@adp/license-manager';
import { getLogger } from './logging.js';
import configManager from '../config/configManager.js';
import certificateManager from './certificateManager.js';
import CONSTANTS from '../config/constants.js';

const LICENSE_SERVICE = 'licenseManager';

function getLicenseManagerConfig() {
  const licenseManagerConfig = configManager.getLmConfig();
  const { secureContext, tlsAgent } = certificateManager?.getTLSOptions(LICENSE_SERVICE) || {};
  return {
    licenseManagerConfig,
    logger: getLogger(),
    tlsAgent,
    secureContext,
    useHttps: configManager.useHttps(),
  };
}

const licenseManager = new LicenseManager(getLicenseManagerConfig());

configManager.on('config-changed', ({ name }) => {
  if (name === CONSTANTS.CONTAINER_CONFIG_NAME) {
    const config = getLicenseManagerConfig();
    if (config) {
      licenseManager.setLicenseManagerConfig(config);
    }
  }
});

certificateManager.on('certificates-changed', (serviceName) => {
  if (serviceName === LICENSE_SERVICE) {
    const config = getLicenseManagerConfig();
    if (config) {
      licenseManager.setLicenseManagerConfig(config);
    }
  }
});

export default licenseManager;
