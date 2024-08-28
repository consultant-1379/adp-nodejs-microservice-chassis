/**
 * MicroserviceChassisApp is defined as
 * `<e-microservice-chassis-app>`
 *
 * @extends {App}
 */
import { App, html, definition } from '@eui/app';
import style from './microservice-chassis-app.css';
import ChassisComponent from '../../components/chassis-component/chassis-component';

export default class MicroserviceChassisApp extends App {
  // Uncomment this block to add initialization code
  // constructor() {
  //   super();
  //   // initialize
  // }

  static get components() {
    return {
      'e-chassis-component': ChassisComponent,
    };
  }

  didConnect() {
    this.bubble('app:title', { displayName: 'Microservice Chassis' });
    this.bubble('app:subtitle', { subtitle: '' });
  }

  /**
   * Render the <e-microservice-chassis-app> app. This function is called each time a
   * prop changes.
   */
  render() {
    return html` <e-chassis-component></e-chassis-component> `;
  }
}

definition('e-microservice-chassis-app', {
  style,
})(MicroserviceChassisApp);

MicroserviceChassisApp.register();
