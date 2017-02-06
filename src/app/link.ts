import { Point } from './point';

export class Link {
  private start: Point;
  private end: Point;
  constructor(startX: number, startY: number, endX: number, endY: number) {
    this.start = new Point(startX, startY);
    this.end = new Point(endX, endY);
  }

  setStart(x, y): void {
    this.start.set(x, y);
  }

  setEnd(x, y): void {
    this.end.set(x, y);
  }

  getStart(): Point {
    return this.start;
  }

  getEnd(): Point {
    return this.end;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.start.getX(), this.start.getY());
    ctx.lineTo(this.end.getX(), this.end.getY());
    ctx.stroke();
  }

  copy(): Link {
    return new Link(this.start.getX(), this.start.getY(), this.end.getX(), this.end.getY());
  }
}
