export type Name = {
  id: string;
  firstName: string;
  surname: string;
};

export class CRUDStore extends EventTarget {
  private names: Name[];

  constructor() {
    super();
    this.names = [];
  }

  filterSurname(filterString?: string): Name[] {
    if (!filterString) {
      return this.names;
    }

    const readNames = this.names.filter((name) => {
      return name.surname.toUpperCase().includes(filterString.toUpperCase())
        ? true
        : false;
    });
    this._dispatch('read');
    return readNames;
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
    this._dispatch('create');
  }

  update(name: Name) {
    if (this.has(name.id)) {
      this.delete(name.id);
    }
    this.create(name);
    this._dispatch('update');
  }

  delete(id: string) {
    this.names = this.names.filter((name) => name.id !== id);
    this._dispatch('delete');
  }

  private _dispatch(eventName: string) {
    return this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {eventName: eventName},
        cancelable: true,
      })
    );
  }
}

export const crudStore = new CRUDStore();
