import {ReactiveController, ReactiveControllerHost} from 'lit';

export class TimerController implements ReactiveController {
  host: ReactiveControllerHost;

  startTime = 0;
  elapsedTime = 0;
  duration = 1000;
  frequency = 20;
  private _timerID?: number;

  get fractionElapsed() {
    return this.elapsedTime / this.duration;
  }

  constructor(host: ReactiveControllerHost, duration = 1000, frequency = 20) {
    (this.host = host).addController(this);
    this.duration = duration;
    this.frequency = frequency;
  }

  setDuration(duration: number) {
    this.duration = duration;
    this.reset();
  }

  reset() {
    this._timerStop();
    this._timerStart();
  }

  _timerStart() {
    this.startTime = Date.now();
    this.elapsedTime = 0;
    if (this._timerID) {
      this._timerStop();
    }
    this._timerID = window.setInterval(
      this._timerInterval.bind(this),
      this.frequency
    );
  }

  _timerInterval() {
    this.elapsedTime = Date.now() - this.startTime;
    if (this.elapsedTime > this.duration) {
      this._timerStop();
    } else {
      this.host.requestUpdate();
    }
  }

  _timerStop() {
    clearInterval(this._timerID);
    this._timerID = undefined;
    this.host.requestUpdate();
  }

  hostConnected() {
    this._timerStart();
  }

  hostDisconnected() {
    this._timerStop();
  }
}
