import { Board, BoardInterface } from './board/board';
import { Point } from './point';
import { Link, LinkInterface } from './link/link';
import { BoardConfig } from './board-config';
import { EventEmitter } from '@angular/core';

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
  private sketchEmitter: EventEmitter<any>;


  constructor(ctx: CanvasRenderingContext2D, rect: ClientRect, width: number, height: number, sketchEmitter: EventEmitter<any>) {
    this.ctx = ctx;
    this.rect = rect;
    this.boards = [];
    this.links = [];
    this.currentLink = null;
    this.cursor = null;
    this.width = width;
    this.height = height;
    this.sketchEmitter = sketchEmitter;
  }

  drawBoardAt(selectedPoint: Point, b: BoardConfig): boolean {
    this.cursor.setBoardConfig(b);
    return this.drawAtPoint(selectedPoint.getX(), selectedPoint.getY());
  }

  drawAtPoint( x, y): boolean {
    const new_board: Board = this.cursor.copy();
    new_board.setCentre(this.cursor.getCentre());
    for (const board of this.boards) {
      if (board.collides(new_board)) {
        return false;
      }
    }
    delete this.cursor;
    new_board.setOffset(0, 0);
    this.addBoard(new_board);
    return true;
  }

  checkPoint(selectedPoint: Point): boolean {
    return !!(
      this.findBoardAt(selectedPoint.getX(), selectedPoint.getY()) ||
      this.checkIfNearLink(selectedPoint)
    );
  }

  removeBoardLinks(board: Board): void {
    for (let idx = this.links.length - 1; idx >= 0; idx--) {
      const link = this.links[idx];
      if ( link.getEndBoard().getBoardConfig() === board.getBoardConfig() ||
          link.getStartBoard().getBoardConfig() === board.getBoardConfig()) {
        this.links.splice(idx, 1);
      }
    }
  }

  removeLinkNextToPoint(selectedPoint: Point): void {
    const deletedLink = this.checkIfNearLink(selectedPoint);
    this.links.splice(this.links.indexOf(deletedLink), 1);
  }

  removeBoard(board: Board): void {
    const index: number = this.boards.indexOf(board);
    this.boards.splice(index, 1);
    this.sketch.changed();
    this.sketchEmitter.emit();
  }

  addBoard(board: Board): void {
    this.boards.push(board);
    this.sketch.changed();
    this.sketchEmitter.emit();
  }

  deleteAtPoint(selectedPoint: Point): BoardConfig {
    const clickedBoard: Board = this.findBoardAt(selectedPoint.getX(), selectedPoint.getY());
    if ( clickedBoard ) {
      this.removeBoard(clickedBoard);
      this.removeBoardLinks(clickedBoard);
      return clickedBoard.getBoardConfig();
    } else {
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
    }
  }

  resetCursorLocation(): void {
    if (this.savedBoard) {
      this.cursor.deepSetCentre(this.savedBoard.getCentre());
      this.savedBoard.setCentre(this.cursor.getCentre());
      this.addBoard(this.savedBoard);
      this.savedBoard = null;
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

  linkEnd(x: number, y: number): boolean {
    const selectedBoard: Board =  this.findBoardAt(x, y);
    if (selectedBoard && this.currentLink.getStartBoard() !== selectedBoard) {
      const acceptedLinks = selectedBoard.getBoardConfig().getAcceptedLinks();
      if (acceptedLinks.length !== 0) {
        this.currentLink.setEnd(selectedBoard.getPosX(), selectedBoard.getPosY(), selectedBoard);
        this.currentLink.setLogic(acceptedLinks[0].getName());
        this.links.push(this.currentLink.exportFinished());
        this.sketch.changed();
        this.sketchEmitter.emit();
        [this.selectedLink] = this.links.slice(-1);
        this.currentLink = null;
        return true;
      }
    }
    this.currentLink = null;
    return false;
  }

  dragStart(x: number, y: number): boolean {
    const selectedBoard: Board = this.findBoardAt(x, y);
    if ( selectedBoard ) {
      this.removeBoard(selectedBoard);
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
      this.resetCursorLocation();
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
    for (const link of this.links) {
      if (link.closeTo(point, this.ctx)) {
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

  setCursor(board: Board) {
    this.cursor = board;
  }

  loadSketch(sketch: Sketch): void {
    this.sketch = sketch;
    this.boards = this.sketch.getBoards();
    this.links = this.sketch.getLinks();
  }

  buildSketch(): Sketch {
    this.sketch.setBoards(this.boards);
    this.sketch.setLinks(this.links);
    this.sketch.saveChanges();
    return this.sketch;
  }

}
