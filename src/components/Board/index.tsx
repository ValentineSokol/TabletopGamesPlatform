import React, {useRef, useState} from 'react';
import styled from 'styled-components';
import BoardPiece from "../Piece/Piece";
import GameManager, {Move, Position} from "../../gameLogic/GameManager";
// @ts-ignore
import { ReactComponent as BoardSvg } from '../../assets/svgs/board.svg';
import { Piece } from '../../gameLogic/GameManager';
import { HighlightedCell, PossibleMove } from "../styled/BoardCells";

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
const Board = () => {
    const gameManager = useRef(new GameManager());

    const selectPiece = (piece : Piece) => {
        const availableMoves = gameManager.current.board.selectPiece(piece);
        availableMoves.forEach(move => highlightCell(move.from))
        setAvailableMoves(availableMoves);
    }
    const [highlightedCells, setHighlightedCells] = useState<Position[]>([]);
    const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
    const [boardPieces, setBoardPieces] = useState<Piece[]>(gameManager.current.board.pieces);
    const clearHighlightedCells = () => setHighlightedCells([]);
    const highlightCell = (position: Position) => {
        if (highlightedCells.includes(position)) return;
        const newHighlightedCells = [...highlightedCells, position];
        setHighlightedCells(newHighlightedCells);
    };
    const movePiece = (move: Move) => {
        const { hasChainCaptures, movedPiece } = gameManager.current.move(move);
        setBoardPieces(gameManager.current.board.pieces);
        setAvailableMoves([]);
        clearHighlightedCells();
        if (!hasChainCaptures || !movedPiece) return;
        selectPiece(movedPiece);
    };
    return (
        <BoardContainer>
            <BoardSvg />
            {
                boardPieces.map(piece => <BoardPiece piece={piece} select={() => selectPiece(piece)} />)
            }
            {
                highlightedCells.map(position => <HighlightedCell position={position} /> )
            }
            {
                availableMoves.map(move => <PossibleMove onClick={() => movePiece(move)} position={move.to} />)
            }
        </BoardContainer>
    );
};

export default Board;