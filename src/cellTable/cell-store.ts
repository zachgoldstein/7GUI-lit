// TODO: separate displayed cell value (which is calculated) from input values
// TODO: write parser for cell input
// TODO: write logic to mark cellDependencies and update accordingly

export type CellData = {
  value: string;
  input: string;
  row: string;
  column: string;
  type?: 'formula' | 'data';
};

type CellDependency = {
  originCell: string;
  dependentCells: string[];
};

// Cribbed from 7GUI original react+mobx example code
type Op = (vals: number[]) => number;
const opTable: {[name: string]: Op} = {
  add: (vals: number[]) => vals[0] + vals[1],
  sub: (vals: number[]) => vals[0] - vals[1],
  div: (vals: number[]) => vals[0] / vals[1],
  mul: (vals: number[]) => vals[0] * vals[1],
  mod: (vals: number[]) => vals[0] % vals[1],
  sum: (vals: number[]) => vals.reduce((prev, curr) => prev + curr, 0),
  prod: (vals: number[]) => vals.reduce((prev, curr) => prev * curr, 1),
};

function getCellKey(cell: CellData): string {
  return `${cell.column}-${cell.row}`;
}

export class CellStore extends EventTarget {
  constructor() {
    super();
    this.cellData = new Map();
    this.cellDependencies = new Map();
  }

  cellData: Map<string, CellData>;
  cellDependencies: Map<string, CellDependency[]>;

  // Recursively handle changes to a cell's input data, which might be either data or a formula
  updateCell(data: CellData) {
    const cellKey = getCellKey(data);
    const previousCellData = this.cellData.get(cellKey);
    if (previousCellData) {
      if (
        previousCellData.row != data.row ||
        previousCellData.column != data.column
      ) {
        console.error(
          `Key ${cellKey} returned unexpected data for row:${previousCellData.row} and column: ${previousCellData.column}}`
        );
        return;
      }

      // if previous input was a formula, unmark those dependencies
      if (this._isFormula(previousCellData.input)) {
        this._unmarkDependency(
          cellKey,
          this._getCellsForOp(previousCellData.input)
        );
      }
    }

    // Mark this dependency if it's a new formula
    if (this._isFormula(data.input)) {
      this._markDependency(cellKey, this._getCellsForOp(data.input));
    }

    // if a formula and recognised op is present, find the required cell data
    // and calculate
    if (this._isFormula(data.input)) {
      const op = this._getOp(data.input);
      if (op) {
        const cellsForOp = this._getCellsForOp(data.input);
        const opData = cellsForOp.map((cellForOp) => {
          const cellData = this.cellData.get(cellForOp);
          if (cellData) {
            return parseFloat(cellData.value);
          }
          return 0;
        });
        data.value = op(opData).toString();
        console.log(`op value:${data.value} for cell ${cellKey}`);
      }
    } else {
      // if no formula, set it...
      data.value = data.input;
    }

    // set this cell's calculated data
    this.cellData.set(cellKey, data);
    console.log(`Set cell ${cellKey} to ${data.value}`);

    // recalculate any cells dependent on this one
    const cellsForOp = this._getDependentCells(cellKey);
    cellsForOp.forEach((cellForOp) => {
      const cellData = this.cellData.get(cellForOp);
      // Check for circular deps
      if (this._getDependentCells(cellForOp).includes(cellKey)) {
        console.error(
          `Found circular dep calculating ${cellKey} dependency ${cellForOp}`
        );
        return;
      }
      // recursively continue updating dependent cells
      if (cellData) this.updateCell(cellData);
    });

    this._dispatchCellUpdate(data);
  }

  // For each dependent cell, make a reference back to the origin cell so we
  // know what to recalculate later
  _markDependency(originCell: string, dependentCells: string[]) {
    dependentCells.forEach((dependentCell) => {
      let singleCellDependencies = this.cellDependencies.get(dependentCell);
      if (!singleCellDependencies) {
        singleCellDependencies = [];
      }
      singleCellDependencies.push({
        originCell,
        dependentCells,
      });
      this.cellDependencies.set(dependentCell, singleCellDependencies);
    });
  }

  // Go through dependent cells and remove references to this origin cell.
  _unmarkDependency(originCell: string, dependentCells: string[]) {
    dependentCells.forEach((dependentCell) => {
      let singleCellDependencies = this.cellDependencies.get(dependentCell);
      if (!singleCellDependencies) {
        return;
      }
      singleCellDependencies = singleCellDependencies.filter(
        (singleCellDependency) => {
          return singleCellDependency.originCell != originCell;
        }
      );
      this.cellDependencies.set(dependentCell, singleCellDependencies);
    });
  }

  _getDependentCells(cellKey: string): string[] {
    const singleCellDependencies = this.cellDependencies.get(cellKey);
    if (!singleCellDependencies) {
      return [];
    }
    const dependentCells: string[] = [];
    singleCellDependencies.forEach((singleCellDependency) => {
      dependentCells.push(singleCellDependency.originCell);
    });
    return dependentCells;
  }

  private _isFormula(value: string): boolean {
    if (value.includes('(') && value.includes(')')) {
      return true;
    }
    return false;
  }

  private _getOp(formula: string): Op | undefined {
    console.log(formula);
    for (const [opString, op] of Object.entries(opTable)) {
      if (formula.includes(opString)) {
        return op;
      }
    }
    return;
  }

  // Return a list of all the affected cells based on a give string, which can
  // represent either a single cell like "=B2", two cells in a formula, like
  // =add(B2, B3) or a range of cells like =sum(B1:D4)
  private _getCellsForOp(op: string): string[] {
    // Check for direct assignment to other cell
    if (!op.includes(':') && !op.includes(',')) {
      return [
        getCellKey({
          value: op,
          input: op,
          row: (op[0].toUpperCase().charCodeAt(0) - 65).toString(),
          column: op[1],
        }),
      ];
    }

    // Find the enclosing data in brackets
    const matches = op.match(/\((.*?)\)/);
    if (!matches || matches.length != 2) {
      return [];
    }
    const cellString = matches[1];

    // Return a list from a square range, in the format topLeft:bottomRight
    if (cellString.includes(':')) {
      const [topLeft, bottomRight] = cellString.split(':');
      if (!topLeft) {
        return [];
      }
      const startColumn = topLeft[0].toUpperCase().charCodeAt(0) - 65;
      const startRow = topLeft[1];
      if (!bottomRight) {
        return [
          getCellKey({
            value: op,
            input: op,
            row: startRow,
            column: startColumn.toString(),
          }),
        ];
      }
      const endColumn = bottomRight[0].toUpperCase().charCodeAt(0) - 65;
      const endRow = bottomRight[1];
      const cells: string[] = [];
      Array.from({length: endColumn - startColumn + 1}, (_, i) => {
        Array.from(
          {length: parseInt(endRow) - parseInt(startRow) + 1},
          (_, j) => {
            cells.push(
              getCellKey({
                value: op,
                input: op,
                row: (parseInt(startRow) + j).toString(),
                column: (startColumn + i).toString(),
              })
            );
          }
        );
      });
      return cells;
    } else if (cellString.includes(',')) {
      // Return a list with two elements separated by a comma
      const [first, second] = cellString.split(',');
      return [
        getCellKey({
          value: op,
          input: op,
          row: first[1],
          column: (first[0].toUpperCase().charCodeAt(0) - 65).toString(),
        }),
        getCellKey({
          value: op,
          input: op,
          row: second[1],
          column: (second[0].toUpperCase().charCodeAt(0) - 65).toString(),
        }),
      ];
    }

    return [];
  }

  private _dispatchCellUpdate(cellData: CellData) {
    return this.dispatchEvent(
      new CustomEvent('update', {detail: cellData, cancelable: true})
    );
  }
}

export const cellStore = new CellStore();
