import {computed, makeObservable, observable} from 'mobx';

export type Name = {
  id: string;
  firstName: string;
  surname: string;
};

export class NameStore {
  names: Array<Name>;

  constructor() {
    this.names = [];

    makeObservable(this, {
      names: observable,
      firstNames: computed,
    });
  }

  get firstNames() {
    const firstNames = this.names.map((name) => name.firstName);
    return firstNames.join(', ');
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
  }

  update(name: Name) {
    if (this.has(name.id)) {
      this.delete(name.id);
    }
    this.create(name);
  }

  delete(id: string) {
    this.names = this.names.filter((name) => name.id !== id);
  }
}

export class RootMobxStore {
  nameStore: NameStore;

  constructor() {
    this.nameStore = new NameStore();
  }
}

export const rootStore = new RootMobxStore();
