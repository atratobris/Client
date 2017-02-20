import { Point } from './point';
import { Board } from './board/board';

export interface LinkInterface {
  to: string;
  from: string;
  logic: string;
}

export class Link {
  private start: Point;
  private end: Point;
  private startBoard: Board;
  private endBoard: Board;
  private logic: string;
  constructor(startX: number, startY: number, endX: number, endY: number, startBoard?: Board, endBoard?: Board);
  constructor(linkInterface: LinkInterface, bArray: Board[]);
  constructor(startXOrLinkInterface: any, startYOrBArray: any, endX?: number, endY?: number, startBoard?: Board, endBoard?: Board) {
    if (typeof startXOrLinkInterface === 'number') {
      const startX = startXOrLinkInterface;
      const startY = startYOrBArray;
      this.start = new Point(startX, startY);
      this.end = new Point(endX, endY);
      this.startBoard = startBoard || null;
      this.endBoard = endBoard || null;
      this.logic = 'toggle';
    } else  {
      const linkInterface: LinkInterface = startXOrLinkInterface;
      const bArray: Board[] = startYOrBArray;
      this.logic = linkInterface.logic;
      this.startBoard = bArray.filter( (board: Board) => board.getMac() === linkInterface.from)[0] || null;
      this.endBoard = bArray.filter( (board: Board) => board.getMac() === linkInterface.to)[0] || null;
      this.linkToBoard();
    }
  }

  prepare(): LinkInterface {
    return {
      to: this.endBoard.getMac(),
      from: this.startBoard.getMac(),
      logic: this.logic
    } as LinkInterface;
  }

  setStart(x: number, y: number, startBoard?: Board): void {
    this.start.set(x, y);
    if (startBoard) {
      this.startBoard = startBoard;
    }
  }

  setEnd(x: number, y: number, endBoard?: Board): void {
    this.end.set(x, y);
    if (endBoard) {
      this.endBoard = endBoard;
    }
  }

  getStart(): Point {
    return this.start;
  }

  getStartBoard(): Board {
    return this.startBoard;
  }

  getEnd(): Point {
    return this.end;
  }

  getEndBoard(): Board {
    return this.endBoard;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.start.getX(), this.start.getY());
    ctx.lineTo(this.end.getX(), this.end.getY());
    ctx.stroke();
  }

  copy(): Link {
    return new Link(this.start.getX(), this.start.getY(), this.end.getX(), this.end.getY(), this.startBoard, this.endBoard);
  }

  exportFinished(): Link {
    const finishedLink = this.copy();
    finishedLink.linkToBoard();
    return finishedLink;
  }

  linkToBoard(): void {
    this.start = this.startBoard.getCentre();
    this.end = this.endBoard.getCentre();
  }
}
