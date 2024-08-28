import { createRequire } from 'module';
import { expect } from 'chai';
import * as td from 'testdouble';
import * as loggingMock from '../mocks/modules/logging.mock.js';
import chokidarMock from '../mocks/modules/chokidarMock.js';

const require = createRequire(import.meta.url);
const defaultUIConfig = require('../../config/default-config-ui.json');

describe('Unit tests for configManager.js', () => {
  let configManager;
  const mockModules = async () => {
    await td.replaceEsm('../../services/logging.js', loggingMock);
    await td.replaceEsm('chokidar', null, chokidarMock);
    await td.replaceEsm('../services/uiConfigService.js', null, {
      instantiateUiConfig: () => null,
    });
    configManager = (await import('../../config/configManager.js')).default;
    td.reset();
  };
  before(async () => {
    await mockModules();
  });

  after(() => {
    configManager.stopAllConfigWatch();
  });

  it('configManager instance should not be undefined', () => {
    expect(configManager).to.be.not.undefined;
  });

  it('configManager should have required methods', () => {
    expect(configManager.on).to.be.not.undefined;
    expect(configManager.get).to.be.not.undefined;
    expect(configManager.startConfigWatch).to.be.not.undefined;
    expect(configManager.stopAllConfigWatch).to.be.not.undefined;
  });

  it('can successfully read the default UI configuration', () => {
    expect(JSON.stringify(configManager.getUIConfig())).to.eq(JSON.stringify(defaultUIConfig));
  });

  it('getLoggingConfig() should return the merged logging config with logtransformer config', () => {
    const loggingConf = configManager.getLoggingConfig();
    expect(loggingConf.enabled).to.exist;
    expect(loggingConf.defaultLogLevel).to.exist;
    expect(loggingConf.tls.enabled).to.exist;
  });
});
