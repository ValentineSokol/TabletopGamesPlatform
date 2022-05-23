import styled from 'styled-components';
import { Position, Side } from 'checkersrules';
import { distanceBetweenCells } from '../../constants/board';

interface HighlightedCellProps {
    position: Position
    side: Side
}
export const HighlightedCell = styled.span`
  cursor: pointer;
  position: absolute;
  bottom: ${(props: HighlightedCellProps) => props.position.y * distanceBetweenCells}%;
  right:${(props: HighlightedCellProps) => props.position.x * distanceBetweenCells}%;
  width: 13%;
  height: 13%;
  background: rgba(119, 198, 110, 0.4);
`;
export const PossibleMove = styled(HighlightedCell)`
  background: rgba(173, 216, 230, 0.4);
`;
