import React, {useState} from 'react';
import styled from 'styled-components';
import Piece from "../../Piece";
import {distanceBetweenCells, pieces} from "../../constants/board";
import getAvailableMoves from "../../gameLogic/checkersRules";
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
const PossibleMove = styled.span`
  position: absolute;
  bottom: ${props => props.destination.y * distanceBetweenCells}%;
  right:${props => props.destination.x * distanceBetweenCells}%;
  width: 13%;
  height: 13%;
  background: rgba(173, 216, 230, 0.4);
`;
const SvgBoard = () => {
    const selectCell = (cell) => {
        highlightCell(cell, true);
        setSelectedCell(cell);
        setAvailableMoves(getAvailableMoves(cell, boardPieces));
    }
    const getPieceLayout = () => {
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
    const [highlightedCells, setHighlightedCells] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [boardPieces, setBoardPieces] = useState(getPieceLayout());
    const highlightCell = (cell, clearOthers ) => {
        const newHighlightedCells = clearOthers ? [cell] : [...highlightedCells, cell];
        setHighlightedCells(newHighlightedCells);
    };
    const movePiece = (move, piece = selectedCell) => {
        let pieces = boardPieces.filter(p => p !== piece);
        if (move.capturedPiece) {
            pieces = pieces.filter(p => p !== move.capturedPiece);
        }
        setBoardPieces([...pieces, { ...selectedCell, destination: move.coordinates }]);
        highlightCell({ destination: move.coordinates });
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