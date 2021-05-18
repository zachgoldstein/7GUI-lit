// The task is to build a frame containing an undo and redo button as well as a
// canvas area underneath. Left-clicking inside an empty area inside the canvas
// will create an unfilled circle with a fixed diameter whose center is the
// left-clicked point. The circle nearest to the mouse pointer such that the
// distance from its center to the pointer is less than its radius, if it
// exists, is filled with the color gray. The gray circle is the selected circle
// C. Right-clicking C will make a popup menu appear with one entry “Adjust
// diameter..”. Clicking on this entry will open another frame with a slider
// inside that adjusts the diameter of C. Changes are applied immediately.
// Closing this frame will mark the last diameter as significant for the
// undo/redo history. Clicking undo will undo the last significant change (i.e.
// circle creation or diameter adjustment). Clicking redo will reapply the last
// undoed change unless new changes were made by the user in the meantime.

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators';
import {CirclesController, CircleData} from './circles-controller';

@customElement('seven-gui-circles-adjust-diameter')
export class AdjustDiameter extends LitElement {
  static styles = css``;
  dialog: HTMLDialogElement;

  @property({type: String})
  circleId: string;

  constructor() {
    super();
    this.dialog = document.createElement('dialog') as HTMLDialogElement;
    this.circleId = '';
  }

  private _clickAdjustDiameter(e: Event) {
    if (!e || !e.target) {
      return;
    }
    const eventData = {diameter: (e.target as HTMLInputElement).value};
    this.dispatchEvent(
      new CustomEvent('adjustDiameter', {
        detail: eventData,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`<div>
      <label for="diameter">Adjusting diameter for ${this.circleId}</label>
      <input
        type="range"
        id="diameter"
        name="diameter"
        min="0"
        max="300"
        @input=${this._clickAdjustDiameter}
      />
    </div>`;
  }
}

@customElement('seven-gui-circles-popup')
export class PopupMenu extends LitElement {
  static styles = css`
    dialog {
      padding: 0;
      border: none;
    }
  `;
  circleAdjustment: AdjustDiameter;
  showingSubmenu: boolean;

  @property({type: String})
  circleId: string;

  constructor() {
    super();
    this.circleId = '';
    this.showingSubmenu = true;
    this.circleAdjustment = new AdjustDiameter();
    this.circleAdjustment.circleId = this.circleId;
  }

  private _clickAdjustDiameter() {
    this.showingSubmenu = false;
    this.requestUpdate();
  }

  render() {
    return html`${this.showingSubmenu
      ? html`
          <div>
            <button @click=${this._clickAdjustDiameter}>Adjust Diameter</button>
          </div>
        `
      : html`<seven-gui-circles-adjust-diameter></seven-gui-circles-adjust-diameter>`} `;
  }
}

@customElement('seven-gui-circles')
export class Circle extends LitElement {
  static styles = css`
    canvas {
      display: block;
      border: solid 1px gray;
    }
  `;

  private canvas: HTMLCanvasElement;
  private circleController = new CirclesController(this);
  private _latestMouseX = 0;
  private _latestMouseY = 0;
  private popupMenu: PopupMenu;

  private showingMenu: boolean;

  private circleAdjusting: CircleData | undefined;

  constructor() {
    super();
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('click', this._clickCanvas.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseEvent.bind(this));
    this.addEventListener('adjustDiameter', this._changeDiameter.bind(this));

    this.showingMenu = false;
    this.popupMenu = new PopupMenu();

    this.circleController.addCircle(50, 10, 10);
    this.circleController.addCircle(200, 50, 50);
    this.circleController.addCircle(20, 200, 50);
  }

  private _clickUndo() {
    this.circleController.undo();
  }

  private _clickRedo() {
    this.circleController.redo();
  }

  private _changeDiameter(e: Event) {
    console.log((e as CustomEvent).detail);

    if (this.circleAdjusting) {
      this.circleAdjusting.diameter = (e as CustomEvent).detail.diameter;
    }
    this.requestUpdate();
  }

  private _startCircleMenu(circleData: CircleData) {
    this.circleAdjusting = circleData;
    this.showingMenu = true;
    this.requestUpdate();
  }

  private _stopCircleMenu() {
    this.showingMenu = false;
    if (this.circleAdjusting) {
      this.circleController.changeCircle(
        this.circleAdjusting.diameter,
        this.circleAdjusting.id,
        this.circleAdjusting.x,
        this.circleAdjusting.y
      );
    }
    this.circleAdjusting = undefined;
  }

  private _clickCanvas(e: Event) {
    let circleSelected: CircleData | null = null;
    for (const [, circle] of this.circleController.currentCircles.entries()) {
      const dist = Math.sqrt(
        Math.pow((e as MouseEvent).offsetX - circle.x, 2) +
          Math.pow((e as MouseEvent).offsetY - circle.y, 2)
      );
      if (dist < circle.diameter / 2) {
        console.log(`Inside circle ${circle.id}`);
        circleSelected = circle;
      }
    }

    if (this.showingMenu == true) {
      this._stopCircleMenu();
    } else if (this.showingMenu == false && circleSelected != null) {
      this.popupMenu.circleId = circleSelected.id;
      this._startCircleMenu({...circleSelected});
    } else if (circleSelected == null) {
      this.circleController.addCircle(
        50,
        (e as MouseEvent).offsetX,
        (e as MouseEvent).offsetY
      );
      return;
    }

    this.requestUpdate();
  }

  mouseEvent(e: Event) {
    this._latestMouseX = (e as MouseEvent).offsetX;
    this._latestMouseY = (e as MouseEvent).offsetY;
    this.requestUpdate();
  }

  willUpdate() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let closestCircle: CircleData | null = null;
    let closestDist = -1;
    for (const [, circle] of this.circleController.currentCircles.entries()) {
      if (this.circleAdjusting && circle.id == this.circleAdjusting.id) {
        break;
      }
      const dist = Math.sqrt(
        Math.pow(this._latestMouseX - circle.x, 2) +
          Math.pow(this._latestMouseY - circle.y, 2)
      );
      if (
        dist < circle.diameter / 2 &&
        (closestDist == -1 || dist < closestDist)
      ) {
        closestCircle = circle;
        closestDist = dist;
      }
      const circlePath = new Path2D();
      circlePath.arc(circle.x, circle.y, circle.diameter / 2, 0, 2 * Math.PI);
      ctx.stroke(circlePath);
    }

    // Draw the selected circle being adjusted (change is not saved to store)
    if (this.circleAdjusting) {
      ctx.fillStyle = 'lightgrey';
      const circlePath = new Path2D();
      circlePath.arc(
        this.circleAdjusting.x,
        this.circleAdjusting.y,
        this.circleAdjusting.diameter / 2,
        0,
        2 * Math.PI
      );
      ctx.fill(circlePath);
      ctx.fillStyle = 'black';
      ctx.stroke(circlePath);
    }

    // Draw closest circle (if it exists) as filled
    if (closestCircle) {
      ctx.fillStyle = 'lightgrey';
      const circlePath = new Path2D();
      circlePath.arc(
        closestCircle.x,
        closestCircle.y,
        closestCircle.diameter / 2,
        0,
        2 * Math.PI
      );
      ctx.fill(circlePath);
    }
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"
      />
      <div class="box">
        <button class="button" @click=${this._clickUndo}>Undo</button>
        <button class="button" @click=${this._clickRedo}>Redo</button>
        ${this.showingMenu ? this.popupMenu : ''} ${this.canvas}
      </div>
    `;
  }
}
