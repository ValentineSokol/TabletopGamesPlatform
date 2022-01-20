import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { PIECE_COLORS } from "../../constants/board";
import BoardPiece from "../BoardPiece/BoardPiece";

/*
    This component is responsible for drawing a single cell of the game board.
 */

const CellView = styled.div`
  background: ${props => props.cell.color};
  width: 3vw;
  height: 3vw;
  margin: 0;
  padding: 0;
`;

const BoardCell = (props) => {
    return <CellView cell={props.cell}>
        {props.cell.piece && <BoardPiece {...props.cell.piece} />}
    </CellView>;
};

BoardCell.propTypes = {
    cell: PropTypes.shape({
        occupiedBy: PropTypes.oneOf(0, 1, 2),
        isHostingKingPiece: PropTypes.bool,
        color: PropTypes.oneOf('white', 'black'),
        name: PropTypes.string
    }).isRequired,
    highlightedCell: PropTypes.string,
    highlightColor: PropTypes.string
}
export default BoardCell;