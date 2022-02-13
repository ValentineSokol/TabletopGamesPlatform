import IMove from '../interfaces/IMove';

class MoveHistory {
  private moves: IMove[] = [];

  private currentMoveIdx: number = -1;

  get currentMove() : IMove {
    return this.moves[this.currentMoveIdx];
  }

  public get isCurrentMoveLast(): boolean {
    return this.currentMoveIdx === this.moves.length - 1;
  }

  public addMove(move: IMove) {
    this.moves.push(move);
    this.currentMoveIdx += 1;
  }

  public getCurrentMoveIdx() {
    return this.currentMoveIdx;
  }

  public gotoPreviousMove() {
    if (this.currentMoveIdx === -1) return;
    this.currentMove.revert();
    this.currentMoveIdx -= 1;
  }

  public gotoNextMove() {
    if (this.currentMoveIdx === this.moves.length - 1) return;
    this.currentMoveIdx += 1;
    const nextMove = this.moves[this.currentMoveIdx];
    nextMove.execute();
  }

  public gotoFirstMove() {
    if (this.currentMoveIdx === -1) return;
    this.moves.slice(0, this.currentMoveIdx + 1).reverse().forEach((move) => move.revert());
    this.currentMoveIdx = -1;
  }

  public gotoLastMove() {
    if (this.isCurrentMoveLast) return;
    this.moves.slice(this.currentMoveIdx + 1).forEach((move) => move.execute());
    this.currentMoveIdx = this.moves.length - 1;
  }

  public toBoardNotation() {
    return this.moves.map((move) => move.toBoardNotation());
  }
}

export default MoveHistory;
