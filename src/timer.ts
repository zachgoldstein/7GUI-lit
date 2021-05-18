// The task is to build a frame containing a gauge G for the elapsed time e, a
// label which shows the elapsed time as a numerical value, a slider S by which
// the duration d of the timer can be adjusted while the timer is running and a
// reset button R. Adjusting S must immediately reflect on d and not only when S
// is released. It follows that while moving S the filled amount of G will
// (usually) change immediately. When e ≥ d is true then the timer stops (and G
// will be full). If, thereafter, d is increased such that d > e will be true
// then the timer restarts to tick until e ≥ d is true again. Clicking R will
// reset e to zero.

import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators';
import {TimerController} from './timer-controller';

@customElement('seven-gui-timer')
export class Timer extends LitElement {
  static styles = css`
    .invalid {
      background: coral;
    }
  `;

  private timer = new TimerController(this, 10000);

  @state()
  startTimestamp = 1636084800000;

  private _reset() {
    this.timer.reset();
  }

  private _changeDuration(e: Event) {
    if (!e || !e.target) {
      return;
    }
    this.timer.setDuration(parseInt((e.target as HTMLInputElement).value));
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"
      />
      <div class="box">
        <label class="is-size-5" for="elapsed-time">Elapsed Time</label>
        <progress
          class="progress"
          id="elapsed-time"
          max="${this.timer.duration}"
          value="${this.timer.elapsedTime}"
        >
          ${this.timer.fractionElapsed.toFixed(2)}%
        </progress>
        <span class="is-size-5"
          >Remaining Time: ${this.timer.elapsedTime / 1000}s</span
        ><br />

        <label class="is-size-5" for="duration"
          >Duration: ${this.timer.duration / 1000}s</label
        >
        <input
          type="range"
          id="duration"
          name="duration"
          min="0"
          max="10000"
          @input=${this._changeDuration}
        /><br />

        <button class="button" @click=${this._reset}>Reset</button>
      </div>
    `;
  }
}
