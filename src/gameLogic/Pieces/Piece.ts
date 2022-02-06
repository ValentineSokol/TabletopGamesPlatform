// eslint-disable-next-line import/extensions,import/no-unresolved
import { diagonals } from '../../constants/board';
import {
  Diagonal, Move, Side,
// eslint-disable-next-line import/extensions,import/no-unresolved
} from '../customTypes';

// eslint-disable-next-line import/extensions,import/no-unresolved
import Position from '../Position/Position';
// eslint-disable-next-line import/extensions,import/no-unresolved
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
      const validMoves = vacantCells.map((position) => ({ from: this.position, to: position }));
      result = [...result, ...validMoves];
    });
    return result;
  };

  getAvailableCaptures() : Move[] {
    const result = [];
    for (let i = 0; i < diagonals.length; i += 1) {
      const diagonal = diagonals[i];
      const cells = this.board.getDiagonal(this.position, diagonal);
      if (cells.length) {
        const [nextCell, firstCellAfterPiece] = cells;
        const nextCellPiece = this.board.getPieceAtPosition(nextCell);
        if (nextCellPiece && nextCellPiece?.side !== this.side) {
          if (firstCellAfterPiece && !this.board.getPieceAtPosition(firstCellAfterPiece)) {
            result.push({
              from: this.position,
              to: firstCellAfterPiece,
              capturedPiecePosition: nextCell,
            });
          }
        }
      }
    }
    return result;
  }
}

export default Piece;
