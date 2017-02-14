import { BoardInterface } from '../board/board';
import { LinkInterface } from '../link';

interface SketchInterface {
  id: number;
  boards: BoardInterface[];
  links: LinkInterface[];
}

export class Sketch {
  private id: number;
  private boards: BoardInterface[];
  private links: LinkInterface[];

  constructor(sketch: SketchInterface) {
    this.id = sketch.id;
    this.boards = sketch.boards;
    this.links = sketch.links;
  }

  getBoards(): BoardInterface[] {
    return this.boards;
  }

  getLinks(): LinkInterface[] {
    return this.links;
  }

  getId(): number {
    return this.id;
  }
}
