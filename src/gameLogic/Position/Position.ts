class Position {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static isValid(x: number, y: number): boolean {
    return (x >= 0 && x <= 7) && (y >= 0 && y <= 7);
  }
}

export default Position;
