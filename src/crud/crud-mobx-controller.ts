import {ReactiveController, ReactiveControllerHost} from 'lit';
import {autorun, IReactionDisposer} from 'mobx';
import {rootStore, NameStore, RootMobxStore} from './crud-mobx-store';

export class CRUDMobxController implements ReactiveController {
  host: ReactiveControllerHost;

  private rootStore: RootMobxStore;
  private _disposers: IReactionDisposer[];
  nameStore: NameStore;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    this.rootStore = rootStore;
    this.nameStore = this.rootStore.nameStore;
    this._disposers = [];
  }

  hostConnected() {
    this._disposers = [
      // Whenever the names array in the nameStore changes, update the host
      // component
      // Nothing stopping autoruns like this from also exiting in the host
      // component, but being able to separate them out and reuse controllers
      // gives you more options
      // Keeping them out of the stores cleans up the logic there
      autorun(() => {
        console.log(`first names: ${this.nameStore.firstNames}`);
        this.host.requestUpdate();
      }),
    ];
  }

  hostDisconnected() {
    this._disposers.forEach((disposer) => {
      disposer();
    });
  }
}
