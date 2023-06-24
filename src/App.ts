import * as PIXI from 'pixi.js';
import { Game } from './Game';
import { config } from './config';
export class App {
    readonly canvas: HTMLCanvasElement;
    readonly app: PIXI.Application;
    width = config.game_width;
    height = config.game_height;
    game: Game;
    constructor() {
        this.canvas = document.querySelector('#app') as HTMLCanvasElement;
        this.app = new PIXI.Application({
            view: this.canvas,
            width: this.width,
            height: this.height,
            backgroundColor: 0x00dd00
        });
        this.game = new Game(this.app);
        this.app.stage.addChild(this.game);
    }
}
