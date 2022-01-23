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
        { piece: pieces.WHITE_PAWN, destination: { x: 3, y: 2 } },
        { piece: pieces.BLACK_PAWN, destination: { x: 4, y: 1 } },
    ];
    isValidMove = (piece, { x, y }) => {
       if (this.isWhitePiece(piece) && this.movingSide === 'black') return false;
       if (!this.isWhitePiece(piece) && this.movingSide === 'white') return false;
       return (x >= 0 && x <= 7) && !this.getPiece(x, y);
    }
    getPiece = (x, y) => this.piecesOnBoard.find(p => p.destination?.x === x && p.destination?.y === y)
    isWhitePiece = (target) => target.piece.includes('white');
    getDiagonalCells = (x, y, diagonal, maxSteps) => {
        const result = [];
        let currentStep = 0;
        let startX = x;
        let startY = y;
        while ((startX >= 0 && startX <= 7) && (startY >= 0 && startY <= 7)) {
            if (maxSteps && currentStep >= maxSteps) return result;
            const newX = startX + diagonal.x;
            const newY = startY + diagonal.y;
            result.push({x: newX, y: newY});
            currentStep += 1;
            startX += diagonal.x;
            startY += diagonal.y;
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
    getCaptureMoves = ({x, y}) => {
        let possibleCaptures = [];
        for (let i = 0; i < diagonals.length; i += 1) {
            const diagonal = diagonals[i];
            const isWhite = this.isWhitePiece(this.getPiece(x, y));
            const cells = this.getDiagonalCells(x, y, diagonal);
            if (!cells.length) return possibleCaptures;

            if (!this.isPawn(this.getPiece(x, y))) {
                const enemyPieces = cells.filter(c => {
                    const pieceOnCell = this.getPiece(c.x, c.y);
                   return  pieceOnCell && (this.movingSide === 'white' ?
                       !this.isWhitePiece(pieceOnCell)
                       :
                       this.isWhitePiece(pieceOnCell));

                })
                for (let j = 0 ; j < enemyPieces.length; j += 1) {
                    const piece = enemyPieces[j];
                   const vacantCellsAfter = this.getDiagonalCells(piece.x, piece.y, diagonal);
                   const [cellAfterPiece] = vacantCellsAfter;
                   if (this.getPiece(cellAfterPiece.x, cellAfterPiece.y)) return possibleCaptures;
                   const firstPieceInRow = vacantCellsAfter.findIndex(c => this.getPiece(c.x, c.y));
                   possibleCaptures = [
                       ...possibleCaptures,
                       ...vacantCellsAfter.slice(0, firstPieceInRow).map(c => ({ capturedPiece: this.getPiece(piece.x, piece.y), coordinates: c }))
                   ]
                }
            } else {
                const [nextCell, firstCellAfterPiece] = cells;
                if (!this.getPiece(nextCell.x, nextCell.y) || isWhite === this.isWhitePiece(this.getPiece(nextCell.x, nextCell.y))) return possibleCaptures;
                const vacantCellsAfterPiece = cells.slice(1).filter(c => !this.getPiece(c.x, c.y));
                if (!vacantCellsAfterPiece.includes(firstCellAfterPiece)) continue;
                possibleCaptures.push({
                    coordinates: firstCellAfterPiece,
                    capturedPiece: this.getPiece(nextCell.x, nextCell.y)
                });
            }
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
                const firstPiece = cells.findIndex(c => this.getPiece(c.x, c.y));
                const movesOnDiagonal = cells.slice(0, firstPiece);
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