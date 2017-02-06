import { Board } from './board';
import { BoardConfig } from './board-config';
import { Link } from './link';

const INPUT_CONFIG = new BoardConfig({'mac': '1234', 'type': 'input', 'subtype': 'button', 'name': 'button_1'});
const OUTPUT_CONFIG = new BoardConfig({'mac': '4567', 'type': 'output', 'subtype': 'led', 'name': 'led_1'});

export const BOARDS: Board[] = [
  new Board(120, 120, 40, 40, INPUT_CONFIG),
  new Board(240, 120, 40, 40, OUTPUT_CONFIG)
];

export const LINKS: Link[] = [
  new Link(120, 120, 240, 120)
];
