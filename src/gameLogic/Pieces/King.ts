// eslint-disable-next-line import/extensions,import/no-unresolved
import { diagonals } from '../../constants/board';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Diagonal, Move } from '../customTypes';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Piece from './Piece';

class King extends Piece {
  getAvailableMoves = (): Move[] => {
    let result: Move[] = [];
    diagonals.forEach((diagonal) => {
      const cells = this.board.getDiagonal(this.position, diagonal as Diagonal);
      let movesOnDiagonal = cells;
      const firstPieceIndex = cells.findIndex((cell) => this.board.getPieceAtPosition(cell));
      if (firstPieceIndex !== -1) {
        movesOnDiagonal = cells.slice(0, firstPieceIndex);
      }
      result = [...result, ...movesOnDiagonal.map((move) => ({ from: this.position, to: move }))];
    });
    return result;
  };

  getAvailableCaptures = (): Move[] => {
    const result : Move[] = [];
    diagonals.forEach((diagonal) => {
      const cells = this.board.getDiagonal(this.position, diagonal as Diagonal);
      if (!cells.length) return;

      let currentEnemyPiece;
      for (let i = 0; i < cells.length; i += 1) {
        const cell = cells[i];
        const pieceOnCell = this.board.getPieceAtPosition(cell);
        if (pieceOnCell && pieceOnCell.side === this.side) return;
        if (currentEnemyPiece && pieceOnCell) return;
        if (pieceOnCell) {
          currentEnemyPiece = pieceOnCell;
        } else if (currentEnemyPiece) {
          result.push({
            capturedPiecePosition: currentEnemyPiece.position,
            from: this.position,
            to: cell,
          });
        }
      }
    });
    return result;
  };
}

export default King;
