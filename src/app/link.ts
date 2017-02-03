import { Point } from '/point';

export class Link {
  private start: Point;
  private end: Point;
  constructor(startX: number, startY: number, endX: number, endY: number) {
    this.start = new Point(startX, startY);
    this.end = new Point(endX, endY);
  }
}
