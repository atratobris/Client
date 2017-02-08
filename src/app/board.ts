import { Point, PointInterface } from './point';
import { BoardConfig } from './board-config';

export class BoardInterface {
  centre: PointInterface;
  width: number;
  height: number;
  mac: string;
}

export class Board {
  private centre: Point;
  private width: number;
  private height: number;
  private offset: Point;
  private boardConfig: BoardConfig;

  constructor(posX: number, posY: number, width: number, height: number, b_config?: BoardConfig);
  constructor(centre: BoardInterface);
  constructor(posXorBoardInterface: any, posY?: number, width?: number, height?: number, b_config?: BoardConfig) {
    this.boardConfig = b_config || new BoardConfig();
    this.offset = new Point( 0, 0);
    if ( typeof posXorBoardInterface === 'number') {
      this.centre = new Point(posXorBoardInterface, posY);
      this.width = width;
      this.height = height;
    } else if ( typeof posXorBoardInterface === 'object') {
      this.centre = new Point(posXorBoardInterface.centre);
      this.width = posXorBoardInterface.width;
      this.height = posXorBoardInterface.height;
      this.boardConfig.setMac(posXorBoardInterface.mac);
    }
  }

  prepare(): BoardInterface {
    return {
      centre: this.centre.prepare(),
      width: this.width,
      height: this.height,
      mac: this.getMac()
    } as BoardInterface;
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
    return this.centre.getX();
  }

  getPosY(): number {
    return this.centre.getY();
  }

  getCentre(): Point {
    return this.centre;
  }

  setCentre(p: Point): void {
    this.centre = p;
  }

  deepSetCentre(p: Point): void {
    this.centre.set(p.getX(), p.getY());
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
    this.centre.set(x - this.getOffsetX(), y - this.getOffsetY());
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

  getBoardConfig(): BoardConfig {
    return this.boardConfig;
  }

  copy(): Board {
    return new Board(this.getPosX(), this.getPosY(), this.getWidth(), this.getHeight(), this.getBoardConfig());
  }

  getMac(): string {
    return this.boardConfig.getMac();
  }

}
