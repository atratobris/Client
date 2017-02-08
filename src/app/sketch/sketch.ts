export class Sketch {
  id: number;
  links: [{to: string, from: string, logic: string}];
  boards: [{mac: string, width: number, height: number, centre: {x: number, y: number}}];
}
