import {ReactiveControllerHost, ReactiveController} from 'lit';
import {cellStore, CellStore, CellData} from './cell-store';

export class CellController implements ReactiveController {
  host: ReactiveControllerHost;

  store: CellStore;

  constructor(host: ReactiveControllerHost, row: string, column: string) {
    (this.host = host).addController(this);
    this.store = cellStore;
    this.cellData = {
      row,
      column,
      input: '',
      value: '',
    };
  }

  cellData: CellData;

  private _storeUpdate(e: Event) {
    if (!e || !e.target) {
      return;
    }
    const updateDetail: CellData = (e as CustomEvent).detail;

    if (
      updateDetail.row == this.cellData.row &&
      updateDetail.column == this.cellData.column
    ) {
      this.cellData.value = updateDetail.value;
      this.host.requestUpdate();
    }
  }

  setCell(input: string) {
    this.cellData.input = input;
    this.store.updateCell(this.cellData);
  }

  hostConnected() {
    this.store.addEventListener('update', this._storeUpdate.bind(this));
  }

  hostDisconnected() {
    this.store.removeEventListener('update', this._storeUpdate.bind(this));
  }
}
