import { Point } from '../point';
import { Board } from '../board/board';

export interface LinkOptionInterface {
  name: string;
  description: string;
}

export class LinkOption {
  private name: string;
  private description: string;

  constructor(linkOptionInterface: any) {
    this.name = linkOptionInterface.name;
    this.description = linkOptionInterface.description;
  }
}

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
  private midpoint: Point;
  private logic: string;
  private path: Path2D;
  private distanceTreshold = 10;
  private shouldRenderText = false;


  constructor(startX: number, startY: number, endX: number, endY: number, startBoard?: Board, endBoard?: Board);
  constructor(linkInterface: LinkInterface, bArray: Board[]);
  constructor(startXOrLinkInterface: any, startYOrBArray: any, endX?: number, endY?: number, startBoard?: Board, endBoard?: Board) {
    this.path = new Path2D();

    if (typeof startXOrLinkInterface === 'number') {
      const startX = startXOrLinkInterface;
      const startY = startYOrBArray;
      this.start = new Point(startX, startY);
      this.end = new Point(endX, endY);
      this.midpoint = new Point((startX + endX) / 2, (startY + endY) / 2);
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

  computeSlope(): number {
    return (this.end.getY() - this.start.getY()) / ( this.end.getX() - this.start.getX());
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
    this.shouldRenderText = false;
    if (startBoard) {
      this.startBoard = startBoard;
    }
  }

  setEnd(x: number, y: number, endBoard?: Board): void {
    this.end.set(x, y);
    if (endBoard) {
      this.shouldRenderText = true;
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
    // ctx.rotate( Math.PI / 2);

    let angle: number = this.calculateAngle();
    this.drawArrowHead(ctx, angle);
    ctx.stroke(this.path);
    if (this.shouldRenderText) {
      this.updateMidpoint();
      ctx.save();
      ctx.translate(this.midpoint.getX(), this.midpoint.getY());
      // angle = angle % ( Math.PI / 2);
      angle = Math.atan(Math.tan(angle)); // Use angle of slope instead
      ctx.rotate(angle);
      ctx.fillText(this.logic, -5, -5);
      ctx.translate(-this.midpoint.getX(), -this.midpoint.getY());
      ctx.restore();
    }
  }

  updateMidpoint(): void {
    this.midpoint.set( (this.start.getX() + this.end.getX()) / 2, (this.start.getY() + this.end.getY()) / 2);
  }

  calculateAngle(): number {
    const slope = this.computeSlope();
    let x_sign = Math.sign(this.end.getX() - this.start.getX());
    x_sign = ( x_sign === 0 ) ? 1 : x_sign;
    let y_sign = Math.sign(this.end.getY() - this.start.getY());
    y_sign = (y_sign === 0 ) ? 1 : y_sign;
    let quadrant = 1;
    if (y_sign === -1) {
      if (x_sign === -1) {
        quadrant = 3;
      } else {
        quadrant = 4;
      }
    } else {
      if (x_sign === -1) {
        quadrant = 2;
      }
    }
    let angle: number = Math.atan(slope);
    switch (quadrant) {
      case 1:
        break;
      case 2:
        angle = Math.PI + angle;
        break;
      case 3:
        angle = Math.PI + angle;
        break;
      case 4:
        angle = 2 * Math.PI + angle;
        break;
    }

    return angle;
  }
  drawArrowHead(ctx: CanvasRenderingContext2D, angle: number): void {
    ctx.save();
    const path: Path2D = new Path2D();
    const head_x = this.end.getX();
    const head_y = this.end.getY();
    const width = 5;
    path.moveTo(head_x, head_y);
    path.lineTo(head_x - width , head_y + width);
    path.lineTo(head_x - width, head_y - width);
    ctx.translate(head_x, head_y); // translate to rectangle center
    ctx.rotate(angle);
    ctx.translate(-head_x, -head_y); // translate back
    ctx.fillStyle = '#000';
    ctx.fill(path);
    ctx.restore();
  }

  closeTo(point: Point, ctx: CanvasRenderingContext2D): boolean {
    // line equation: y = ax + b

    // slope is a
    const slope = this.computeSlope();

    // compute b
    const b = this.start.getY() - slope * this.start.getX();

    // compute if checking point can be transposed onto the link
    let tx = point.getX() + slope * point.getY() - slope * b;
    tx = tx / (Math.pow(slope, 2) + 1);

    let ty = slope * (point.getX() + slope * point.getY() - slope * b);
    ty = b + ty / ( Math.pow(slope, 2) + 1);

    // if( (tx <= this.start.getX() && tx>= this.end.getX()) || (tx >= this.start.getX() && tx <= this.end.getX()))
    //   console.log("x within range")

    const distance = Math.sqrt(Math.pow(tx - point.getX(), 2) + Math.pow(ty - point.getY(), 2) );
    // console.log(distance);

    if ( distance < this.distanceTreshold ) {
      return true;
    }
    return false;

  }

  copy(): Link {
    return new Link(this.start.getX(), this.start.getY(), this.end.getX(), this.end.getY(), this.startBoard, this.endBoard);
  }

  exportFinished(): Link {
    const finishedLink = this.copy();
    finishedLink.linkToBoard();
    finishedLink.showWithLogic();
    return finishedLink;
  }

  showWithLogic(): void {
    this.shouldRenderText = true;
  }
  linkToBoard(): void {
    this.start = this.startBoard.getCentre();
    this.end = this.endBoard.getCentre();
  }
}
