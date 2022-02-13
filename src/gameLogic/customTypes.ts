// eslint-disable-next-line no-shadow
export enum Side {
    // eslint-disable-next-line no-unused-vars
    WHITE = 'white',
    // eslint-disable-next-line no-unused-vars
    BLACK = 'black'
}
// eslint-disable-next-line no-shadow
export enum GameOutcome {
    // eslint-disable-next-line no-unused-vars
    PENDING,
    // eslint-disable-next-line no-unused-vars
    WHITE_VICTORY,
    // eslint-disable-next-line no-unused-vars
    BLACK_VICTORY,
    // eslint-disable-next-line no-unused-vars
    DRAW,
}

export type Diagonal = {
    x: 1 | -1
    y: 1 | -1
}
