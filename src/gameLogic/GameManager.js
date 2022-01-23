import { pieces, diagonals } from "../constants/board";

export default class GameManager {
    getPieceLayout = () => {
        const placeRow = (y, piece) => {
            for (let x = 0; x < 8; x += 1) {
                if ( (y % 2 === 0 && x % 2 === 1) || ( y % 2 === 1 && x % 2 === 0) ) {
                    const cell = {
                        piece,
                        destination: { x, y },
                    };
                    result.push(cell);
                }
            }
        }
        const result = [];
        for (let y = 0; y < 3; y += 1) {
            placeRow(y, pieces.WHITE_PAWN);
        }
        for (let y = 5; y < 8; y += 1) {
            placeRow(y, pieces.BLACK_PAWN);
        }
        return result;
    };
    movingSide = 'white';
    piecesOnBoard = [
        { piece: pieces.WHITE_KING, destination: { x: 2, y: 3 } },
        { piece: pieces.BLACK_PAWN, destination: { x: 3, y: 2 } },
        { piece: pieces.BLACK_PAWN, destination: { x: 4, y: 1 } },
    ]
    isValidMove = (piece, { x, y }) => {
       if (this.isWhitePiece(piece) && this.movingSide === 'black') return false;
       if (!this.isWhitePiece(piece) && this.movingSide === 'white') return false;
       return (x >= 0 && x <= 7) && !this.getPiece(x, y);
    }
    getPiece = (x, y) => this.piecesOnBoard.find(p => p.destination?.x === x && p.destination?.y === y)
    isWhitePiece = (target) => target.piece.includes('white');
    getDiagonalCells = (startX, startY, diagonal, maxSteps) => {
        const result = [];
        let currentStep = 0;
        let x = startX + diagonal.x;
        let y = startY + diagonal.y;
        while ((x >= 0 && x <= 7) && (y >= 0 && y <= 7)) {
            if (maxSteps && currentStep >= maxSteps) return result;
            result.push({ x, y });
            currentStep += 1;
            x += diagonal.x;
            y += diagonal.y;
        }
        return result;
    };
    isPawn = (piece) => piece.piece.includes('Pawn');
    checkKingCondition = (piece) => {
        if (!this.isPawn(piece)) return piece;
        if (this.isWhitePiece(piece) && piece.destination.y === 7) {
            return this.promoteToKing(piece);
        }
        if (!this.isWhitePiece(piece) && piece.destination.y === 0) {
          return this.promoteToKing(piece);
        }
        return piece;
    };
    getValidMovesTotalCount = (pieces) => {
      let result = 0;
      pieces.forEach(piece => {
          result += this.getAvailableMoves(piece).length;
      });
      return result;
    };
    checkWinCondition = () => {
        const remainingBlackPieces = this.piecesOnBoard.filter(p => !this.isWhitePiece(p));
        const validMovesForBlack = this.getValidMovesTotalCount(remainingBlackPieces);
        const remainingWhitePieces = this.piecesOnBoard.filter(p => this.isWhitePiece(p));
        const validMovesForWhite = this.getValidMovesTotalCount(remainingWhitePieces);

        if (!remainingBlackPieces.length || !validMovesForBlack) {
            return 'white';
        }
        if (!remainingWhitePieces.length || !validMovesForWhite) {
            return 'black';
        }
    };

    promoteToKing = (piece) => {
        const kingPiece = this.isWhitePiece(piece) ? pieces.WHITE_KING : pieces.BLACK_KING;
        return { ...piece, piece: kingPiece };
    };
    isPieceOnSameSide = (piece) => {
        const isWhite = this.isWhitePiece(piece);
        return (this.movingSide === 'white' && isWhite) || (this.movingSide === 'black' && !isWhite);
    }
    isKing = (piece) => !this.isPawn(piece);
    getKingCaptures(cells) {
        const result = [];
        let currentEnemyPiece;
        for (let i = 0; i < cells.length; i += 1) {
            const cell = cells[i];
            const piece = this.getPiece(cell.x, cell.y);
            if (piece && this.isPieceOnSameSide(piece)) return result;
            if (currentEnemyPiece && piece) return result;
            if (piece) {
                currentEnemyPiece = piece;
                continue;
            }
            if (currentEnemyPiece) {
                result.push({
                    capturedPiece: currentEnemyPiece,
                    coordinates: cell
                });
            }

        }
        return result;
    }

    getCaptureMoves = ({x, y}) => {
        let possibleCaptures = [];

        for (let i = 0; i < diagonals.length; i += 1) {
            const diagonal = diagonals[i];
            const piece = this.getPiece(x, y);
            const cells = this.getDiagonalCells(x, y, diagonal);
            if (!cells.length) continue;

            if (this.isKing(piece)) {
                possibleCaptures = [...possibleCaptures, ...this.getKingCaptures(cells)];
            }

                const [nextCell, firstCellAfterPiece] = cells;
                const nextCellPiece = this.getPiece(nextCell.x, nextCell.y);
                if (!nextCellPiece || this.isPieceOnSameSide(nextCellPiece)) continue;
                const vacantCellsAfterPiece = cells.filter(c => !this.getPiece(c.x, c.y));
                if (!vacantCellsAfterPiece.includes(firstCellAfterPiece)) continue;
                possibleCaptures.push({
                    coordinates: firstCellAfterPiece,
                    capturedPiece: this.getPiece(nextCell.x, nextCell.y)
                });
        }
        return possibleCaptures;
    };

    getAvailableMoves = (piece) => {
        if (!piece) return [];
        let result = [];
        let totalCaptures = new Map();
        const piecesOfMovingSide = this.piecesOnBoard.filter(p => {
           if (this.movingSide === 'white') {
               return this.isWhitePiece(p);
           }
           return !this.isWhitePiece(p);
        });
        piecesOfMovingSide.forEach(piece => {
            const possibleCapturesForPiece = this.getCaptureMoves(piece.destination);
            console.log({ possibleCapturesForPiece })
            if (!possibleCapturesForPiece.length) return;
            totalCaptures.set(piece, possibleCapturesForPiece);
        });

        let moves = [];
        if (totalCaptures.size && !totalCaptures.get(piece)) return [];
        if (totalCaptures.get(piece)) return totalCaptures.get(piece);

        if (this.isPawn(piece)) {
            const pawnMoveDiagonals = [
                {x: 1, y: this.isWhitePiece(piece) ? 1 : -1},
                {x: -1, y: this.isWhitePiece(piece) ? 1 : -1}
            ]
            pawnMoveDiagonals.forEach((diagonal) => {
                moves = [...moves, ...this.getDiagonalCells(piece.destination.x, piece.destination.y, diagonal, 1)]
            });
        }
        else {
            diagonals.forEach(diagonal => {
                const cells = this.getDiagonalCells
                (
                    piece.destination.x,
                    piece.destination.y,
                    diagonal
                );
                let movesOnDiagonal = cells;
                const firstPieceIndex = cells.findIndex(c => this.getPiece(c.x, c.y));
                if (firstPieceIndex !== -1) {
                    movesOnDiagonal = cells.slice(0, firstPieceIndex);
                }
                moves = [...moves, ...movesOnDiagonal];
            });
        }
        moves.forEach(move => {
            if (!this.isValidMove(piece, move)) return;
            result.push({coordinates: move});
        })

        return result;
    };
    move = (piece, move) => {
        let chainCaptures = [];
        let pieces = this.piecesOnBoard.filter(p => p !== piece);
        if (move.capturedPiece) {
            pieces = pieces.filter(p => p !== move.capturedPiece);
        }
        const pieceAfterMove =  { ...piece, destination: move.coordinates };
        this.piecesOnBoard = [...pieces, this.checkKingCondition(pieceAfterMove)];
        if (move.capturedPiece) {
            chainCaptures = this.getCaptureMoves(move.coordinates);
        }
        if (!chainCaptures.length) {
        this.movingSide = this.movingSide === 'white' ? 'black' : 'white';
        }
        this.checkWinCondition();

        return this.piecesOnBoard;
    };
}