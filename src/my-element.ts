/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {LitElement, html, customElement, property, css} from 'lit-element';
import './my-other-element.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
    ::slotted(*) { color: red; }
    div {
      margin-left: 1rem;
    }
    div ::slotted(*) {
      color: blue;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property({type: String})
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0;

  /**
   * Whether or not child components should be appended to LightDOM.
   */
  @property({type: Boolean})
  compose = null;



  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    console.log('connected:', this);
  }

  createChildren(label :string, slot :string = '') {
    const text = document.createTextNode(label);
    const el = document.createElement('my-other-element');

    if (slot) {
      el.setAttribute('slot', slot);
    }

    el.appendChild(text);
    return el;
  }

  // Called after connected/render
  firstUpdated(changedProperties :any) {
    console.log('firstUpdated:', changedProperties);

    const slots = this.shadowRoot?.querySelectorAll('slot');
    slots?.forEach(slot => {
      // console.log('slot:', slot.name);

      slot.addEventListener('slotchange', e => {
        console.log(this.id, 'slotchange:', e.target);
      });
    });
    

    // DYNAMICALLY ADD CHILDREN
    //
    // TODO: Await dynamic content, then append nodes to slots
    // https://lit-element.polymer-project.org/guide/styles#style-the-components-children
    if (this.compose) {

      // This works, but children do not inherit ::slotted styling
      const debug = false;
      if (debug) {
        const slots = this.shadowRoot?.querySelectorAll('slot');
        slots?.forEach(slot => {
          console.log('slot:', slot.name);

          // This works to append children, but they don't inherit ::slotted styling
          if (slot.name == 'one') {
            slot.innerHTML = '<my-other-element>Shalacka</my-other-element>';
          } else {
            slot.innerHTML = `
              <my-other-element>Shabazz</my-other-element>
              <my-other-element>Shazam</my-other-element>
            `;
          }
        });
      }

      // This works as expected, because we're appending directly to the LightDOM
      const elements = ['Foo', 'Bar', 'Baz', 'Bim'];
      this.count = elements.length;
      elements.forEach((el, i) => {
        const label = i === 0 ? 'one' : '' ;
        this.appendChild(this.createChildren(el, label));
      });

      console.log('Added child components dynamically..');
    }
  }

  render() {
    console.log('render');

    // Use a single template, whether children are static or dynmic
    return html`
      ${this.counterTemplate}
      <slot name="one"></slot>
      <div>
        <slot></slot>
      </div>
    `;
  }

  private _onClick() {
    this.count++;
  }

  // WORKING
  get counterTemplate() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
    `;
  }

  // NOT WORKING
  //
  // Keeping it for reference as an anti-pattern
  get cardTemplate() {
    let children = ['foo', 'bar', 'baz'];
    let childrenNested :string[] = [];
    if (this.count > 1) {
      childrenNested = children.slice(1, this.count);
    }
    console.log(childrenNested);
    
    return html`
        <my-other-element slot="one">${children[0]}</my-other-element>
        ${childrenNested.map(i => html`<my-other-element>${i}</my-other-element>`)}
        `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
