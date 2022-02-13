import React, { useEffect } from 'react';
import styled from 'styled-components';
import MoveHistory from '../../gameLogic/MoveHistory/MoveHistory';

const Container = styled.div`
 color: white; 
 height: 100%;
 width: 15%;
 overflow: auto; 
 margin: 5% auto; 
 background: black;
 border-radius: 10px;
 display: grid; 
 grid-template-columns: repeat(2, 1fr);
 padding: .8%;
`;

interface MoveContainerProps {
  isHighlighted: boolean
}
const MoveContainer = styled.p`
  border-radius: 10px;
  ${(props : MoveContainerProps) => props.isHighlighted && 'background: forestgreen'}
`;

interface MoveHistoryComponentProps {
  history: MoveHistory,
  updateBoardPieces: () => void,
}
// @ts-ignore
function MoveHistoryComponent({ history, updateBoardPieces } : MoveHistoryComponentProps) {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code.includes('Arrow')) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft') {
        history.gotoPreviousMove();
        updateBoardPieces();
      }
      if (e.code === 'ArrowRight') {
        history.gotoNextMove();
        updateBoardPieces();
      }
      if (e.code === 'ArrowUp') {
        history.gotoFirstMove();
        updateBoardPieces();
      }
      if (e.code === 'ArrowDown') {
        history.gotoLastMove();
        updateBoardPieces();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
  return (
    <Container>
      {
        history.toBoardNotation().map(
          (move, index) => (
            <MoveContainer
              isHighlighted={index === history.getCurrentMoveIdx()}
            >
              {move}
            </MoveContainer>
          ),
        )
      }
    </Container>
  );
}

export default MoveHistoryComponent;
