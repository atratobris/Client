import { Board } from './board';
import { Point } from './point';

export class WorkspaceCanvas {
  private ctx: CanvasRenderingContext2D;
  private rect: ClientRect;
  private boards: Board[];
  private cursor: Board;
  private savedBoard: Board;
  private selectedBoard: Board;


  constructor(ctx: CanvasRenderingContext2D, rect: ClientRect) {
    this.ctx = ctx;
    this.rect = rect;
    this.boards = [];
    this.cursor = null;
  }

  drawAtPoint( x, y ): boolean {
    // this.ctx.clearRect(0, 0, 500, 500);
    const new_board: Board = this.cursor.copy();
    console.log( x, y, new_board.getPosX(), new_board.getPosY());
    for (const board of this.boards) {
      if (board.collides(new_board)) {
        console.log('Colliding');
        return false;
      }
    }
    // new_board.draw(this.ctx);
    new_board.setOffset(0, 0);
    this.boards.push(new_board);
    return true;
  }

  deleteAtPoint(x , y): void {
    const clickedBoard: Board = this.findAtPoint(x, y);
    if ( clickedBoard ) {
      const index: number = this.boards.indexOf(clickedBoard);
      this.boards.splice(index, 1);
    } else {
      console.log('Nothing to delete');
    }
  }

  redrawCanvas(): void {
    this.ctx.clearRect(0, 0, 500, 500);
    for (const board of this.boards) {
      board.draw(this.ctx);
    }
    if ( this.cursor ) {
      this.ctx.fillStyle = 'green';
      for ( const board of this.boards) {
        if (board.collides(this.cursor)) {
          this.ctx.fillStyle = 'red';
          break;
        }
      }
      this.cursor.draw(this.ctx);
      this.ctx.fillStyle = 'black';
    }
    if ( this.selectedBoard ) {
      this.ctx.fillStyle = 'yellow';
      this.selectedBoard.draw(this.ctx);
      this.ctx.fillStyle = 'black';
    }
  }

  updateCursorLocation(x: number, y: number): void {
    if (this.cursor) {
      this.cursor.set(x, y);
    } else {
      this.cursor = new Board(x, y, 40, 40);
    }
  }

  draw(): void {
    this.redrawCanvas();

    requestAnimationFrame(() => this.draw());
  }

  dragStart(x: number, y: number): boolean {
    const selectedBoard: Board = this.findAtPoint(x, y);
    if ( selectedBoard ) {
      const index: number = this.boards.indexOf(selectedBoard);
      this.boards.splice(index, 1);
      this.savedBoard = selectedBoard.copy();
      this.cursor = selectedBoard.copy();
      console.log(x - selectedBoard.getPosX(), y - selectedBoard.getPosY());
      this.cursor.setOffset(x - selectedBoard.getPosX(), y - selectedBoard.getPosY());
      return true;
    } else {
      this.cursor = null;
      this.savedBoard = null;
      return false;
    }
  }

  dragEnd(x: number, y: number): void {
    if (!this.drawAtPoint(x, y)) {
      this.boards.push(this.savedBoard);
    }
    console.log(x - this.cursor.getPosX(), this.cursor.getOffsetX());
    this.savedBoard = null;
    this.cursor = null;
  }

  findAtPoint(x: number, y: number): Board {
    let clickedBoard: Board = null;
    for (const board of this.boards) {
      if ( board.containsPoint(x, y)) {
        clickedBoard = board;
        break; // Never more than one board at one point
      }
    }
    return clickedBoard;
  }

  select(x: number, y: number): boolean {
    this.selectedBoard = this.findAtPoint(x, y);
    return ( this.selectedBoard ) ? true : false;
  }

  removeSelected(): void {
    const index: number = this.boards.indexOf(this.selectedBoard);
    this.boards.splice(index, 1);
    this.selectedBoard = null;
  }

}
