import { Point, PointInterface } from '../point';
import { BoardConfig } from '../board-config';
import { ImageService } from '../image.service';

export interface BoardInterface {
  centre: PointInterface;
  width: number;
  height: number;
  mac: string;
  boardConfig: BoardConfig;
}

const DEFAULT_WIDTH = 160;
const DEFAULT_HEIGHT = 80;

export class Board {
  private centre: Point;
  private width = DEFAULT_WIDTH;
  private height = DEFAULT_HEIGHT;
  private offset: Point;
  private boardConfig: BoardConfig;
  private path: Path2D;
  private animationInterval: any;

  private image: HTMLImageElement;

  constructor(posX: number, posY: number, width: number, height: number, b_config?: BoardConfig);
  constructor(centre: BoardInterface);
  constructor(posXorBoardInterface: any, posY?: number, width?: number, height?: number, b_config?: BoardConfig) {
    // debugger
    this.boardConfig = b_config || new BoardConfig();
    this.offset = new Point(0, 0);

    if ( typeof posXorBoardInterface === 'number') {
      this.centre = new Point(posXorBoardInterface, posY);
    } else if ( typeof posXorBoardInterface === 'object') {
      this.centre = new Point(posXorBoardInterface.centre);
      this.boardConfig = new BoardConfig(posXorBoardInterface.boardConfig);
    }
    this.path = new Path2D();

    if (!ImageService.getInstance().hasImage(this.boardConfig.getType())) {
      ImageService.getInstance().setImage(this.boardConfig.getType(), this.boardConfig.getImageUrl());
    }
    this.image = ImageService.getInstance().getImage(this.boardConfig.getType());

  }

  prepare(): BoardInterface {
    return {
      centre: this.centre.prepare(),
      width: this.width,
      height: this.height,
      mac: this.getMac(),
      boardConfig: this.getBoardConfig()
    } as BoardInterface;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const oldColour = ctx.fillStyle;
    ctx.fillStyle = this.boardConfig.getColour();

    ctx.fill(this.drawRectangle());
    this.drawImage(ctx);
    this.drawText(ctx);

    ctx.fillStyle = oldColour;
  }


  private drawImage(ctx: CanvasRenderingContext2D): void {
    // image.width = 200;
    // image.height = 100;

    const translateX: number = this.getPosX() - this.width / 2;
    const translateY: number = this.getPosY() - this.height / 2;

    ctx.save();

    ctx.translate(translateX, translateY);

    ctx.drawImage(this.image, 0, 0, this.width, this.height);

    ctx.translate(-translateX, -translateY);

    ctx.restore();

  }
  private drawRectangle(): Path2D {
    this.path = new Path2D();
    this.path.rect(this.getPosX() - this.width / 2, this.getPosY() - this.height / 2, this.width, this.height);
    return this.path;
  }

  private drawText(ctx: CanvasRenderingContext2D): void {
    const textHeight = 30;
    const leftPadding = 10;
    ctx.fillStyle = 'black';
    ctx.font = `${textHeight}px serif`;
    ctx.fillText(this.boardConfig.getName(), this.getPosX() - this.width / 2, this.getPosY() - this.height / 2 - 10);
  }

  setStatus(status: string): void {
    this.boardConfig.setStatus(status);
  }

  getSubType(): string {
    return this.getBoardConfig().getSubType();
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

  shake(): void {

    const cancelTheInterval = () => {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
      this.width = DEFAULT_WIDTH;
      this.height = DEFAULT_HEIGHT;
    }

    if (!!this.animationInterval) {
      cancelTheInterval();
    }

    this.animationInterval = setInterval( () => {
      this.width += 5;
      this.height += 5;
      if (this.width > DEFAULT_WIDTH * 1.5 || this.height > DEFAULT_HEIGHT * 2) {
        cancelTheInterval()
      }
    }, 10);
  }


  getName(): string {
    return this.getBoardConfig().getName();
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

  getPath(): Path2D {
    return this.path;
  }

  containsPoint(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
    return ctx.isPointInPath(this.path, x, y);
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

  setBoardConfig(conf: BoardConfig): void {
    this.boardConfig = conf;
  }

  setMetadata(metadata: any): any {
    this.boardConfig.setMetadata(metadata);
  }


  copy(): Board {
    return new Board(this.getPosX(), this.getPosY(), this.getWidth(), this.getHeight(), this.getBoardConfig());
  }

  getMac(): string {
    return this.boardConfig.getMac();
  }


  getType(): string {
    return this.boardConfig.getType();
  }

}
