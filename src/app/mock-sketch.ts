import { Board } from './board/board';
import { BoardConfig } from './board-config';
import { Link } from './link/link';

const INPUT_CONFIG = new BoardConfig({'mac': '1234', 'maintype': 'input', 'subtype': 'button', 'name': 'button_1'});
const OUTPUT_CONFIG = new BoardConfig({'mac': '4567', 'maintype': 'output', 'subtype': 'led', 'name': 'led_1'});

export const BOARDS: Board[] = [
  new Board(120, 120, 40, 40, INPUT_CONFIG),
  new Board(240, 120, 40, 40, OUTPUT_CONFIG)
];

export const LINKS: Link[] = [
  new Link(120, 120, 240, 120)
];
