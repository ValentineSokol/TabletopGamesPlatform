// eslint-disable-next-line import/extensions,import/no-unresolved
import GameManager from '../GameManager/GameManager';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Position from '../Position/Position';
import {
  Side,
  Diagonal,
  Move,
// eslint-disable-next-line import/extensions,import/no-unresolved
} from '../customTypes';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Piece from '../Pieces/Piece';
// eslint-disable-next-line import/extensions,import/no-unresolved
import King from '../Pieces/King';

class Board {
  gameManager: GameManager;

  pieces: Piece[] = [];

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
    this.setup();
  }

  piecesForSide(side: Side) : Piece[] {
    return this.pieces.filter((piece) => piece.side === side);
  }

  possibleMovesForSide(side: Side) : Move[] {
    let result : Move[] = [];
    const pieces = this.piecesForSide(side);
    pieces.forEach((piece) => {
      result = [...result, ...piece.getAvailableMoves()];
    });
    return result;
  }

  pendingCapturesForSide(side: Side = this.gameManager.movingSide): Move[] {
    let result : Move[] = [];
    const pieces = this.piecesForSide(side);
    pieces.forEach((piece) => {
      result = [...result, ...piece.getAvailableCaptures()];
    });
    return result;
  }

  setup = () => {
    function isBlackCell(x: number, y: number) {
      return (y % 2 === 0 && x % 2 === 1) || (y % 2 === 1 && x % 2 === 0);
    }

    const placeRow = (y: number, side: Side) => {
      for (let x = 0; x < 8; x += 1) {
        if (isBlackCell(x, y)) {
          const position = new Position(x, y);
          this.pieces.push(new Piece(side, this, position));
        }
      }
    };
    for (let y = 0; y < 3; y += 1) {
      placeRow(y, Side.WHITE);
    }
    for (let y = 5; y < 8; y += 1) {
      placeRow(y, Side.BLACK);
    }
  };

  selectPiece(piece: Piece) : Move[] {
    if (piece.side !== this.gameManager.movingSide) return [];
    const captures = this.pendingCapturesForSide();
    if (captures.length) return captures;
    return piece.getAvailableMoves();
  }

  getPieceAtPosition(position: Position): Piece | undefined {
    return this.pieces.find(
      (piece) => piece.position.x === position.x && piece.position.y === position.y,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  getDiagonal = (
    startPosition: Position,
    diagonal: Diagonal,
    maxSteps: number = Infinity,
  ) : Position[] => {
    const result = [];
    let currentStep = 0;
    let currentX = startPosition.x + diagonal.x;
    let currentY = startPosition.y + diagonal.y;
    while (Position.isValid(currentX, currentY)) {
      if (maxSteps !== Infinity && currentStep >= maxSteps) return result;
      result.push(new Position(currentX, currentY));
      currentStep += 1;
      currentX += diagonal.x;
      currentY += diagonal.y;
    }
    return result;
  };

  // eslint-disable-next-line class-methods-use-this
  hasPiecePromoted(piece: Piece) : boolean {
    if (!piece) return false;
    const { position } = piece;
    return (piece.isWhite() && position.y === 7) || (piece.isBlack() && position.y === 0);
  }

  private movePiece(move: Move) {
    const piece = this.getPieceAtPosition(move.from);
    if (!piece) return;
    piece.position = move.to;
  }

  private removePiece(target: Piece) {
    this.pieces = this.pieces.filter((piece) => piece !== target);
  }

  private promotePiece(target: Piece) {
    this.removePiece(target);
    this.pieces.push(new King(target.side, this, target.position));
  }

  move(move: Move) {
    let chainCaptures = [];
    const movingPiece = this.getPieceAtPosition(move.from);

    if (!movingPiece) return {};

    this.movePiece(move);
    if (this.hasPiecePromoted(movingPiece)) this.promotePiece(movingPiece);

    if (move.capturedPiecePosition) {
      const capturedPiece = this.getPieceAtPosition(move.capturedPiecePosition);
      if (capturedPiece) {
        this.removePiece(capturedPiece);
        chainCaptures = movingPiece.getAvailableCaptures();
      }
    }
    return { movedPiece: movingPiece, hasChainCaptures: chainCaptures.length };
  }
}

export default Board;
