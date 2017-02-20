// Colours imported from http://materializecss.com/color.html
// Pick the Lighten-2 values so they work with black text
export class Colours {
  private static colours: string[] = [
    "#e57373", // Red
    "#f06292", // Pink
    "#ba68c8", // Purple
    "#7986cb", // Indigo
    "#64b5f6", // Blue
    "#4dd0e1", // Cyan
  ];

  static getColour(idx: number): string {
    const len = this.colours.length;
    return this.colours[idx % len];
  }
}
