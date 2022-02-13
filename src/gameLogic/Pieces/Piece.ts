import { diagonals } from '../../constants/board';
import {
  Diagonal, Side,
} from '../customTypes';
import Position from '../Position/Position';
import Move from '../Move/Move';
import Board from '../Board/Board';

class Piece {
  board: Board;

  side: Side;

  position: Position;

  constructor(side: Side, board: Board, position: Position) {
    this.side = side;
    this.board = board;
    this.position = position;
  }

  isWhite = () : boolean => this.side === Side.WHITE;

  isBlack = () : boolean => this.side === Side.BLACK;

  getAvailableMoves = (): Move[] => {
    let result : Move[] = [];
    const moveDiagonals: Diagonal[] = [
      { x: 1, y: this.isWhite() ? 1 : -1 },
      { x: -1, y: this.isWhite() ? 1 : -1 },
    ];
    moveDiagonals.forEach((diagonal) => {
      const diagonalCells = this.board.getDiagonal(this.position, diagonal, 1);
      const vacantCells = diagonalCells.filter(
        (position) => !this.board.getPieceAtPosition(position),
      );
      const validMoves = vacantCells.map(
        (position) => new Move(this.board, this.position, position),
      );
      result = [...result, ...validMoves];
    });
    return result;
  };

  checkActiveCaptureChain() {
    const lastMoveInCaptureChain = this.board.getLastMoveInCaptureChain();
    let movedPiece;
    if (lastMoveInCaptureChain) {
      movedPiece = this.board.getPieceAtPosition(lastMoveInCaptureChain.to);
    }
    if (movedPiece === this) return;
    // eslint-disable-next-line consistent-return
    return movedPiece?.getAvailableCaptures();
  }

  getAvailableCaptures() : Move[] {
    const activeCaptureChainMoves = this.checkActiveCaptureChain();
    if (activeCaptureChainMoves) return activeCaptureChainMoves;
    const result = [];
    for (let i = 0; i < diagonals.length; i += 1) {
      const diagonal = diagonals[i];
      const cells = this.board.getDiagonal(this.position, diagonal);
      if (cells.length) {
        const [nextCell, firstCellAfterPiece] = cells;
        const nextCellPiece = this.board.getPieceAtPosition(nextCell);
        if (nextCellPiece && nextCellPiece?.side !== this.side) {
          if (firstCellAfterPiece && !this.board.getPieceAtPosition(firstCellAfterPiece)) {
            const move = new Move(this.board, this.position, firstCellAfterPiece, nextCell);
            result.push(move);
          }
        }
      }
    }
    return result;
  }
}

export default Piece;
