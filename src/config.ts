import { TURN } from './Types';
import { pad } from './utils';

export const config = {
    game_width: 1920,
    game_height: 1080,

    game_field_width: 3,
    game_field_height: 3,
    game_field_cell_size: 202,
    game_field_cell_gap: 17,

    anim_win_loop_count: 4,
    winlines: [
        [0, 1, 2], // horizontal
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // vertical
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // diagonal
        [2, 4, 6]
    ],
    symbols_static: {
        [TURN.X]: 'cross',
        [TURN.O]: 'circle'
    },
    symbols_draw: {
        [TURN.X]: Array.from({ length: 20 }, (v, i) => 'cross-draw_' + pad(i, 2)),
        [TURN.O]: Array.from({ length: 20 }, (v, i) => 'circle-draw_' + pad(i, 2))
    },
    symbols_win: {
        [TURN.X]: Array.from({ length: 30 }, (v, i) => 'cross-win_' + pad(i, 2)),
        [TURN.O]: Array.from({ length: 30 }, (v, i) => 'circle-win_' + pad(i, 2))
    },
    symbols_spines: {
        [TURN.X]: [],
        [TURN.O]: []
    }
};
