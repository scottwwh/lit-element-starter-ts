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

 /**
  * TODO: Add example of until()
  */

import {LitElement, html, customElement, property, css} from 'lit-element';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-other-element')
export class MyOtherElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 1rem;
      max-width: 800px;
    }
`;

  /**
   * Array to store retrieved metadata.
   */
  @property({type: Array})
  metadata :string[] = [];

  async getData(id :number) {
    // CORS!
    // const url :string = `https://xkcd.com/${id}/info.0.json`;
    const url :string = `https://jsonplaceholder.typicode.com/todos/${id}`;    
    const response = await fetch(url, {
      // mode: 'no-cors' // 'cors' by default
    });
    const data = await response.json();
    console.log(data);

    const arr :string[] = [];
    Object.keys(data).forEach(k => {
      arr.push(`${k} : ${data[k]}`);
    })

    return arr;
  }

  // Called after connected/render
  firstUpdated(changedProperties :any) {
    console.log('firstUpdated:', changedProperties);

    const id :number = parseInt(String(Math.random() * 100));
    const data = this.getData(id);
    data.then(data => {
      this.metadata = data;
    });
    // console.log(this.metadata);

    console.log('Added content..');
  }

  render() {
    return html`
      <slot></slot>
      ${this.metadataTemplate}
    `;
  }

  get metadataTemplate() {
    return html`
      <ul>
        ${this.metadata.map((i :string) => html`<li>${i}</li>`)}
      </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-other-element': MyOtherElement;
  }
}
