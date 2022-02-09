// @ts-ignore
import blackPawnSvg from '../assets/svgs/blackPawn.svg';
// @ts-ignore
import whitePawnSvg from '../assets/svgs/whitePawn.svg';
// @ts-ignore
import blackKingSvg from '../assets/svgs/blackKing.svg';
// @ts-ignore
import whiteKingSvg from '../assets/svgs/whiteKing.svg';

// eslint-disable-next-line import/extensions,import/no-unresolved
import { Diagonal, Side } from '../gameLogic/customTypes';

export const distanceBetweenCells = 12.5; // %
export const pieces = {
  BLACK_PAWN: 'blackPawn',
  BLACK_KING: 'blackKing',
  WHITE_PAWN: 'whitePawn',
  WHITE_KING: 'whiteKing',
};
export const pieceOffsets = {
  [Side.WHITE]: 2,
  [Side.BLACK]: -2,
};
export const pieceGraphics = {
  [pieces.BLACK_PAWN]: blackPawnSvg,
  [pieces.WHITE_PAWN]: whitePawnSvg,
  [pieces.BLACK_KING]: blackKingSvg,
  [pieces.WHITE_KING]: whiteKingSvg,
};
export const diagonals : Diagonal[] = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];
