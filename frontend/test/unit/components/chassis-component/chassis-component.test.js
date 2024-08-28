import { expect, fixture } from '@open-wc/testing';
import ChassisComponent from '../../../../src/components/chassis-component/chassis-component.js';

describe('ChassisComponent Component Tests', () => {
  before(() => {
    ChassisComponent.register();
  });

  describe('Basic component setup', () => {
    it('should render <e-chassis-component>', async () => {
      const component = await fixture(
        '<e-chassis-component></e-chassis-component>',
      );
      const headingTag = component.shadowRoot.querySelector('h1');

      expect(
        headingTag.textContent,
        '"Your component markup goes here" was not found',
      ).to.equal('Your component markup goes here');
    });
  });
});
