import {ReactiveController, ReactiveControllerHost} from 'lit';

type CircleOperation = {
  action: 'add' | 'change';
  circleData?: CircleData;
};

export type CircleData = {
  diameter: number;
  id: string;
  x: number;
  y: number;
};

function _getUID() {
  return `${Date.now().toString()}-${Math.floor(Math.random() * 1000000)}`;
}

export class CirclesController implements ReactiveController {
  host: ReactiveControllerHost;

  private circleOperations: CircleOperation[];
  private currentPosition = 0;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);

    this.circleOperations = [];
  }

  addCircle(diameter: number, x: number, y: number) {
    this.circleOperations.splice(this.currentPosition, 0, {
      action: 'add',
      circleData: {diameter, id: _getUID(), x: x, y: y},
    });
    this.currentPosition++;
    this.host.requestUpdate();
  }

  changeCircle(diameter: number, id: string, x: number, y: number) {
    this.circleOperations.splice(this.currentPosition, 0, {
      action: 'change',
      circleData: {diameter, id, x, y},
    });
    this.currentPosition++;
    this.host.requestUpdate();
  }

  undo() {
    if (this.currentPosition == 0) {
      return;
    }
    this.currentPosition--;
    this.host.requestUpdate();
  }

  redo() {
    if (this.currentPosition == this.circleOperations.length) {
      return;
    }
    this.currentPosition++;
    this.host.requestUpdate();
  }

  get currentCircles(): Map<string, CircleData> {
    const activeCircles = new Map<string, CircleData>();
    this.circleOperations.forEach((circleOp, i) => {
      if (i >= this.currentPosition) {
        return;
      }
      if (circleOp.action == 'add') {
        if (!circleOp.circleData) {
          console.error(`Added circle with no data at ${i}`);
          return;
        }
        activeCircles.set(circleOp.circleData.id, circleOp.circleData);
      }
      if (i == 0) {
        return;
      }
      if (circleOp.action == 'change') {
        if (!circleOp.circleData) {
          console.error(`Changed circle with no data at ${i}`);
          return;
        }
        activeCircles.set(circleOp.circleData.id, circleOp.circleData);
      }
    });
    return activeCircles;
  }

  hostConnected() {
    this.host.requestUpdate();
  }

  hostDisconnected() {
    this.host.requestUpdate();
  }
}
