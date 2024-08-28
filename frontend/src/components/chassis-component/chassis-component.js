/**
 * Component ChassisComponent is defined as
 * `<e-chassis-component>`
 *
 * @extends {LitComponent}
 */
import { LitComponent, html, definition } from '@eui/lit-component';
import style from './chassis-component.css';

export default class ChassisComponent extends LitComponent {
  // Uncomment this block to add initialization code
  // constructor() {
  //   super();
  //   // initialize
  // }

  static get components() {
    return {
      // register components here
    };
  }

  /**
   * Render the <e-chassis-component> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<h1>Your component markup goes here</h1>
      <h2>props</h2>
      prop-one: ${this.propOne}
      <p>prop-two: ${this.propTwo}</p>`;
  }
}

/**
 * @property {Boolean} propOne - show active/inactive state.
 * @property {String} propTwo - shows the "Hello World" string.
 */
definition('e-chassis-component', {
  style,
  props: {
    propOne: { attribute: true, type: Boolean },
    propTwo: { attribute: true, type: String, default: 'Hello World' },
  },
})(ChassisComponent);
