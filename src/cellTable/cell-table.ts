// The task is to create a simple but usable spreadsheet application. The
// spreadsheet should be scrollable. The rows should be numbered from 0 to 99
// and the columns from A to Z. Double-clicking a cell C lets the user change
// C’s formula. After having finished editing the formula is parsed and
// evaluated and its updated value is shown in C. In addition, all cells which
// depend on C must be reevaluated. This process repeats until there are no more
// changes in the values of any cell (change propagation). Note that one should
// not just recompute the value of every cell but only of those cells that
// depend on another cell’s changed value. If there is an already provided
// spreadsheet widget it should not be used. Instead, another similar widget
// (like JTable in Swing) should be

import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators';
import {Cell} from './cell';

@customElement('seven-gui-cell-table')
export class CellTable extends LitElement {
  static styles = css``;

  cells: Cell[][];

  @state()
  columns = 5;

  @state()
  rows = 5;

  constructor() {
    super();
    this.cells = [];
    this.rows = 5;
    this.columns = 5;

    Array.from({length: this.rows}, (_, i) => {
      this.cells.push();
      const row: Cell[] = [];
      Array.from({length: this.columns}, (_, j) => {
        row.push(new Cell(i.toString(), j.toString()));
      });
      this.cells.push(row);
    });
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"
      />
      <div class="box">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                ${Array.from({length: this.columns}, (_, i) => {
                  return html`<th>Col: ${String.fromCharCode(65 + i)}</th>`;
                })}
              </tr>
            </thead>
            <tbody>
              ${this.cells.map((row, index) => {
                return html` <tr>
                  <td>${index}</td>
                  ${row.map((cell) => {
                    return html`<td>${cell}</td>`;
                  })}
                </tr>`;
              })}
            </tbody>
          </table>
        </div>
        <span>
          Click inside a cell to edit its content. Hit enter to apply.{' '}
          Click outside the cell or hit escape to abort. Here are some example
          contents: '5.5', 'Some text', '=A1', '=sum(B2:C4)', '=div(C1, 5)'.
        </span>
      </div>
    `;
  }
}
