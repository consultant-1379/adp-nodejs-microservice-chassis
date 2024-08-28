import euiFrame from '../common/eui-frame.component.js';

const cssPaths = {
  chassisApp: 'e-microservice-chassis-app',
  chassisComponent: 'e-chassis-component',
  h1: 'h1',
  h2: 'h2',
};

class ChassisPage extends euiFrame.PageBase {
  async root() {
    const content = await this.content();
    const chassisApp = await content.$(cssPaths.chassisApp);
    return chassisApp.shadow$(cssPaths.chassisComponent);
  }

  async open() {
    await browser.url(`${browser.options.baseUrl}/#microservice-chassis-app`);
  }

  async getH1Text() {
    const root = await this.root();
    const h1 = await root.shadow$(cssPaths.h1);
    return h1.getText();
  }

  async getH2Text() {
    const root = await this.root();
    const h2 = await root.shadow$(cssPaths.h2);
    return h2.getText();
  }
}

export default new ChassisPage();
