import supertest from 'supertest';
import * as td from 'testdouble';

const factory = () => {
  let app;
  let pmService;
  let server;

  const loadServer = async (...mocks) => {
    mocks.forEach(async (mock) => {
      if (mock.isDefault) {
        await td.replaceEsm(mock.libName, null, mock.impl);
      } else {
        await td.replaceEsm(mock.libName, mock.impl);
      }
    });
    pmService = (await import('../../services/pmService.js')).default;
    app = (await import('../../app.js')).default;
    td.reset();
    server = await app.listen();
    const req = supertest.agent(server);
    pmService.resetPromClient();
    return req;
  };
  const closeServer = async () => {
    app.close();
    await server.close();
  };

  return {
    loadServer,
    closeServer,
  };
};

export default factory;
