import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators';
import {repeat} from 'lit/directives/repeat.js';

import {CRUDStoreController} from './crud-store-controller';
import {Name} from './crud-store';

@customElement('seven-gui-crud-shared-store')
export class CRUD extends LitElement {
  static styles = css`
    .invalid {
      background: coral;
    }
  `;

  private crudController: CRUDStoreController;

  @property()
  _filter = '';

  @property()
  _firstName = '';

  @property()
  _surname = '';

  @property()
  private _displayNames: Name[] = [];

  private _selectedName: Name | undefined;

  constructor() {
    super();

    const opMap: Map<string, EventListener> = new Map();
    opMap.set('create', this._doUpdate.bind(this));
    opMap.set('read', this._doUpdate.bind(this));
    opMap.set('delete', this._doUpdate.bind(this));
    opMap.set('update', this._doUpdate.bind(this));

    this.crudController = new CRUDStoreController(this, opMap);

    // Create some seed data
    this.crudController.store.create({
      firstName: `Hans-${(Math.random() * 100).toFixed(0)}`,
      surname: 'Emil',
    });
    this.crudController.store.create({
      firstName: `Max-${(Math.random() * 100).toFixed(0)}`,
      surname: 'Mustermann',
    });
    this.crudController.store.create({
      firstName: `Roman-${(Math.random() * 100).toFixed(0)}`,
      surname: 'Tisch',
    });

    this._updateDisplayList();
  }

  private _sortDisplayNames() {
    this._displayNames = this._displayNames.sort((nameA: Name, nameB: Name) => {
      return nameA.surname.localeCompare(nameB.surname);
    });
  }

  private _doUpdate(e: Event) {
    if (!e || !e.target) {
      return;
    }
    console.log(`Store event ${e.type}`);
    this._updateDisplayList();
    this.requestUpdate();
  }

  private _changeFilterString(e: Event) {
    if (!e || !e.target) {
      return;
    }
    this._filter = (e.target as HTMLInputElement).value;
    this._updateDisplayList();
  }

  private _clickCreate() {
    this.crudController.store.create({
      firstName: this._firstName,
      surname: this._surname,
    });
    this._updateDisplayList();
  }

  private _clickUpdate() {
    if (this._selectedName) {
      this.crudController.store.update({
        id: this._selectedName.id,
        firstName: this._firstName,
        surname: this._surname,
      });
    } else {
      this.crudController.store.create({
        firstName: this._firstName,
        surname: this._surname,
      });
    }
    this._updateDisplayList();
  }

  private _clickDelete() {
    if (this._selectedName) {
      this.crudController.store.delete(this._selectedName.id);
    }
    this._updateDisplayList();
  }

  // The shown list of names (_displayNames) is a subset of the store's full
  // list of names. When data changes in the store, we choose to update our
  // displayed list of names
  private _updateDisplayList() {
    this._displayNames = this.crudController.store.filterSurname(this._filter);
    this._sortDisplayNames();
  }

  private _selectName(e: Event) {
    if (!e || !e.target) {
      return;
    }
    const id = (e.target as HTMLInputElement).value;
    const name = this.crudController.store.get(id);
    if (!name) {
      return;
    }
    this._selectedName = name;
    this._firstName = name.firstName;
    this._surname = name.surname;
  }

  private _changeFirstName(e: Event) {
    if (!e || !e.target) {
      return;
    }
    this._firstName = (e.target as HTMLInputElement).value;
  }

  private _changeSurname(e: Event) {
    if (!e || !e.target) {
      return;
    }
    this._surname = (e.target as HTMLInputElement).value;
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"
      />
      <div class="box">
        <label class="is-size-5" for="filter">Filter Surname:</label>
        <input
          type="search"
          id="filter"
          name="filter"
          class="input"
          .value=${this._filter}
          @input="${this._changeFilterString}"
        /><br />

        <label class="is-size-5" for="name-select">Choose a Name:</label>
        <select
          name="name-select"
          id="name-select"
          size="5"
          @change=${this._selectName}
        >
          ${repeat(
            this._displayNames,
            (name) => name.surname,
            (name) =>
              html`<option value=${name.id}
                >${name.surname}, ${name.firstName}
              </option>`
          )} </select
        ><br />

        <label class="is-size-5" for="first-name">First Name</label>
        <input
          type="text"
          id="first-name"
          name="first-name"
          class="input"
          .value=${this._firstName}
          @input="${this._changeFirstName}"
        /><br />

        <label class="is-size-5" for="surname">Surname</label>
        <input
          type="text"
          id="surname"
          name="surname"
          class="input"
          .value=${this._surname}
          @input="${this._changeSurname}"
        /><br />

        <button class="button" @click=${this._clickCreate}>Create</button>
        <button class="button" @click=${this._clickUpdate}>Update</button>
        <button class="button" @click=${this._clickDelete}>Delete</button>
      </div>
    `;
  }
}
