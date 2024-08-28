import { expect } from 'chai';
import * as loggingMock from '../mocks/modules/logging.mock.js';
import nodeFetchMock from '../mocks/modules/nodeFetch.mock.js';
import chokidarMock from '../mocks/modules/chokidarMock.js';
import HTTP_STATUS from '../../utils/httpStatus.js';
import factory from './factory.js';

const FIRST_TICKET = {
  title: 'My First Ticket',
  description: 'I posted this ticket.',
};

const UPDATED_TICKET = {
  title: 'Updated ticket',
  description: 'Updated description.',
};

const API_TICKETS = '/api/tickets';
const API_TICKET = '/api/ticket';
const CONTENT_TYPE = 'Content-Type';

const PARAMS = {
  chokidar: 'chokidar',
  nodeFetch: 'node-fetch',
};

// the first test case's before hook will load app.js and its dependencies
// not all dependencies are mocked, as app.test is also kind of integration test
// the first import of some non-mocked 3pp libs can take up to 5 seconds
// see ADPRS-415 for more details
const INITAL_LOAD_TIMEOUT = 120_000;

describe('Component tests for app.js', () => {
  let request;
  const loadServerLogging = {
    libName: '../../services/logging.js',
    isDefault: false,
    impl: loggingMock,
  };

  const loadServerChokidar = {
    libName: PARAMS.chokidar,
    isDefault: true,
    impl: chokidarMock,
  };

  const loadServerNodeFetch = {
    libName: PARAMS.nodeFetch,
    isDefault: true,
    impl: nodeFetchMock,
  };

  const { loadServer, closeServer } = factory();
  describe('Testing CRUD operations', () => {
    let TICKET;

    // eslint-disable-next-line func-names
    before(async function () {
      this.timeout(INITAL_LOAD_TIMEOUT);
      request = await loadServer(loadServerLogging, loadServerNodeFetch, loadServerChokidar);
    });

    after(async () => {
      await closeServer();
    });

    it('/list endpoint returns empty array if there are no tickets', async () => {
      await request
        .get(API_TICKETS)
        .expect(CONTENT_TYPE, /json/)
        .expect(HTTP_STATUS.OK)
        .expect((response) => {
          expect(response.body).to.have.lengthOf(0);
        });
    });

    it('can register a ticket', async () => {
      await request
        .post(API_TICKET)
        .send(FIRST_TICKET)
        .set('Accept', 'application/json')
        .expect(HTTP_STATUS.OK);

      await request
        .get(API_TICKETS)
        .expect(CONTENT_TYPE, /json/)
        .expect(HTTP_STATUS.OK)
        .expect((response) => {
          const { body } = response;
          const ticket = body[0];

          TICKET = ticket;
          expect(body).to.have.lengthOf(1);
          expect(ticket.title).to.be.a('string');
          expect(ticket.description).to.be.a('string');
          expect(ticket.id).to.be.a('string');
          expect(ticket.dateCreated).to.be.a('number');
        });
    });

    it('can request a ticket by id', async () => {
      await request
        .get(`/api/ticket/${TICKET.id}`)
        .expect(CONTENT_TYPE, /json/)
        .expect(HTTP_STATUS.OK)
        .expect((response) => {
          const { body } = response;
          expect(body).to.deep.eq(TICKET);
        });
    });

    it('can update a ticket', async () => {
      await request
        .put(`/api/ticket/${TICKET.id}`)
        .send(UPDATED_TICKET)
        .set('Accept', 'application/json')
        .expect(200);

      await request
        .get(API_TICKETS)
        .expect(CONTENT_TYPE, /json/)
        .expect(HTTP_STATUS.OK)
        .expect((response) => {
          const { body } = response;
          const ticket = body[0];

          expect(body).to.have.lengthOf(1);
          expect(ticket.title).to.eq(UPDATED_TICKET.title);
          expect(ticket.description).to.eq(UPDATED_TICKET.description);
          expect(ticket.id).to.eq(TICKET.id);
        });
    });

    it('can delete a ticket by id', async () => {
      await request.delete(`/api/ticket/${TICKET.id}`).expect(200);

      await request
        .get(API_TICKETS)
        .expect(CONTENT_TYPE, /json/)
        .expect(HTTP_STATUS.OK)
        .expect((response) => {
          expect(response.body).to.have.lengthOf(0);
        });
    });
  });

  describe('Testing error handling', () => {
    before(async () => {
      request = await loadServer(loadServerLogging);
    });

    after(async () => {
      await closeServer();
    });

    it('handles if id does not exist', async () => {
      await request
        .get(`/api/ticket/someId`)
        .expect(HTTP_STATUS.NOT_FOUND)
        .expect((response) => {
          expect(response.text).to.eq('There is no ticket with this id.');
        });
    });

    it('handles if ticket has no title.', async () => {
      await request
        .post(API_TICKET)
        .send({})
        .expect(HTTP_STATUS.BAD_REQUEST)
        .expect((response) => {
          expect(response.text).to.eq('Title is incorrect or missing.');
        });
    });

    it('handles if ticket has no description.', async () => {
      await request
        .post(API_TICKET)
        .send({ title: 'Test' })
        .expect(HTTP_STATUS.BAD_REQUEST)
        .expect((response) => {
          expect(response.text).to.eq('Description is incorrect or missing.');
        });
    });

    it('handles if a ticket title is not a string.', async () => {
      await request
        .post(API_TICKET)
        .send({ title: 5 })
        .expect(HTTP_STATUS.BAD_REQUEST)
        .expect((response) => {
          expect(response.text).to.eq('Title is incorrect or missing.');
        });
    });
  });
});
