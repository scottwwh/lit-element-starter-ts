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

  @property({type: Boolean})
  compose = null;

  render() {
    if (this.compose) {
      return html`
        ${this.counterTemplate}
        <my-other-element>Hello</my-other-element>
        <my-other-element>Hello</my-other-element>
        <my-other-element>Hello</my-other-element>
      `;
    } else {
      return html`
        ${this.counterTemplate}
        <slot name="one"></slot>
        <div>
          <slot></slot>
        </div>
      `;
    }
  }

  private _onClick() {
    this.count++;
  }

  get counterTemplate() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
    `;
  }

  foo(): string {
    return 'foo';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
