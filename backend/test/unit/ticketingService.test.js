import { expect } from 'chai';
import * as td from 'testdouble';

import dataMangerMock from '../mocks/modules/dataManager.mock.js';
import CustomMetric from '../mocks/modules/customMetric.mock.js';

describe('Unit tests for TicketingService', () => {
  let ticketingService;
  const mockModules = async () => {
    await td.replaceEsm('../../dal/dataManager.js', null, dataMangerMock);
    await td.replaceEsm('../../services/metrics/customMetric.js', null, CustomMetric);
    ticketingService = (await import('../../services/ticketingService.js')).default;
    td.reset();
  };

  before(async () => {
    await mockModules();
  });

  it('can get a single ticket', () => {
    expect(ticketingService.getTicket()).to.deep.eq({
      title: 'Mock title',
      description: 'Mock description',
    });
  });

  it('can get tickets', () => {
    expect(ticketingService.listTickets()).to.deep.eq([
      {
        title: 'Mock title',
        description: 'Mock description',
      },
    ]);
  });
});
