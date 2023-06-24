import * as PIXI from 'pixi.js';
import { ASSETS } from './assets';

export default class Background extends PIXI.Container {
    app: PIXI.Application;
    sprite!: PIXI.Sprite;
    constructor(app: PIXI.Application) {
        super();
        this.app = app;
        this.createBackground();
    }
    createBackground(): void {
        this.sprite = new PIXI.Sprite(ASSETS['bg']);
        this.sprite.width = this.app.screen.width;
        this.sprite.height = this.app.screen.height;
        this.addChild(this.sprite);
    }
}
