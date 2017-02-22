import { BoardInterface } from '../board/board';
import { LinkInterface } from '../link';

export interface SketchInterface {
  id: number;
  status: string;
  boards: BoardInterface[];
  links: LinkInterface[];
}

export class Sketch {
  private id: number;
  private status: string;
  private boards: BoardInterface[];
  private links: LinkInterface[];

  constructor(sketch: SketchInterface) {
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

  changeStatus(status: string){
    this.status  = status;
  }
}
