import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import BoardPiece from '../Piece/Piece';
import MoveHistory from '../MoveHistory/MoveHistory';
import GameManager from '../../gameLogic/Board/Board';
import { Side } from '../../gameLogic/customTypes';
import Piece from '../../gameLogic/Pieces/Piece';
import Position from '../../gameLogic/Position/Position';
import Move from '../../gameLogic/Move/Move';
// @ts-ignore
import { ReactComponent as BoardSvg } from '../../assets/svgs/board.svg';
import { HighlightedCell, PossibleMove } from '../styled/BoardCells';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;
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
  const ws = useRef<WebSocket | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<{ position: Position, side: Side}[]>([]);
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [boardPieces, setBoardPieces] = useState<readonly Piece[]>(gameManager.current.getPieces());

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:5000/game');
    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);

      if (message.type === 'move') {
        gameManager.current.move(message.payload);
      }
    };
  }, []);
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

  function updateBoardPieces() {
    console.log('Updating pieces');
    setBoardPieces(gameManager.current.getPieces());
  }

  const movePiece = (move: Move) => {
    const { hasChainCaptures, movedPiece } = gameManager.current.move(move);
    updateBoardPieces();
    setAvailableMoves([]);
    clearHighlightedCells();
    if (!hasChainCaptures || !movedPiece) return;
    selectPiece(movedPiece);
  };

  return (
    <Container>
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
      <MoveHistory
        history={gameManager.current.moveHistory}
        updateBoardPieces={updateBoardPieces}
      />
    </Container>
  );
}

export default Board;
