import { Point } from './point';
import { Board } from './board';

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
  constructor(startX: number, startY: number, endX: number, endY: number, startBoard?: Board, endBoard?: Board);
  constructor(LinkInterface: LinkInterface);
  constructor(startXOrLinkInterface: any, startY?: number, endX?: number, endY?: number, startBoard?: Board, endBoard?: Board) {
    if (typeof startXOrLinkInterface === 'number') {
      const startX = startXOrLinkInterface;
      this.start = new Point(startX, startY);
      this.end = new Point(endX, endY);
      this.startBoard = startBoard || null;
      this.endBoard = endBoard || null;
    }
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
    console.log(this.endBoard);
    this.start = this.startBoard.getCentre();
    this.end = this.endBoard.getCentre();
  }
}
