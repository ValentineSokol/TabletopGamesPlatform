// eslint-disable-next-line import/extensions,import/no-unresolved
import Position from '../Position/Position';
import {
  Side,
  Diagonal,
  Move, GameOutcome,
// eslint-disable-next-line import/extensions,import/no-unresolved
} from '../customTypes';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Piece from '../Pieces/Piece';
// eslint-disable-next-line import/extensions,import/no-unresolved
import King from '../Pieces/King';

class Board {
  private movingSide: Side = Side.WHITE;

  private pieces: Piece[] = [];

  constructor() {
    this.setup();
  }

  public getPieces() : ReadonlyArray<Piece> {
    return this.pieces;
  }

  public selectPiece(piece: Piece) : Move[] {
    if (piece.side !== this.movingSide) return [];
    const captures = this.pendingCapturesForSide();
    if (captures.length) return captures;
    return piece.getAvailableMoves();
  }

  public getPieceAtPosition(position: Position): Piece | undefined {
    return this.pieces.find(
      (piece) => piece.position.x === position.x && piece.position.y === position.y,
    );
  }

  public move(move: Move) {
    let chainCaptures : Move[] = [];
    const movingPiece = this.getPieceAtPosition(move.from);
    if (!movingPiece || movingPiece?.side !== this.movingSide) return {};

    this.movePiece(move);
    if (Board.hasPiecePromoted(movingPiece)) this.promotePiece(movingPiece);

    if (move.capturedPiecePosition) {
      const capturedPiece = this.getPieceAtPosition(move.capturedPiecePosition);
      if (capturedPiece) {
        this.removePiece(capturedPiece);
        chainCaptures = movingPiece.getAvailableCaptures();
      }
    }
    if (!chainCaptures.length) {
      this.finishMove();
    }
    return { movedPiece: movingPiece, hasChainCaptures: chainCaptures.length };
  }

  // eslint-disable-next-line class-methods-use-this
  public getDiagonal = (
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

  private isGameOver() : GameOutcome {
    const remainingWhitePieces = this.piecesForSide(Side.WHITE);
    const remainingBlackPieces = this.piecesForSide(Side.BLACK);

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
      ...this.pendingCapturesForSide(Side.WHITE),
      ...this.possibleMovesForSide(Side.WHITE),
    ];
    const remainingBlackMoves = [
      ...this.pendingCapturesForSide(Side.BLACK),
      ...this.possibleMovesForSide(Side.BLACK),
    ];

    if (this.movingSide === Side.WHITE && !remainingWhiteMoves.length) {
      return GameOutcome.BLACK_VICTORY;
    }
    if (this.movingSide === Side.BLACK && !remainingBlackMoves.length) {
      return GameOutcome.WHITE_VICTORY;
    }

    return GameOutcome.PENDING;
  }

  private piecesForSide(side: Side) : Piece[] {
    return this.pieces.filter((piece) => piece.side === side);
  }

  private possibleMovesForSide(side: Side) : Move[] {
    let result : Move[] = [];
    const pieces = this.piecesForSide(side);
    pieces.forEach((piece) => {
      result = [...result, ...piece.getAvailableMoves()];
    });
    return result;
  }

  private pendingCapturesForSide(side: Side = this.movingSide): Move[] {
    let result : Move[] = [];
    const pieces = this.piecesForSide(side);
    pieces.forEach((piece) => {
      result = [...result, ...piece.getAvailableCaptures()];
    });
    return result;
  }

  private setup = () => {
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

  private static hasPiecePromoted(piece: Piece) : boolean {
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

  private finishMove() {
    this.movingSide = this.movingSide === Side.WHITE ? Side.BLACK : Side.WHITE;
  }
}

export default Board;
