import * as PIXI from 'pixi.js';

export const IMAGES_ASSETS: Record<string, string> = {
    bg: 'assets/sprites/bg.png',
    circle: 'assets/sprites/circle.png',
    cross: 'assets/sprites/cross.png',
    playfield: 'assets/sprites/playfield.png',
    win_highlight: 'assets/sprites/win_highlight.png'
};

export const FONTS_ASSETS: Record<string, string> = {
    darkFont: 'assets/fonts/darkFont.fnt',
    lightFont: 'assets/fonts/lightFont.fnt'
};

export const ATLASES_ASSETS: Record<string, string> = {
    sequence: 'assets/atlases/sequence.json'
};

export const ASSETS: Record<string, PIXI.Texture> = {};
