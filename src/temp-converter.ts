// The task is to build a frame containing two textfields TC and TF representing
// the temperature in Celsius and Fahrenheit, respectively. Initially, both TC
// and TF are empty. When the user enters a numerical value into TC the
// corresponding value in TF is automatically updated and vice versa. When the
// user enters a non-numerical string into TC the value in TF is not updated and
// vice versa. The formula for converting a temperature C in Celsius into a
// temperature F in Fahrenheit is C = (F - 32) * (5/9) and the dual direction is
// F = C * (9/5) + 32.

import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators';

@customElement('seven-gui-temp-converter')
export class TempConverter extends LitElement {
  static styles = css`
    .invalid {
      background: coral;
    }
  `;

  @state()
  tempCelsius = 0;

  @state()
  tempFarenheit = 0;

  @state()
  isCelsiusValid = true;

  @state()
  isFarenheitValid = true;

  private _convertCelsiusToFarenheit(e: Event) {
    const celsius = parseInt((e.target as HTMLInputElement).value, 10);
    if (isNaN(celsius)) {
      this.isCelsiusValid = false;
      return;
    }
    this.isCelsiusValid = true;
    this.tempCelsius = celsius;

    this.tempFarenheit = this.tempCelsius * (9 / 5) + 32;
  }

  private _convertFarenheitToCelsius(e: Event) {
    const farenheit = parseInt((e.target as HTMLInputElement).value, 10);
    if (isNaN(farenheit)) {
      this.isFarenheitValid = false;
      return;
    }
    this.isFarenheitValid = true;
    this.tempFarenheit = farenheit;

    this.tempCelsius = (this.tempFarenheit - 32) * (5 / 9);
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"
      />
      <div class="box">
        <label for="celsius" class="is-size-5">Celsius</label>
        <input
          type="text"
          id="celsius"
          name="celsius"
          class="input"
          class=${this.isCelsiusValid ? '' : 'invalid'}
          .value=${this.tempCelsius.toString()}
          @input="${this._convertCelsiusToFarenheit}"
        />

        <label for="farenheit" class="is-size-5">Farenheit</label>
        <input
          type="text"
          id="farenheit"
          name="farenheit"
          class="input"
          class=${this.isFarenheitValid ? '' : 'invalid'}
          .value=${this.tempFarenheit.toString()}
          @input="${this._convertFarenheitToCelsius}"
        />
      </div>
    `;
  }
}
