import React from 'react';
import Circle from '../Styled/Circle';
import { PIECE_COLORS, PIECE_SIZES } from "../../constants/board";

const BoardPiece = (props) => {
    const pieceColors = PIECE_COLORS[props.color];
    return (
      <Circle radius={PIECE_SIZES.base} color={pieceColors.base}>
          <Circle radius={PIECE_SIZES.top} color={pieceColors.top} />
      </Circle>
    );
};

export default BoardPiece;