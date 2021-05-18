import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators';
import {CellController} from './cell-controller';

@customElement('seven-gui-cell')
export class Cell extends LitElement {
  static styles = css``;

  private cellController: CellController;
  private _isEditing: boolean;
  private _initialEditValue: string;
  private keyDownBound: EventListener;

  @property()
  _editValue: string;

  constructor(row: string, column: string) {
    super();
    this._isEditing = false;
    this._editValue = '';
    this._initialEditValue = '';
    this.cellController = new CellController(this, row, column);

    // Create a bound reference so adding/removing listener has the same ref
    this.keyDownBound = this._keyDown.bind(this);
  }

  private _setCellInput(e: Event) {
    if (!e || !e.target) {
      return;
    }
    this._editValue = (e.target as HTMLInputElement).value;
  }

  // Editing stops when the user presses enter to commit the input, or cancels
  // input by clicking away or escape
  private _startEditing(e: Event) {
    console.log(e);
    this._isEditing = true;
    this._initialEditValue = this._editValue;
    // window.addEventListener('click', this._stopEditing.bind(this), true);
    this.addEventListener('keydown', this.keyDownBound);
    // TODO: add support for escape
  }

  private _stopEditing(e: Event) {
    console.log(e);
    // window.removeEventListener('click', this._stopEditing.bind(this), true);
    this.removeEventListener('keydown', this.keyDownBound);
    this._isEditing = false;
    this._editValue = this._initialEditValue;
    this.requestUpdate();
  }

  // Press Enter to confirm input into cell
  private _keyDown(e: Event) {
    if ((e as KeyboardEvent).key != 'Enter') {
      return;
    }
    e.preventDefault();

    // window.removeEventListener('click', this._stopEditing.bind(this), true);
    this.removeEventListener('keydown', this.keyDownBound);
    this._isEditing = false;
    this._commit();
    this._editValue = this.cellController.cellData.value;
    this._initialEditValue = this._editValue;
    this.blur();
  }

  private _commit() {
    // this._editValue = `${Date.now()}` // TEMP
    if (!this._isInputValid(this._editValue)) {
      console.error(
        `Invalid input ${this._editValue} for row ${this.cellController.cellData.row} and column ${this.cellController.cellData.column}`
      );
      return;
    }
    this.cellController.setCell(this._editValue);
    // alert(`Set ${this._editValue} on cell with row ${this.cellController.cellData.row} and column ${this.cellController.cellData.column} `)
  }

  private get cellText(): string {
    if (this._isEditing) {
      return this._editValue;
    }
    {
      return this.cellController.cellData.value;
    }
  }

  private _isInputValid(input: string) {
    console.log(input);
    return true;
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"
      />
      <div>
        <input
          type="text"
          id="start-date"
          name="start-date"
          .value=${this.cellText}
          @click="${this._startEditing}"
          @input="${this._setCellInput}"
          @blur="${this._stopEditing}"
        />
      </div>
    `;
  }
}
