import React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { distanceBetweenCells, pieceGraphics } from '../../constants/board';
// eslint-disable-next-line import/extensions,import/no-unresolved
import * as gameEntityTypes from '../../gameLogic/GameManager/GameManager';

interface PieceContainerProps {
    position: gameEntityTypes.Position,
    graphics: React.ReactSVGElement
}
interface PieceProps {
 piece: gameEntityTypes.Piece,
 select: () => void,

}
const PieceContainer = styled.div`
    cursor: pointer;
    z-index: 2;
    position: absolute;
    bottom: ${(props: PieceContainerProps) => props.position.y * distanceBetweenCells}%;
    right:${(props: PieceContainerProps) => props.position.x * distanceBetweenCells}%;
    width: 13%;
    height: 13%;
    background: ${(props: PieceContainerProps) => `url(${props.graphics})`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`;
function Piece({ piece, select } : PieceProps) {
  const getPieceGraphics = () : React.ReactSVGElement => {
    if (piece.isKing()) {
      return pieceGraphics[`${piece.side}King`];
    }
    return pieceGraphics[`${piece.side}Pawn`];
  };
  return (
    <PieceContainer
      position={piece.position}
      graphics={getPieceGraphics()}
      onClick={select}
    />
  );
}

export default Piece;
