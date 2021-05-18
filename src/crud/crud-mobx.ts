import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators';
import {repeat} from 'lit/directives/repeat.js';

import {CRUDMobxController} from './crud-mobx-controller';
import {Name} from './crud-mobx-store';

@customElement('seven-gui-crud-mobx')
export class CRUDMobx extends LitElement {
  static styles = css`
    .invalid {
      background: coral;
    }
  `;

  private crudController = new CRUDMobxController(this);

  @property()
  filter = '';

  @property()
  firstName = '';

  @property()
  surname = '';

  @property({type: Array})
  displayNames: Name[] = [];

  private _selectedName: Name | undefined;

  constructor() {
    super();

    this.crudController.nameStore.create({firstName: 'Hans', surname: 'Emil'});
    this.crudController.nameStore.create({
      firstName: 'Max',
      surname: 'Mustermann',
    });
    this.crudController.nameStore.create({
      firstName: 'Roman',
      surname: 'Tisch',
    });
  }

  private _changeFilterString(e: Event) {
    this.filter = (e.target as HTMLInputElement).value;
  }

  private _clickCreate() {
    this.crudController.nameStore.create({
      firstName: this.firstName,
      surname: this.surname,
    });
  }

  private _clickUpdate() {
    if (this._selectedName) {
      this.crudController.nameStore.update({
        id: this._selectedName.id,
        firstName: this.firstName,
        surname: this.surname,
      });
    } else {
      this.crudController.nameStore.create({
        firstName: this.firstName,
        surname: this.surname,
      });
    }
  }

  private _clickDelete() {
    if (this._selectedName) {
      this.crudController.nameStore.delete(this._selectedName.id);
    }
  }

  private _selectName(e: Event) {
    const id = (e.target as HTMLInputElement).value;
    const name = this.crudController.nameStore.get(id);
    if (!name) {
      return;
    }
    this._selectedName = name;
    this.firstName = name.firstName;
    this.surname = name.surname;
  }

  private _changeFirstName(e: Event) {
    this.firstName = (e.target as HTMLInputElement).value;
  }

  private _changeSurname(e: Event) {
    this.surname = (e.target as HTMLInputElement).value;
  }

  private _sortDisplayNames() {
    this.displayNames = this.displayNames.sort((nameA: Name, nameB: Name) => {
      return nameA.surname.localeCompare(nameB.surname);
    });
  }

  willUpdate(changedProperties: any) {
    console.log(`changedProperties: ${changedProperties}`);
    this.displayNames = this.crudController.nameStore.filterSurname(
      this.filter
    );
    this._sortDisplayNames();
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
          .value=${this.filter}
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
            this.displayNames,
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
          .value=${this.firstName}
          @input="${this._changeFirstName}"
        /><br />

        <label class="is-size-5" for="surname">Surname</label>
        <input
          type="text"
          id="surname"
          name="surname"
          class="input"
          .value=${this.surname}
          @input="${this._changeSurname}"
        /><br />

        <button class="button" @click=${this._clickCreate}>Create</button>
        <button class="button" @click=${this._clickUpdate}>Update</button>
        <button class="button" @click=${this._clickDelete}>Delete</button>
      </div>
    `;
  }
}
