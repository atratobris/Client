import { BoardInterface } from '../board';
import { LinkInterface } from '../link';

interface SketchInterface {
  id: number;
  boards: BoardInterface[];
}

export class Sketch {
  private id: number;
  boards: BoardInterface[];

  constructor(sketch: SketchInterface) {
    this.id = sketch.id;
    this.boards = sketch.boards;
  }
}
