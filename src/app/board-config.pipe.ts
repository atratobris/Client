import { Pipe, PipeTransform } from '@angular/core';

import { BoardConfig } from './board-config';

@Pipe({ name: 'virtualBoards' })
export class VirtualBoardsPipe implements PipeTransform {
  transform(allBoards: BoardConfig[]) {
    return allBoards.filter(board => board.getType() === 'VirtualBoard');
  }
}

@Pipe({ name: 'realBoards' })
export class RealBoardsPipe implements PipeTransform {
  transform(allBoards: BoardConfig[]) {
    return allBoards.filter(board => board.getType() === 'RealBoard');
  }
}
