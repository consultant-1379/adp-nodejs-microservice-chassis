import { createRequire } from 'module';
import { UIConfigService } from '@adp/base';
import CONSTANTS from '../config/constants.js';

const require = createRequire(import.meta.url);
const apiConfig = require('../config/api-config.json');
const defaultUIConfig = require('../config/default-config-ui.json');

class UIConfig {
  instantiateUiConfig(configManager) {
    this.uiConfigService = new UIConfigService({
      configFilePath: CONSTANTS.UI_CONFIG_FILE,
      configManager,
      defaultValue: defaultUIConfig,
      configObject: {
        routes: { ...apiConfig },
      },
    });
  }

  getInstance() {
    if (!this.uiConfigService) {
      throw new Error('UiConfigService must be instantiated by the configManager');
    }
    return this.uiConfigService;
  }
}

const uiConfigService = new UIConfig();
export default uiConfigService;
