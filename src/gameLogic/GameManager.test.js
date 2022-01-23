import GameManager from "./GameManager";
import { pieces } from "../constants/board";

describe('Checkers Game Manager', () => {
    const gameManager = new GameManager();
    it('The King should not be able to capture a piece, if the cell next to it is occupied.', () => {
        gameManager.piecesOnBoard = [
            { piece: pieces.WHITE_KING, destination: { x: 2, y: 3 } },
            { piece: pieces.BLACK_PAWN, destination: { x: 3, y: 2 } },
            { piece: pieces.BLACK_PAWN, destination: { x: 4, y: 1 } },
        ];
        const captureMoves = gameManager.getCaptureMoves(gameManager.piecesOnBoard[0].destination);
        expect(captureMoves.length).toBe(0);
    });
    it('The King should not be able to jump over pieces when moving', () => {
        gameManager.piecesOnBoard = [
            { piece: pieces.WHITE_KING, destination: { x: 1, y: 4 } },
            { piece: pieces.BLACK_PAWN, destination: { x: 4, y: 1 } },
        ];
        const availableMovesForKing = gameManager.getAvailableMoves(gameManager.piecesOnBoard[0]);
        expect(availableMovesForKing).not.toEqual(expect.arrayContaining([{ coordinates: { x: 5, y: 0 } }]))
    });
    describe('should calculate captures correctly', () => {
      it('in forward right direction', () => {
          gameManager.piecesOnBoard = [
              { piece: pieces.WHITE_PAWN, destination: { x: 4, y: 1 } },
              { piece: pieces.BLACK_PAWN, destination: { x: 3, y: 2 } }
          ];

          const captureMoves = gameManager.getCaptureMoves(gameManager.piecesOnBoard[0].destination);
          expect(captureMoves).toEqual(expect.arrayContaining([ { capturedPiece: gameManager.piecesOnBoard[1], coordinates: { x: 2, y: 3} } ]))

      });

    });
});