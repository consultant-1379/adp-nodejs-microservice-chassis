import { expect } from 'chai';
import supertest from 'supertest';
import configUtil from '../util/config-util.js';

const DUMMY_TICKET = {
  title: 'dummy',
  id: '5',
  description: 'something',
};

const CONTENT_TYPE = 'Content-Type';

describe('Integration tests for chassis service', () => {
  let request;

  before(() => {
    request = supertest(configUtil.getServiceUrl());
  });

  it('Provides Liveness/Readyness endpoint', async () => {
    await request.get('/status').expect(200);
  });

  it('Can create new ticket', async () => {
    await request
      .post('/api/ticket')
      .send(DUMMY_TICKET)
      .set(CONTENT_TYPE, 'application/json')
      .set('Accept', 'application/json')
      .expect(CONTENT_TYPE, /text\/plain/)
      .expect(200)
      .expect((response) => {
        expect(response.text).to.equal('OK');
      });
  });

  it('The new ticket is returned with bulk request', async () => {
    await request
      .get('/api/tickets')
      .expect(200)
      .expect(CONTENT_TYPE, /json/)
      .expect((response) => {
        expect(response.body).to.be.an.instanceof(Array);
        const ticket = response.body.find(({ id }) => id === DUMMY_TICKET.id);
        expect(ticket).to.exist;
        expect(ticket.title).to.equal(DUMMY_TICKET.title);
        expect(ticket.description).to.equal(DUMMY_TICKET.description);
      });
  });

  it('Can retrieve specific ticket', async () => {
    await request
      .get(`/api/ticket/${DUMMY_TICKET.id}`)
      .expect(200)
      .expect(CONTENT_TYPE, /json/)
      .expect((response) => {
        const ticket = response.body;
        expect(ticket).to.exist;
        expect(ticket.title).to.equal(DUMMY_TICKET.title);
        expect(ticket.description).to.equal(DUMMY_TICKET.description);
      });
  });

  it('Can delete specific ticket', async () => {
    await request
      .delete(`/api/ticket/${DUMMY_TICKET.id}`)
      .expect(200)
      .expect(CONTENT_TYPE, /text\/plain/)
      .expect(200)
      .expect((response) => {
        expect(response.text).to.equal('OK');
      });

    await request
      .get('/api/tickets')
      .expect(200)
      .expect(CONTENT_TYPE, /json/)
      .expect((response) => {
        expect(response.body).to.be.an.instanceof(Array);
        const ticket = response.body.find(({ id }) => id === DUMMY_TICKET.id);
        expect(ticket).to.not.exist;
      });
  });
});
