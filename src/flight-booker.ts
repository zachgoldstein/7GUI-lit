// The task is to build a frame containing a combobox C with the two options
// “one-way flight” and “return flight”, two textfields T1 and T2 representing
// the start and return date, respectively, and a button B for submitting the
// selected flight. T2 is enabled iff C’s value is “return flight”. When C has
// the value “return flight” and T2’s date is strictly before T1’s then B is
// disabled. When a non-disabled textfield T has an ill-formatted date then T is
// colored red and B is disabled. When clicking B a message is displayed
// informing the user of his selection (e.g. “You have booked a one-way flight
// on 04.04.2014.”). Initially, C has the value “one-way flight” and T1 as well
// as T2 have the same (arbitrary) date (it is implied that T2 is disabled).

import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators';

enum FlightTypes {
  OneWay = 'one-way',
  Return = 'return',
}

@customElement('seven-gui-flight-booker')
export class FlightBooker extends LitElement {
  static styles = css`
    .invalid {
      background: coral;
    }
  `;

  @state()
  startTimestamp = 1636084800000;

  @state()
  startDateString = '11.05.2021';

  @state()
  returnTimestamp = 1636084800000;

  @state()
  returnDateString = '11.06.2021';

  @state()
  flightType = FlightTypes.OneWay;

  get isStartDateValid(): boolean {
    return this._isDate(this.startDateString) ? true : false;
  }
  get isReturnDateValid(): boolean {
    return this._isDate(this.returnDateString) ? true : false;
  }

  get isFlightValid(): boolean {
    if (!this.isStartDateValid || !this.isReturnDateValid) {
      return false;
    }

    if (
      this.flightType == FlightTypes.Return &&
      this.returnTimestamp < this.startTimestamp
    ) {
      return false;
    }
    return true;
  }

  private _isDate(dateString: string): boolean {
    const date = Date.parse(dateString);
    if (isNaN(date)) {
      return false;
    }
    return true;
  }

  private _getDate(dateString: string): number {
    return Date.parse(dateString);
  }

  private _changeStartDate(e: Event) {
    this.startDateString = (e.target as HTMLInputElement).value as string;
    this.startTimestamp = this._getDate(this.startDateString);
  }

  private _changeReturnDate(e: Event) {
    this.returnDateString = (e.target as HTMLInputElement).value as string;
    this.returnTimestamp = this._getDate(this.returnDateString);
  }

  private _changeFlightType(e: Event) {
    this.flightType = (e.target as HTMLInputElement).value as FlightTypes;
  }

  private _book() {
    if (!this.isFlightValid) {
      return;
    }

    if (this.flightType == FlightTypes.Return) {
      alert(
        `You have booked a return flight from ${this.startDateString} to ${this.returnDateString}`
      );
    } else if (this.flightType == FlightTypes.OneWay) {
      alert(`You have booked a one way flight on ${this.startDateString}`);
    }
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"
      />
      <div class="box">
        <label for="flight-select" class="is-size-5">Flight Type</label>
        <select
          name="flight-select"
          id="flight-select"
          class="select"
          @input="${this._changeFlightType}"
        >
          <option value="${FlightTypes.OneWay}">one-way flight</option>
          <option value="${FlightTypes.Return}">return flight</option> </select
        ><br />

        <label for="start-date" class="is-size-5">Start Date</label>
        <input
          type="text"
          id="start-date"
          name="start-date"
          class="input"
          .value=${this.startDateString}
          class="${this.isStartDateValid ? '' : 'invalid'}"
          @input="${this._changeStartDate}"
        /><br />

        <label for="return-date" class="is-size-5">Return Date</label>
        <input
          type="text"
          id="return-date"
          name="return-date"
          class="input"
          .value=${this.returnDateString}
          class="${this.isReturnDateValid ? '' : 'invalid'}"
          .disabled="${this.flightType == FlightTypes.OneWay}"
          @input="${this._changeReturnDate}"
        /><br />

        <button
          class="button"
          @click="${this._book}"
          .disabled="${!this.isFlightValid}"
        >
          Book
        </button>
      </div>
    `;
  }
}
