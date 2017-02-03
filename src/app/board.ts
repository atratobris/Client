import { Point } from './point';

export class Board {
  private center: Point;
  private width: number;
  private height: number;
  private offset: Point;

  constructor(posX: number, posY: number, width: number, height: number) {
    this.center = new Point(posX, posY);
    this.width = width;
    this.height = height;
    this.offset = new Point( 0, 0);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(this.getPosX() - this.width / 2, this.getPosY() - this.height / 2, this.width, this.height);
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getPosX(): number {
    return this.center.getX();
  }

  getPosY(): number {
    return this.center.getY();
  }

  collides(board: Board): boolean {
    if ( this.getPosX() + this.getWidth() / 2 < board.getPosX() - board.getWidth() / 2 ||
      this.getPosX() - this.getWidth() / 2  > board.getPosX() + board.getWidth() / 2 ||
      this.getPosY() + this.getHeight() / 2 < board.getPosY() - board.getHeight() / 2 ||
      this.getPosY() - this.getHeight() / 2 > board.getPosY() + board.getHeight() / 2) {
      return false;
    } else {
      return true;
    }
  }

  containsPoint(x: number, y: number): boolean {
    if ( this.getPosX() - this.getWidth() / 2 <= x &&
      this.getPosX() + this.getWidth() / 2 >= x &&
      this.getPosY() - this.getHeight() / 2 <= y &&
      this.getPosY() + this.getHeight() / 2 >= y ) {
      return true;
    } else {
      return false;
    }
  }

  set(x: number, y: number): void {
    this.center.set(x - this.getOffsetX(), y - this.getOffsetY());
  }

  setOffset(offsetX: number, offsetY: number): void {
    this.offset = new Point(offsetX, offsetY);
  }

  getOffsetX(): number {
    return this.offset.getX();
  }

  getOffsetY(): number {
    return this.offset.getY();
  }

  copy(): Board {
    return new Board(this.getPosX(), this.getPosY(), this.getWidth(), this.getHeight());
  }

}
