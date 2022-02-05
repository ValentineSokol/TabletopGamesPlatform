import { diagonals } from '../constants/board';

export enum Side {
    WHITE = 'white',
    BLACK = 'black'
}
export enum GameOutcome {
    PENDING,
    WHITE_VICTORY,
    BLACK_VICTORY,
    DRAW,
}
export class Position {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static isValid(x: number, y: number): boolean {
    return (x >= 0 && x <= 7) && (y >= 0 && y <= 7);
  }
}
export type Move = {
    from: Position,
    to: Position,
    capturedPiecePosition?: Position
}
export type Diagonal = {
    x: 1 | -1
    y: 1 | -1
}
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

    if (remainingWhitePieces.length <= 0 && remainingBlackPieces.length) return GameOutcome.BLACK_VICTORY;
    if (remainingBlackPieces.length <= 0 && remainingWhitePieces.length) return GameOutcome.WHITE_VICTORY;
    if (remainingWhitePieces.length <= 0 && remainingBlackPieces.length <= 0) return GameOutcome.DRAW;

    const remainingWhiteMoves = [...this.board.pendingCapturesForSide(Side.WHITE), ...this.board.possibleMovesForSide(Side.WHITE)];
    const remainingBlackMoves = [...this.board.pendingCapturesForSide(Side.BLACK), ...this.board.possibleMovesForSide(Side.BLACK)];

    if (this.movingSide === Side.WHITE && !remainingWhiteMoves.length) return GameOutcome.BLACK_VICTORY;
    if (this.movingSide === Side.BLACK && !remainingBlackMoves.length) return GameOutcome.WHITE_VICTORY;

    return GameOutcome.PENDING;
  }
}

export class Board {
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
    return this.pieces.find((piece) => piece.position.x === position.x && piece.position.y === position.y);
  }

  getDiagonal = (startPosition: Position, diagonal: Diagonal, maxSteps: number = Infinity) : Position[] => {
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

  hasPiecePromoted(piece: Piece) : boolean {
    if (!piece) return false;
    const { position } = piece;
    return piece.isWhite() && position.y === 7 || piece.isBlack() && position.y === 0;
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
export class Piece {
  board: Board;

  side: Side;

  position: Position;

  constructor(side: Side, board: Board, position: Position) {
    this.side = side;
    this.board = board;
    this.position = position;
  }

  isKing(): boolean {
    return this instanceof King;
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
      const validMoves = diagonalCells.filter((position) => !this.board.getPieceAtPosition(position));
      result = [...result, ...validMoves.map((position) => ({ from: this.position, to: position }))];
    });
    return result;
  };

  getAvailableCaptures() : Move[] {
    const result = [];
    for (let i = 0; i < diagonals.length; i += 1) {
      const diagonal = diagonals[i];
      const cells = this.board.getDiagonal(this.position, diagonal as Diagonal);
      if (!cells.length) continue;
      const [nextCell, firstCellAfterPiece] = cells;
      if (!this.board.getPieceAtPosition(nextCell) || this.board.getPieceAtPosition(nextCell)?.side === this.side) continue;
      if (!firstCellAfterPiece || this.board.getPieceAtPosition(firstCellAfterPiece)) continue;
      result.push({
        from: this.position,
        to: firstCellAfterPiece,
        capturedPiecePosition: nextCell,
      });
    }
    return result;
  }
}
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
          continue;
        }
        if (currentEnemyPiece) {
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

export default GameManager;
