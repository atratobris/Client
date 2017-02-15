import { BoardInterface } from '../board/board';
import { LinkInterface } from '../link';

export interface SketchInterface {
  id: number;
  status: SketchStatus;
  boards: BoardInterface[];
  links: LinkInterface[];
}

export enum SketchStatus {
    pending = 0,
    active = 1,
    closed = 2
}

export class Sketch {
  private id: number;
  private status: SketchStatus;
  private boards: BoardInterface[];
  private links: LinkInterface[];

  constructor(sketch: SketchInterface) {
    // debugger
    this.id = sketch.id;
    this.boards = sketch.boards;
    this.links = sketch.links;
    this.status = sketch.status;
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

  changeStatus(status: SketchStatus){
    this.status  = status;
  }
}
