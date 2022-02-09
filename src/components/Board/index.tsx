import React, { useRef, useState } from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/extensions,import/no-unresolved
import BoardPiece from '../Piece/Piece';
// eslint-disable-next-line import/extensions,import/no-unresolved
import GameManager from '../../gameLogic/Board/Board';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Move, Side } from '../../gameLogic/customTypes';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Piece from '../../gameLogic/Pieces/Piece';
// eslint-disable-next-line import/extensions,import/no-unresolved
import Position from '../../gameLogic/Position/Position';
// @ts-ignore
import { ReactComponent as BoardSvg } from '../../assets/svgs/board.svg';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { HighlightedCell, PossibleMove } from '../styled/BoardCells';

const BoardBorder = styled.div`
  width: 25%;
  height: 25%;
  margin: 5% auto;
  padding: .8%;
  background: black;
  border-radius: 10px;
  @media (max-width: 850px) {
    width: 80%;
    height: 80%;
  }
`;
const BoardContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 5% auto;
  transform: scaleY(1);
`;
function Board() {
  const gameManager = useRef(new GameManager());
  const [highlightedCells, setHighlightedCells] = useState<{ position: Position, side: Side}[]>([]);
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [boardPieces, setBoardPieces] = useState<readonly Piece[]>(gameManager.current.getPieces());

  const clearHighlightedCells = () => setHighlightedCells([]);
  const highlightCell = (position: Position, side: Side) => {
    const newHighlightedCells = [...highlightedCells, { position, side }];
    setHighlightedCells(newHighlightedCells);
  };
  const selectPiece = (piece : Piece) => {
    const moves = gameManager.current.selectPiece(piece);
    moves.forEach((move : Move) => highlightCell(move.from, piece.side));
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
    <BoardBorder>
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
                highlightedCells.map(
                  (data) => <HighlightedCell position={data.position} side={data.side} />,
                )
            }
        {
                availableMoves.map((move) => (
                  <PossibleMove
                    onClick={() => movePiece(move)}
                    side={Side.BLACK}
                    position={move.to}
                  />
                ))
            }
      </BoardContainer>
    </BoardBorder>
  );
}

export default Board;
