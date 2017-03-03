import { BoardInterface } from '../board/board';
import { LinkInterface } from '../link/link';

export interface SketchInterface {
  id: number;
  status: string;
  name: string;
  description: string;
  boards: BoardInterface[];
  links: LinkInterface[];
}

export class Sketch {
  private id: number;
  private status: string;
  private name: string;
  private boards: BoardInterface[];
  private links: LinkInterface[];
  description: string;

  constructor(sketch: SketchInterface) {
    this.id = sketch.id;
    this.boards = sketch.boards;
    this.links = sketch.links;
    this.status = sketch.status;
    this.name = sketch.name;
    this.description = sketch.description;
  }

  getBoards(): BoardInterface[] {
    return this.boards;
  }

  getLinks(): LinkInterface[] {
    return this.links;
  }

  setBoards(boards: BoardInterface[]): void {
    this.boards = boards;
  }

  setLinks(links: LinkInterface[]): void {
    this.links = links;
  }

  getId(): number {
    return this.id;
  }

  getStatus(): string {
    return this.status;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  changeStatus(status: string) {
    this.status  = status;
  }
}
