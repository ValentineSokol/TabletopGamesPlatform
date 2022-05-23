import React from 'react';
import styled from 'styled-components';
import {
  Position,
  Side,
  King,
  Piece as PieceType,
} from 'checkersrules';
import { distanceBetweenCells, pieceGraphics } from '../../constants/board';

interface PieceContainerProps {
    position: Position,
    side: Side,
    graphics: React.ReactSVGElement
}
interface PieceProps {
 piece: PieceType,
 select: () => void,
}

const PieceContainer = styled.div`
    cursor: pointer;
    z-index: 2;
    position: absolute;
    bottom: ${(props: PieceContainerProps) => props.position.y * distanceBetweenCells}%;
    right:${(props: PieceContainerProps) => props.position.x * distanceBetweenCells}%;
    width: 12%;
    height: 12%;
    background: ${(props: PieceContainerProps) => `url(${props.graphics})`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`;
function Piece({ piece, select } : PieceProps) {
  const getPieceGraphics = () : React.ReactSVGElement => {
    if (piece instanceof King) {
      return pieceGraphics[`${piece.side}King`];
    }
    return pieceGraphics[`${piece.side}Pawn`];
  };
  return (
    <PieceContainer
      position={piece.position}
      side={piece.side}
      graphics={getPieceGraphics()}
      onClick={select}
    />
  );
}

export default Piece;
