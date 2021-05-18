import {ReactiveController, ReactiveControllerHost} from 'lit';

export type Name = {
  id: string;
  firstName: string;
  surname: string;
};

export class CRUDController implements ReactiveController {
  host: ReactiveControllerHost;

  private names: Name[];

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    this.names = [];
  }

  filterSurname(filterString?: string): Name[] {
    if (!filterString) {
      return this.names;
    }

    return this.names.filter((name) => {
      return name.surname.toUpperCase().includes(filterString.toUpperCase())
        ? true
        : false;
    });
  }

  get(id: string): Name | undefined {
    return this.names.find((name) => name.id == id);
  }

  getId(name: {firstName: string; surname: string}): string | undefined {
    const retrievedName = this.names.find(
      (_name) =>
        _name.firstName == name.firstName && _name.surname == name.surname
    );
    if (retrievedName) {
      return retrievedName.id;
    }
    return;
  }

  has(id: string): boolean {
    const names = this.names.filter((name) => name.id == id);
    return names.length > 0;
  }

  private _getUID(): string {
    return `${Date.now().toString()}-${Math.floor(Math.random() * 1000000)}`;
  }

  create(name: {firstName: string; surname: string}) {
    const newName = {...name, id: this._getUID()};
    this.names.push(newName);
    this.host.requestUpdate();
  }

  update(name: Name) {
    if (this.has(name.id)) {
      this.delete(name.id);
    }
    this.create(name);
    this.host.requestUpdate();
  }

  delete(id: string) {
    this.names = this.names.filter((name) => name.id !== id);
    this.host.requestUpdate();
  }

  hostConnected() {
    this.host.requestUpdate();
  }

  hostDisconnected() {
    this.host.requestUpdate();
  }
}
