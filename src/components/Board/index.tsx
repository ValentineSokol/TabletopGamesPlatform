import React, { useRef, useState } from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/extensions,import/no-unresolved
import BoardPiece from '../Piece/Piece';
// eslint-disable-next-line import/extensions,import/no-unresolved
import GameManager from '../../gameLogic/Board/Board';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Move } from '../../gameLogic/customTypes';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Piece from '../../gameLogic/Pieces/Piece';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Position from '../../gameLogic/Position/Position';
// @ts-ignore
import { ReactComponent as BoardSvg } from '../../assets/svgs/board.svg';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { HighlightedCell, PossibleMove } from '../styled/BoardCells';

const BoardContainer = styled.div`
  width: 24%;
  height: 24%;
  margin: 5% auto;
  transform: scaleY(1);
  position: relative;
  @media (max-width: 768px) {
    width: 80%;
    height: 80%;
  }
`;
function Board() {
  const gameManager = useRef(new GameManager());
  const [highlightedCells, setHighlightedCells] = useState<Position[]>([]);
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [boardPieces, setBoardPieces] = useState<readonly Piece[]>(gameManager.current.getPieces());

  const clearHighlightedCells = () => setHighlightedCells([]);
  const highlightCell = (position: Position) => {
    if (highlightedCells.includes(position)) return;
    const newHighlightedCells = [...highlightedCells, position];
    setHighlightedCells(newHighlightedCells);
  };
  const selectPiece = (piece : Piece) => {
    const moves = gameManager.current.selectPiece(piece);
    moves.forEach((move : Move) => highlightCell(move.from));
    setAvailableMoves(moves);
  };
  const movePiece = (move: Move) => {
    const { hasChainCaptures, movedPiece } = gameManager.current.move(move);
    setBoardPieces(gameManager.current.getPieces());
    setAvailableMoves([]);
    clearHighlightedCells();
    if (!hasChainCaptures || !movedPiece) return;
    selectPiece(movedPiece);
  };
  return (
    <BoardContainer>
      <BoardSvg />
      {
                boardPieces.map((piece) => (
                  <BoardPiece
                    piece={piece}
                    select={() => selectPiece(piece)}
                  />
                ))
            }
      {
                highlightedCells.map((position) => <HighlightedCell position={position} />)
            }
      {
                availableMoves.map((move) => (
                  <PossibleMove
                    onClick={() => movePiece(move)}
                    position={move.to}
                  />
                ))
            }
    </BoardContainer>
  );
}

export default Board;
