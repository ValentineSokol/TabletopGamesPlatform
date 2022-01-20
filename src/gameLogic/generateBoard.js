const rowLetters = 'ABCDEFGH';

export default () => {
    const calculateCellColor = (i, j) => {
        if (i % 2) {
            return j % 2? 'black' : 'white';
        }
        return j % 2? 'white' : 'black';
    }
    const board = [];

    for (let i = 0; i < 8; i += 1) {
        const rowLetter = rowLetters[i];
        const row = [];
        for (let j = 0; j < 8; j += 1) {
            const cell = {};
            row.push(cell);
            cell.color = calculateCellColor(i, j);
            cell.coordinates = `${rowLetter}${j + 1}`;
            cell.indices = [i, j];
            if (cell.color === 'white') continue;
            if (j <= 2) cell.piece = { color: 'white', isKing: false };
            if (j >= 5) cell.piece = { color: 'black', isKing: false };

        }
        board.push(row);
    }
    return board;
}