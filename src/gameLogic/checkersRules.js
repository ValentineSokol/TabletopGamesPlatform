import { pieces } from "../constants/board";

const getAvailableMoves = (piece, piecesOnBoard) => {
  if (!piece) return [];
  let result = [];
  const isPawn = () => piece.piece.includes('Pawn');
  const isWhitePiece = (target = piece) => target.piece.includes('white');
  const getPiece = (x, y) => piecesOnBoard.find(p => p.destination?.x === x && p.destination?.y === y )
  const getDiagonalCells = (x, y, diagonal, maxSteps) => {
        const result = [];
        let currentStep = 0;
        let startX = x;
        let startY = y;
        while((startX >= 0 && startX <= 7)) {
            if (maxSteps && currentStep >= maxSteps) return result;
            result.push({ x: Math.min(startX += diagonal.x, 7), y: Math.min(startY += diagonal.y, 7)});
            currentStep += 1;
        }
        return result;
  };
  const getCaptureMoves = ({ x, y }) => {
      const diagonals = [
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: 1 }
      ];
      let possibleCaptures = [];
      diagonals.forEach((diagonal) => {
            const isWhite = isWhitePiece(getPiece(x, y));

            const cells = getDiagonalCells(x, y, diagonal);
            const [nextCell, firstCellAfterPiece] = cells;
            if (!getPiece(nextCell.x, nextCell.y) || isWhite === isWhitePiece(getPiece(nextCell.x, nextCell.y))) return;
            const vacantCellsAfterPiece = cells.slice(1).filter(c => !getPiece(c.x, c.y));
            if (!isPawn()) {
                possibleCaptures = [...possibleCaptures, ...vacantCellsAfterPiece.map(c => ({ coordinates: c, capturedPiece: getPiece(nextCell.x, nextCell.y) }))];
                return;
            }
            if (!vacantCellsAfterPiece.includes(firstCellAfterPiece)) return;
            possibleCaptures.push({ coordinates: firstCellAfterPiece, capturedPiece: getPiece(nextCell.x, nextCell.y)});
      })
      return possibleCaptures;
  }
  const isValidMove = ({ x, y }) => (x >= 0 && x <= 7) && !getPiece(x, y);

    let totalCaptures = new Map();
    piecesOnBoard.forEach(piece => {
        const possibleCapturesForPiece = getCaptureMoves(piece.destination);
        if (!possibleCapturesForPiece.length) return;
        totalCaptures.set(piece, possibleCapturesForPiece);
    });

  if (isPawn()) {
      let moves = [];
      if (totalCaptures.size && !totalCaptures.get(piece)) return [];
      if (totalCaptures.get(piece)) return totalCaptures.get(piece);
      const pawnMoveDiagonals = [
          { x: 1, y: isWhitePiece() ? 1 : -1 },
          { x: -1, y: isWhitePiece() ? 1 : -1 }
      ]
      pawnMoveDiagonals.forEach((diagonal) => {
          moves = [...moves, ...getDiagonalCells(piece.destination.x, piece.destination.y, diagonal, 1)]
      });
      moves.forEach(move => {
          if (!isValidMove(move)) return;
          result.push({ coordinates: move });
      })
  }
  return result;
};

export default getAvailableMoves;