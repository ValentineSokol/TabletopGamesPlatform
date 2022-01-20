import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import BoardCell from "../BoardCell/BoardCell";
import SvgBoard from "../SvgBoard";
/*
 This component is responsible for drawing the game position at any time in the game.
*/

const BoardContainer = styled.div`
  display: flex;
  margin:  auto;
  flex-direction: row;
`;
const BoardRow = styled.div`
    background: sandybrown;
    margin: 0;
    padding: 0;
`;
const GameBoard = ({ board }) => {
    return <SvgBoard />;
    //   return  <BoardContainer>{board.map((rows, i) => <BoardRow>{ rows.map(cell => <BoardCell key={cell.name} cell={cell} />)}</BoardRow> )}</BoardContainer>
};
GameBoard.propTypes = {
          board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
          piece: PropTypes.oneOf('white', 'black'),
          isHostingKingPiece: PropTypes.bool,
          color: PropTypes.oneOf('white', 'black'),
          name: PropTypes.string
      }))).isRequired,
      highlightedCell: PropTypes.string,
      highlightColor: PropTypes.string,
      moves: PropTypes.arrayOf(PropTypes.shape({ from: PropTypes.string, to: PropTypes.string })).isRequired,
      currentMoveIndex: PropTypes.number.isRequired,
};
export default GameBoard;