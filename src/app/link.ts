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
  private slope: number;
  private path: Path2D;
  private distanceTreshold = 10;


  constructor(startX: number, startY: number, endX: number, endY: number, startBoard?: Board, endBoard?: Board);
  constructor(linkInterface: LinkInterface, bArray: Board[]);
  constructor(startXOrLinkInterface: any, startYOrBArray: any, endX?: number, endY?: number, startBoard?: Board, endBoard?: Board) {
    this.path = new Path2D();

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
    this.computeSlope();

  }

  computeSlope(){
    this.slope = (this.end.getY() - this.start.getY())/(this.end.getX() - this.start.getX());
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

    this.path = new Path2D();
    this.path.moveTo(this.start.getX(), this.start.getY());
    this.path.lineTo(this.end.getX(), this.end.getY());
    ctx.stroke(this.path);
  }

  closeTo(point: Point, ctx: CanvasRenderingContext2D): boolean{
    // line equation: y = ax + b

    // slope is a
    this.computeSlope();

    // compute b
    let b = this.start.getY() - this.slope*this.start.getX();

    // compute if checking point can be transposed onto the link
    let tx = point.getX() + this.slope * point.getY() - this.slope * b
    tx = tx/(Math.pow(this.slope, 2)+1)

    let ty = this.slope * (point.getX() + this.slope * point.getY() - this.slope * b)
    ty = b + ty/(Math.pow(this.slope, 2)+1)

    // if( (tx <= this.start.getX() && tx>= this.end.getX()) || (tx >= this.start.getX() && tx <= this.end.getX()))
    //   console.log("x within range")

    let distance = Math.sqrt(Math.pow(tx-point.getX(), 2) + Math.pow(ty-point.getY(), 2) )
    // console.log(distance);

    if ( distance < this.distanceTreshold )
      return true;
    return false;

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
