import supertest from 'supertest';
import { expect } from 'chai';
import * as td from 'testdouble';

const APP_NAME = 'current_app_name';
const CONTENT_TYPE = 'Content-Type';

let CustomMetric;
let server;
let app;
let express;
let loggingMock;
let request;

const createLoggingMock = () => {
  const logger = {
    error: (message) => ({ logLevel: 'error', message }),
  };
  return { getLogger: () => logger };
};

const loadServer = async () => {
  express = (await import('express')).default;
  app = express();
  server = await app.listen();
  request = supertest.agent(server);
};
const closeServer = async () => {
  await server.close();
};

const configDefault = {
  useHttps: () => false,
  getHttpsOptions: () => ({}),
  getUiServiceCertificatePath: () => '/',
};

const configEnabled = {
  getPromConfig: () => ({
    enabled: true,
    appName: APP_NAME,
  }),
  ...configDefault,
};

const checkMetric = async (metricName, checkFunction) => {
  const metricRegexp = new RegExp(`(?<=${metricName}\\{.+\\}\\s)\\d+`);
  await request
    .get('/metrics')
    .expect(CONTENT_TYPE, /text\/plain/)
    .expect((response) => {
      const actualValue = response.text.match(metricRegexp);
      checkFunction(actualValue);
    })
    .expect(200);
};

const checkMerticValue = async (metricName, gaugeValue) => {
  await checkMetric(metricName, (actualValue) => {
    expect(actualValue).not.to.be.null;
    expect(Number(actualValue[0])).to.equal(gaugeValue);
  });
};

describe('Unit tests for metrics collection', () => {
  describe('Testing working pmService', () => {
    let pmService;
    const mockModules = async (configManagerMock) => {
      loggingMock = createLoggingMock();
      await td.replaceEsm('../../config/configManager.js', null, configManagerMock);
      await td.replaceEsm('../../services/logging.js', loggingMock);
      pmService = (await import('../../services/pmService.js')).default;
      CustomMetric = (await import('../../services/metrics/customMetric.js')).default;
      td.reset();
    };
    before(async () => {
      await mockModules(configEnabled);
      await loadServer();
      pmService.applyPromMiddleware(app);
    });

    after(async () => {
      pmService.shutDown();
      await closeServer();
    });

    it('should be enabled', () => {
      expect(pmService.isEnabled()).to.be.true;
    });

    it('can use the custom metric', async () => {
      const metricName = 'test_metric';
      const metricFullName = `${APP_NAME}_${metricName}_num`;
      const customMetric = new CustomMetric(metricName);
      await checkMerticValue(metricFullName, 0);
      customMetric.add();
      await checkMerticValue(metricFullName, 1);
      customMetric.add();
      await checkMerticValue(metricFullName, 2);
      customMetric.remove();
      await checkMerticValue(metricFullName, 1);
      customMetric.reset();
      await checkMerticValue(metricFullName, 0);
      customMetric.clear();
      await checkMetric(metricName, (actualValue) => {
        expect(actualValue).to.be.null;
      });
    });
  });
});
