import { expect } from 'chai';
import * as td from 'testdouble';
import LicenseManagerMock from '../mocks/modules/licenseManager.mock.js';

const CERT_PATH = 'certificates';

const TLS_AGENT = 'tlsAgent';
const LICENSES = [
  {
    keyId: 'keyId_test',
    type: 'test_type',
  },
];
const PRODUCT_TYPE = 'test_product_type';

let licenseManager;
const baseLMConfig = {
  enabled: false,
  tls: {
    enabled: false,
    verifyServerCert: true,
    sendClientCert: true,
  },
  tlsPort: 2222,
  httpPort: 1111,
  hostname: 'test_hostname',
  productType: PRODUCT_TYPE,
  licenses: LICENSES,
};

const configManagerMock = {
  getLmConfig: () => baseLMConfig,
  useHttps: () => false,
  getCertificatePath: () => CERT_PATH,
  on: () => true,
};
const certificateManagerMock = {
  getTLSOptions: () => ({ secureContext: true, tlsAgent: TLS_AGENT }),
  on: () => true,
};
const loggerMock = {
  getLogger: () => ({
    error: () => true,
    info: () => true,
    debug: () => true,
  }),
};

describe('Unit tests for licenseManager.js', () => {
  const mockModules = async () => {
    await td.replaceEsm('@adp/license-manager', { LicenseManager: LicenseManagerMock });
    await td.replaceEsm('../../config/configManager.js', null, configManagerMock);
    await td.replaceEsm('../../services/logging.js', loggerMock);
    await td.replaceEsm('../../services/certificateManager.js', null, certificateManagerMock);
    licenseManager = (await import('../../services/licenseManager.js')).default;
    td.reset();
  };

  beforeEach(async () => {
    await mockModules();
  });

  it('licenseManager should have required methods', () => {
    expect(licenseManager.readLicensesInfo).to.be.not.undefined;
    expect(licenseManager.setLicenseManagerConfig).to.be.not.undefined;
  });

  it('should send correct request', () => {
    const { secureContext, tlsAgent } = certificateManagerMock.getTLSOptions();
    const data = licenseManager.readLicensesInfo();
    expect(data.useHttps).to.be.equal(configManagerMock.useHttps());
    expect(data.licenseManagerConfig).to.be.equal(baseLMConfig);
    expect(data.secureContext).to.be.equal(secureContext);
    expect(data.tlsAgent).to.be.equal(tlsAgent);
  });
});
