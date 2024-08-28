/**
 * Integration tests for <e-microservice-chassis-app>
 */
import { expect, fixture } from '@open-wc/testing';
import '../../../../src/apps/microservice-chassis-app/microservice-chassis-app.js';

describe('MicroserviceChassisApp Application Tests', () => {
  describe('Basic application setup', () => {
    it('should create a new <e-microservice-chassis-app>', async () => {
      const element = await fixture(
        '<e-microservice-chassis-app></e-microservice-chassis-app>',
      );
      const chassisComponent = element.shadowRoot.querySelector(
        'e-chassis-component',
      );

      expect(chassisComponent).to.not.be.null;
      expect(chassisComponent).to.exist;
    });
  });
});
