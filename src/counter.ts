import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators';

// The task is to build a frame containing a label or read-only textfield T and
// a button B. Initially, the value in T is “0” and each click of B increases
// the value in T by one.

@customElement('seven-gui-counter')
export class Counter extends LitElement {
  static styles = css``;

  @state()
  count = 0;

  private _increment() {
    this.count += 1;
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"
      />
      <div class="box">
        <label for="counterDisplay" class="is-size-5">Count:</label>
        <input
          type="text"
          id="counterDisplay"
          name="counterDisplay"
          class="input"
          required
          readonly
          value="${this.count}"
        />
        <button @click="${this._increment}" class="button">Count</button>
      </div>
    `;
  }
}
