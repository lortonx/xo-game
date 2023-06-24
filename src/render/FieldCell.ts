import * as PIXI from 'pixi.js';
import { CELL_VALUE, TURN } from '../Types';
import { config } from '../config';
import { ASSETS } from '../assets';

type ClickCallback = (cellIndex: number, cell: FieldCell) => void;

export default class FieldCell extends PIXI.Container {
    spriteMark: PIXI.Sprite;
    spriteHighlight: PIXI.Sprite;
    mark: CELL_VALUE = null;
    hovered = false;
    highlighted = false;
    cellIndex = 0;
    animDraw: PIXI.AnimatedSprite;
    animWin: PIXI.AnimatedSprite;
    clickCallback: ClickCallback;
    constructor(cellIndex: number, clickCallback: ClickCallback = () => {}) {
        super();
        this.cellIndex = cellIndex;
        this.clickCallback = clickCallback;
        this.spriteHighlight = new PIXI.Sprite(ASSETS['win_highlight']);
        this.addChild(this.spriteHighlight);

        this.spriteMark = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.spriteMark.anchor.set(0.5);
        this.spriteMark.position.set(config.game_field_cell_size / 2);
        this.addChild(this.spriteMark);

        this.animDraw = new PIXI.AnimatedSprite([PIXI.Texture.EMPTY]);
        this.animDraw.loop = false;
        this.animDraw.visible = false;
        this.addChild(this.animDraw);

        this.animWin = new PIXI.AnimatedSprite([PIXI.Texture.EMPTY]);
        this.animWin.loop = true;
        this.animWin.visible = false;
        this.addChild(this.animWin);

        this.setMark(TURN.O);
        this.updSpriteHighlight(false);
        this.setInteraction();
    }
    setInteraction() {
        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(0, 0, config.game_field_cell_size, config.game_field_cell_size);
        this.on('pointerover', () => {
            this.setHovered(true);
        });
        this.on('pointerout', () => {
            this.setHovered(false);
        });
        this.on('pointerdown', () => {
            this.clickCallback(this.cellIndex, this);
        });
    }
    setHovered(state: boolean) {
        this.hovered = state;
        this.updSpriteHighlight();
    }
    setHighlighted(state: boolean) {
        this.highlighted = state;
        this.updSpriteHighlight();
    }
    updSpriteHighlight(state: boolean = this.highlighted || this.hovered) {
        this.spriteHighlight.visible = state;
    }
    setMark(type: TURN | null) {
        this.stopAnims();
        if (type !== null) {
            this.mark = type;
            this.spriteMark.visible = true;
            this.spriteMark.texture = ASSETS[config.symbols_static[type]];
            this.animDraw.textures = config.symbols_draw[type].map((alias) => ASSETS[alias]);
            this.animWin.textures = config.symbols_win[type].map((alias) => ASSETS[alias]);
        } else {
            this.spriteMark.texture = PIXI.Texture.EMPTY;
            this.spriteMark.visible = false;
        }
    }
    playAnimDraw(): Promise<void> {
        this.spriteMark.visible = false;
        this.animDraw.visible = true;
        this.animDraw.play();

        return new Promise((resolve) => {
            this.animDraw.onComplete = () => {
                this.stopAnims();
                resolve();
            };
        });
    }
    playAnimWin(): Promise<void> {
        this.spriteMark.visible = false;
        this.animWin.visible = true;
        this.animWin.play();
        let loops = config.anim_win_loop_count;
        return new Promise((resolve) => {
            this.animWin.onLoop = () => {
                if (!--loops) {
                    this.stopAnims();
                    resolve();
                }
            };
        });
    }
    stopAnims() {
        this.animDraw.stop();
        this.animDraw.visible = false;

        this.animWin.stop();
        this.animWin.visible = false;

        this.spriteMark.visible = true;
    }
}
