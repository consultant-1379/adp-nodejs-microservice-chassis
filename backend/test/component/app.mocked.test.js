import { expect } from 'chai';
import dataManager from '../mocks/modules/dataManager.mock.js';
import nodeFetchMock from '../mocks/modules/nodeFetch.mock.js';
import chokidarMock from '../mocks/modules/chokidarMock.js';
import * as loggingMock from '../mocks/modules/logging.mock.js';
import HTTP_STATUS from '../../utils/httpStatus.js';
import factory from './factory.js';

// the first test case's before hook will load app.js and its dependencies
// not all dependencies are mocked, as app.test is also kind of integration test
// the first import of some non-mocked 3pp libs can take up to 5 seconds
// see ADPRS-415 for more details
const INITAL_LOAD_TIMEOUT = 120_000;

describe('Mocked Component tests for app.js', () => {
  let request;

  const loadServerDataManager = {
    libName: '../../dal/dataManager.js',
    isDefault: true,
    impl: dataManager,
  };
  const loadServerLogging = {
    libName: '../../services/logging.js',
    isDefault: false,
    impl: loggingMock,
  };
  const loadServerChokidar = {
    libName: 'chokidar',
    isDefault: true,
    impl: chokidarMock,
  };
  const loadServerNodeFetch = {
    libName: 'node-fetch',
    isDefault: true,
    impl: nodeFetchMock,
  };
  const { loadServer, closeServer } = factory();

  // eslint-disable-next-line func-names
  before(async function () {
    this.timeout(INITAL_LOAD_TIMEOUT);
    request = await loadServer(
      loadServerDataManager,
      loadServerLogging,
      loadServerNodeFetch,
      loadServerChokidar,
    );
  });

  after(async () => {
    await closeServer();
  });

  it('can get a single ticket', async () => {
    await request
      .get('/api/ticket/id')
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS.OK)
      .expect((response) => {
        expect(response.body).to.deep.eq({
          title: 'Mock title',
          description: 'Mock description',
        });
      });
  });

  it('can get tickets', async () => {
    await request
      .get('/api/tickets')
      .expect('Content-Type', /json/)
      .expect(HTTP_STATUS.OK)
      .expect((response) => {
        expect(response.body).to.deep.eq([
          {
            title: 'Mock title',
            description: 'Mock description',
          },
        ]);
      });
  });
});
