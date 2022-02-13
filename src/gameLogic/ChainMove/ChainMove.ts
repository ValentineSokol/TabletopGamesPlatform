import Move from '../Move/Move';
import Board from '../Board/Board';
import Position from '../Position/Position';
import IMove from '../interfaces/IMove';

class ChainMove implements IMove {
  private moves : Move[];

  private board: Board;

  public from: Position;

  public to: Position;

  constructor(board: Board, moves: Move[]) {
    this.board = board;
    this.moves = moves;
    const [firstMove] = moves;
    const lastMove = moves[moves.length - 1];
    this.from = firstMove.from;
    this.to = lastMove.to;
  }

  public execute() {
    this.moves.forEach((move) => move.execute());
    const movedPiece = this.board.getPieceAtPosition(this.to);
    return { movedPiece, hasChainCaptures: 0 };
  }

  public revert() {
    [...this.moves].reverse().forEach((move) => move.revert());
  }

  toBoardNotation(): string {
    return `${this.from.toBoardNotation()}x${this.to.toBoardNotation()}`;
  }
}

export default ChainMove;
