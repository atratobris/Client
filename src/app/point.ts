export interface PointInterface {
  x: number;
  y: number;
}

export class Point {
  private x: number;
  private y: number;

  constructor( x: number, y: number);
  constructor( obj: PointInterface );
  constructor( xOrInterface: any, y?: number) {
    if (typeof xOrInterface === 'number') {
      this.x = xOrInterface;
      this.y = y;
    } else {
      this.x = xOrInterface.x;
      this.y = xOrInterface.y;
    }
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}
