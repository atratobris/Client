import { BoardInterface, Board } from '../board/board';
import { LinkInterface } from '../link/link';
import { BoardConfig } from '../board-config';

export interface SketchInterface {
  id: number;
  status: string;
  name: string;
  description: string;
  listed: boolean;
  user: string;
  user_id: number;
  boards: BoardInterface[];
  links: LinkInterface[];
}

export class Sketch {
  private id: number;
  private status: string;
  private name: string;
  private boards: Board[];
  private links: LinkInterface[];
  private saved: boolean;
  listed: boolean;
  description: string;
  user: string;
  user_id: number;
  newPurchase: boolean;

  constructor(sketch: SketchInterface) {
    this.id = sketch.id;
    this.boards =  Array.from( sketch.boards, ( b: BoardInterface) => {
      return new Board(b);
    });
    this.links = sketch.links;
    this.status = sketch.status;
    this.name = sketch.name;
    this.saved = true;
    this.description = sketch.description;
    this.listed = sketch.listed;
    this.user = sketch.user;
    this.user_id = sketch.user_id;
    this.newPurchase = false;
  }

  getBoards(): Board[] {
    return this.boards;
  }

  getLinks(): LinkInterface[] {
    return this.links;
  }

  setBoards(boards: Board[]): void {
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

  isSaved(): boolean {
    return this.saved;
  }

  changed(): void {
    this.saved = false;
  }

  saveChanges(): void {
    this.saved = true;
  }

  getBoardConfigs(): BoardConfig[] {
    return this.boards.map( (board) => board.getBoardConfig() );
  }

  getUserId(): number {
    return this.user_id;
  }
}
