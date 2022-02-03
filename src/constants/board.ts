// @ts-ignore
import blackPawnSvg from "../assets/svgs/blackPawn.svg";
// @ts-ignore
import whitePawnSvg from "../assets/svgs/whitePawn.svg";
// @ts-ignore
import blackKingSvg from "../assets/svgs/blackKing.svg";
// @ts-ignore
import whiteKingSvg from "../assets/svgs/whiteKing.svg";

export const PIECE_COLORS = { white: { base: 'darkblue', top: 'blue' }, black: { base: 'darkred', top: 'red' }, king: 'gold' };
export const PIECE_SIZES = { base: '50%', top: '35%', king: '15%' };
export const distanceBetweenCells = 12.5; // %
export const pieces = {
    BLACK_PAWN: 'blackPawn',
    BLACK_KING: 'blackKing',
    WHITE_PAWN: 'whitePawn',
    WHITE_KING: 'whiteKing'
};
 export const pieceGraphics = {
    [pieces.BLACK_PAWN]: blackPawnSvg,
    [pieces.WHITE_PAWN]: whitePawnSvg,
    [pieces.BLACK_KING]: blackKingSvg,
    [pieces.WHITE_KING]: whiteKingSvg
};
export const diagonals = [
    {x: -1, y: -1},
    {x: 1, y: -1},
    {x: -1, y: 1},
    {x: 1, y: 1}
];
