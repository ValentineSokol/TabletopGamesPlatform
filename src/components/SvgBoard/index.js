import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import Piece from "../../Piece";
import {distanceBetweenCells, pieces} from "../../constants/board";
import GameManager from "../../gameLogic/GameManager";

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
const HighlightedCell = styled.span`
  position: absolute;
  bottom: ${props => props.destination.y * distanceBetweenCells}%;
  right:${props => props.destination.x * distanceBetweenCells}%;
  width: 13%;
  height: 13%;
  background: rgba(119, 198, 110, 0.4);
`;
const PossibleMove = styled(HighlightedCell)`
  background: rgba(173, 216, 230, 0.4);
`;
const SvgBoard = () => {
    const gameManager = useRef(new GameManager());

    const selectCell = (cell) => {
        highlightCell(cell, true);
        setSelectedCell(cell);
        setAvailableMoves(gameManager.current.getAvailableMoves(cell, boardPieces));
    }
    const [highlightedCells, setHighlightedCells] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [boardPieces, setBoardPieces] = useState(gameManager.current.piecesOnBoard);
    useEffect(() => {
        const availableCaptures = gameManager.current.getAvailableMoves(selectedCell, boardPieces).filter(m => m.capturedPiece);
        if (availableCaptures.length) setAvailableMoves(availableCaptures)
    }, [selectedCell, boardPieces])
    const highlightCell = (cell, clearOthers ) => {
        const newHighlightedCells = clearOthers ? [cell] : [...highlightedCells, cell];
        setHighlightedCells(newHighlightedCells);
    };
    const movePiece = (move, piece = selectedCell) => {
        gameManager.current.move(piece, move);
        setBoardPieces(gameManager.current.piecesOnBoard);
        setAvailableMoves([]);
        highlightCell({ destination: move.coordinates });
       // setSelectedCell(pieceAfterMove);
    };
    return (
        <BoardContainer>
        <svg style={{ width: '100%', height: '100%' }}
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="crispEdges"
            viewBox="0 0 8 8"
        >
            <g id="a">
                <g id="b">
                    <g id="c">
                        <g id="d">
                            <path id="e" fill="#f0d9b5" d="M0 0H1V1H0z"/>
                            <use x="1" y="1" href="#e" />
                            <path id="f" fill="#b58863" d="M0 1H1V2H0z"/>
                            <use x="1" y="-1" href="#f" />
                        </g>
                        <use x="2" href="#d" />
                    </g>
                    <use x="4" href="#c" />
                </g>
                <use y="2" href="#b" />
            </g>
            <use y="4" href="#a" />
        </svg>
            {
                boardPieces.map(props => <Piece {...props} select={() => selectCell(props)} />)
            }
            {
                highlightedCells.map(piece => <HighlightedCell destination={piece.destination} /> )
            }
            {
                availableMoves.map(move => <PossibleMove onClick={() => movePiece(move)} destination={move.coordinates} />)
            }
        </BoardContainer>
    );
};

export default SvgBoard;