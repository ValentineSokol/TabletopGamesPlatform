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
});