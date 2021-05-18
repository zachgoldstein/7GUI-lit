import {ReactiveController, ReactiveControllerHost} from 'lit';
import {crudStore, CRUDStore} from './crud-store';

export class CRUDStoreController implements ReactiveController {
  host: ReactiveControllerHost;

  private ops: Map<string, EventListener>;
  store: CRUDStore;

  constructor(host: ReactiveControllerHost, ops: Map<string, EventListener>) {
    (this.host = host).addController(this);
    this.store = crudStore;
    this.ops = ops;
  }

  hostConnected() {
    this.ops.forEach((op, opKey) => {
      this.store.addEventListener(opKey, op);
    });
  }

  hostDisconnected() {
    this.ops.forEach((op, opKey) => {
      this.store.removeEventListener(opKey, op);
    });
  }
}
