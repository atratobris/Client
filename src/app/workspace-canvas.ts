import { Board, BoardInterface } from './board/board';
import { Point } from './point';
import { Link, LinkInterface } from './link/link';
import { BoardConfig } from './board-config';

import { Sketch } from './sketch/sketch';

export class WorkspaceCanvas {
  private ctx: CanvasRenderingContext2D;
  private rect: ClientRect;
  private boards: Board[];
  private links: Link[];
  private sketch: Sketch;
  private cursor: Board;
  private savedBoard: Board;

  private selectedBoard: Board;
  private selectedLink: Link;

  private currentLink: Link;
  private width: number;
  private height: number;
  private completePath: Path2D;


  constructor(ctx: CanvasRenderingContext2D, rect: ClientRect, width: number, height: number) {
    this.ctx = ctx;
    this.rect = rect;
    this.boards = [];
    this.links = [];
    this.currentLink = null;
    this.cursor = null;
    this.width = width;
    this.height = height;
  }

  drawBoardAt(selectedPoint: Point, b: BoardConfig):boolean {
    this.cursor.setBoardConfig(b);
    return this.drawAtPoint(selectedPoint.getX(), selectedPoint.getY());
  }

  drawAtPoint( x, y): boolean {
    // this.ctx.clearRect(0, 0, 500, 500);
    const new_board: Board = this.cursor.copy();
    new_board.setCentre(this.cursor.getCentre());
    for (const board of this.boards) {
      if (board.collides(new_board)) {
        console.log('Colliding');
        return false;
      }
    }
    delete this.cursor;
    // new_board.draw(this.ctx);
    new_board.setOffset(0, 0);
    this.boards.push(new_board);
    return true;
  }

  checkPoint(selectedPoint: Point): boolean{
    if( this.findBoardAt(selectedPoint.getX(), selectedPoint.getY()) )
      return true;
    if( this.checkIfNearLink(selectedPoint))
      return true;
    return false;
  }

  removeBoardLinks(board: Board): void {
    for(let idx in this.links){
      let link = this.links[parseInt(idx)];
      if( link.getEndBoard() === board || link.getStartBoard())
        this.links.splice(parseInt(idx), 1 );
    }
  }

  deleteAtPoint(selectedPoint: Point): BoardConfig {
    const clickedBoard: Board = this.findBoardAt(selectedPoint.getX(), selectedPoint.getY());
    if ( clickedBoard ) {
      const index: number = this.boards.indexOf(clickedBoard);
      this.boards.splice(index, 1);
      this.removeBoardLinks(clickedBoard);
      return clickedBoard.getBoardConfig();
    } else {
      console.log('Nothing to delete');
      return null;
    }
  }

  redrawCanvas(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const board of this.boards) {
      board.draw(this.ctx);
    }
    for (const link of this.links) {
      link.draw(this.ctx);
    }
    if ( this.currentLink ) {
      this.currentLink.draw(this.ctx);
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

  resetCursorLocation(): void {
    if (this.savedBoard) {
      this.cursor.deepSetCentre(this.savedBoard.getCentre());
      this.savedBoard.setCentre(this.cursor.getCentre());
      this.boards.push(this.savedBoard);
      this.savedBoard = null;
      console.log(this.links);
    }
    this.cursor = null;
    this.currentLink = null;
  }

  draw(): void {
    this.redrawCanvas();
    requestAnimationFrame(() => this.draw());
  }

  updateLinking(x: number, y: number): void {
    this.currentLink.setEnd(x, y);
  }

  linkStart(x: number, y: number): boolean {
    const selectedBoard: Board =  this.findBoardAt(x, y);
    if (selectedBoard) {
      this.currentLink = new Link(selectedBoard.getPosX(), selectedBoard.getPosY(), x, y, selectedBoard);
      return true;
    } else {
      return false;
    }
  }

  linkEnd(x: number, y: number): void {
    const selectedBoard: Board =  this.findBoardAt(x, y);
    if (selectedBoard) {
      this.currentLink.setEnd(selectedBoard.getPosX(), selectedBoard.getPosY(), selectedBoard);
      this.links.push(this.currentLink.exportFinished());
    }
    this.currentLink = null;
  }

  dragStart(x: number, y: number): boolean {
    const selectedBoard: Board = this.findBoardAt(x, y);
    if ( selectedBoard ) {
      const index: number = this.boards.indexOf(selectedBoard);
      this.boards.splice(index, 1);
      this.savedBoard = selectedBoard.copy();
      this.cursor = selectedBoard;
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
      this.cursor.setCentre(this.savedBoard.getCentre());
      this.boards.push(this.savedBoard);
    }
    this.savedBoard = null;
    this.cursor = null;
  }

  findBoardAt(x: number, y: number): Board {
    let clickedBoard: Board = null;
    for (const board of this.boards) {
      if (board.containsPoint(this.ctx, x, y)) {
        clickedBoard = board;
        break; // Never more than one board at one point
      }
    }
    return clickedBoard;
  }



  checkIfNearLink(point: Point): Link {
    let selectedLink: Link = null;
    for (const link of this.links){
      if (link.closeTo(point, this.ctx)){
        selectedLink = link;
        break;
      }
    }
    return selectedLink;
  }

  selectBoard(x: number, y: number): boolean {
    this.selectedBoard = this.findBoardAt(x, y);
    return ( this.selectedBoard ) ? true : false;
  }

  selectLink(point: Point): boolean {
    this.selectedLink = this.checkIfNearLink(point);
    return ( this.selectedLink ) ? true : false;
  }

  deselectLink(): void {
    delete this.selectedLink;
  }

  deselectBoard(): void {
    delete this.selectedBoard;
  }

  getSelectedBoard(): BoardConfig {
    return this.selectedBoard.getBoardConfig();
  }

  getSelectedLink(): Link {
    return this.selectedLink;
  }

  loadSketch(sketch: Sketch): void {
    this.sketch = sketch;
    this.boards = this.sketch.getBoards().map((boardIf: BoardInterface) => new Board(boardIf));
    this.links = this.sketch.getLinks().map((linkIf: LinkInterface) => new Link(linkIf, this.boards));
  }

  buildSketch(): Sketch {
    // const boardsInterface: BoardInterface[] = this.boards.map( (board: Board) => board.prepare());
    // const boardsInterface: Board[] = this.boards
    const linksInterface: LinkInterface[] = this.links.map( ( link: Link) => link.prepare());
    this.sketch.setBoards(this.boards.map( (board: Board) => board.prepare()));
    this.sketch.setLinks(this.links.map( ( link: Link) => link.prepare()));
    // return new Sketch({
    //   id: this.sketch.getId(),
    //   boards: boardsInterface,
    //   links: linksInterface,
    //   status: "pending"
    // });
    return this.sketch;
  }

}
