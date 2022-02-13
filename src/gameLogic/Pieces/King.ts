import { diagonals } from '../../constants/board';
import { Diagonal } from '../customTypes';
import Piece from './Piece';
import Move from '../Move/Move';

class King extends Piece {
  getAvailableMoves = (): Move[] => {
    let result: Move[] = [];
    diagonals.forEach((diagonal) => {
      const cells = this.board.getDiagonal(this.position, diagonal as Diagonal);
      let validDestinations = cells;
      const firstPieceIndex = cells.findIndex((cell) => this.board.getPieceAtPosition(cell));
      if (firstPieceIndex !== -1) {
        validDestinations = cells.slice(0, firstPieceIndex);
      }
      const availableMoves = validDestinations.map(
        (move) => new Move(this.board, this.position, move),
      );
      result = [...result, ...availableMoves];
    });
    return result;
  };

  getAvailableCaptures = (): Move[] => {
    const activeCaptureChainMoves = this.checkActiveCaptureChain();
    if (activeCaptureChainMoves) return activeCaptureChainMoves;
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
          const capture = new Move(this.board, this.position, cell, currentEnemyPiece.position);
          result.push(capture);
        }
      }
    });
    return result;
  };
}

export default King;
