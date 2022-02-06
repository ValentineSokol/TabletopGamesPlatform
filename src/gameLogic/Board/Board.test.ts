// eslint-disable-next-line import/extensions,import/no-unresolved
import Board from './Board';

describe('Board', () => {
  let board : Board;
  beforeEach(() => { board = new Board(); });
  describe('should give correct available moves for a selected piece', () => {
    it('when it is my move.', () => {
      expect.assertions(1);
      const targetPiecePos = { x: 3, y: 2 };
      const expectedAvailableMoves = [
        { from: { x: 3, y: 2 }, to: { x: 4, y: 3 } },
        { from: { x: 3, y: 2 }, to: { x: 2, y: 3 } },
      ];
      const piece = board.getPieceAtPosition(targetPiecePos);
      if (!piece) return;
      const actualAvailableMoves = board.selectPiece(piece);
      expect(actualAvailableMoves).toEqual(expectedAvailableMoves);
    });
  });
  describe('should move pieces correctly', () => {
    const from = { x: 3, y: 2 };
    const to = { x: 4, y: 3 };
    const move = { from, to };
    beforeEach(() => {

    });
    it('should move a piece to the target position', () => {
      const piece = board.getPieceAtPosition(from);
      if (!piece) return;

      const { movedPiece } = board.move(move);

      expect(movedPiece?.position).toEqual(to);
    });
    it.todo('a duplicate of the moved piece should not be left on a previous cell.');
  });
});
