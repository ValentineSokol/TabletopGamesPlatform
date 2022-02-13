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

  public toBoardNotation() : number {
    const startXForRow = this.y % 2 === 0 ? 7 : 6;
    const horizontalOffset = (startXForRow - this.x) / 2;
    const rowStep = 4;
    const rowNumber = 7 - this.y;

    return 1 + rowStep * rowNumber + horizontalOffset;
  }
}

export default Position;
