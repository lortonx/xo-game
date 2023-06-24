export enum TURN {
    X = 'X',
    O = 'O'
}

export type CELL_VALUE = TURN.X | TURN.O | null;

export enum GAME_STATUS {
    PLAYING,
    ENDED,
    X_WIN,
    O_WIN
}

export enum GAME_STATE {
    ANIM_PLAY
}
