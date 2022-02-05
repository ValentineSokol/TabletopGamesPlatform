// eslint-disable-next-line import/extensions,import/no-unresolved
import Board from '../Board/Board';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Move, Side, GameOutcome } from '../customTypes';

class GameManager {
  moves: Move[] = [];

  movingSide: Side = Side.WHITE;

  board: Board = new Board(this);

  private finishMove() {
    this.movingSide = this.movingSide === Side.WHITE ? Side.BLACK : Side.WHITE;
  }

  move(move: Move) {
    const movingPiece = this.board.getPieceAtPosition(move.from);
    if (movingPiece?.side !== this.movingSide) return {};
    const result = this.board.move(move);
    if (!result?.hasChainCaptures) {
      this.finishMove();
    }
    return result;
  }

  isGameOver() : GameOutcome {
    const remainingWhitePieces = this.board.piecesForSide(Side.WHITE);
    const remainingBlackPieces = this.board.piecesForSide(Side.BLACK);

    if (
      remainingWhitePieces.length <= 0
        && remainingBlackPieces.length
    ) return GameOutcome.BLACK_VICTORY;
    if (
      remainingBlackPieces.length <= 0
        && remainingWhitePieces.length
    ) return GameOutcome.WHITE_VICTORY;
    if (
      remainingWhitePieces.length <= 0
        && remainingBlackPieces.length <= 0
    ) return GameOutcome.DRAW;

    const remainingWhiteMoves = [
      ...this.board.pendingCapturesForSide(Side.WHITE),
      ...this.board.possibleMovesForSide(Side.WHITE),
    ];
    const remainingBlackMoves = [
      ...this.board.pendingCapturesForSide(Side.BLACK),
      ...this.board.possibleMovesForSide(Side.BLACK),
    ];

    if (this.movingSide === Side.WHITE && !remainingWhiteMoves.length) {
      return GameOutcome.BLACK_VICTORY;
    }
    if (this.movingSide === Side.BLACK && !remainingBlackMoves.length) {
      return GameOutcome.WHITE_VICTORY;
    }

    return GameOutcome.PENDING;
  }
}

export default GameManager;
