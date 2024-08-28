import { EventEmitter } from 'events';
import { expect } from 'chai';
import * as td from 'testdouble';
import CONSTANTS from '../../config/constants.js';
import * as adpBaseMock from '../mocks/modules/adp.base.mock.js';

const baseLoggingConfig = {
  enabled: true,
  defaultLogLevel: 'info',
  stdout: {
    enabled: true,
  },
  filelog: {
    enabled: false,
  },
  syslog: {
    enabled: true,
    syslogHost: 'localhost',
    syslogFacility: 'local0',
  },
};

describe('Unit tests for logging.js', () => {
  let logging;
  before(async () => {
    await td.replaceEsm('@adp/base', adpBaseMock);
    logging = await import('../../services/logging.js');
    td.reset();
  });

  after(() => {
    td.reset();
  });

  afterEach(() => {
    td.reset();
  });

  it('should listen to "config-changed" event after the configManager reference is added with addConfigListener()', () => {
    const configManagerMock = new EventEmitter();
    const getLoggingConfigSpy = td.func();
    td.when(getLoggingConfigSpy()).thenReturn(baseLoggingConfig);
    configManagerMock.getLoggingConfig = getLoggingConfigSpy;
    configManagerMock.getUIConfig = () => true;

    logging.addConfigListener(configManagerMock);
    const isLoggingInitialized = td.explain(getLoggingConfigSpy).callCount === 1;

    configManagerMock.emit('config-changed', { name: CONSTANTS.CONTAINER_CONFIG_NAME });
    const isLoggingReconfiguredAfterEvent = td.explain(getLoggingConfigSpy).callCount === 2;

    expect(isLoggingInitialized).to.be.true;
    expect(isLoggingReconfiguredAfterEvent).to.be.true;
  });

  it('should listen to "certificates-changed" event, and be reconfigured when "logtransformer" service certificates were changed', () => {
    const certificateManagerMock = new EventEmitter();
    const getTLSOptionsSpy = td.func();
    td.when(getTLSOptionsSpy(), { ignoreExtraArgs: true }).thenReturn({
      securecontext: {
        ca: 'ca',
        cert: 'cert',
        key: 'key',
      },
      tlsAgent: {
        options: {
          keepAlive: true,
          rejectUnauthorized: true,
          path: null,
        },
      },
    });
    certificateManagerMock.getTLSOptions = getTLSOptionsSpy;

    const configManagerMock = new EventEmitter();
    const getLoggingConfigSpy = td.func();
    td.when(getLoggingConfigSpy()).thenReturn(baseLoggingConfig);
    configManagerMock.getLoggingConfig = getLoggingConfigSpy;
    configManagerMock.getUIConfig = () => true;

    logging.addConfigListener(configManagerMock);
    logging.addCertificateListener(certificateManagerMock);
    const isLoggingInitialized = td.explain(getLoggingConfigSpy).callCount === 2;

    certificateManagerMock.emit('certificates-changed', 'logtransformer');
    const isLoggingReconfiguredAfterEvent = td.explain(getLoggingConfigSpy).callCount === 3;

    expect(isLoggingInitialized).to.be.true;
    expect(isLoggingReconfiguredAfterEvent).to.be.true;
  });
});
