import { expect } from 'chai';
import ChassisPage from '../../../../frontend/test_js/page-objects/chassis/Chassis.page.js';

describe('Chassis Page', () => {
  before(async () => {
    await ChassisPage.open();
    await ChassisPage.waitForLoading();
  });

  it('can show the chassis component', async () => {
    const h1Text = await ChassisPage.getH1Text();
    const h2Text = await ChassisPage.getH2Text();

    expect(h1Text).to.eq('Your component markup goes here');
    expect(h2Text).to.eq('props');
  });
});
