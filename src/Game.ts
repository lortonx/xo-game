import * as PIXI from 'pixi.js';
import { ATLASES_ASSETS, IMAGES_ASSETS, ASSETS, FONTS_ASSETS } from './assets';
import Background from './Background';
import GameField from './render/GameField';

export class Game extends PIXI.Container {
    app: PIXI.Application;
    background!: Background;
    mainScene!: GameField;
    constructor(app: PIXI.Application) {
        super();
        this.app = app;
        this.loadAssets().then(this.initGame);
    }

    initGame = () => {
        this.background = new Background(this.app);
        this.addChild(this.background);

        this.mainScene = new GameField(this.app);
        this.addChild(this.mainScene);
    };

    loadAssets() {
        return new Promise((resolve) => {
            Object.entries(IMAGES_ASSETS).forEach(([alias, src]) => {
                PIXI.Loader.shared.add(alias, src, (resource) => {
                    if (resource.texture) {
                        ASSETS[alias] = resource.texture;
                    }
                });
            });

            Object.entries(ATLASES_ASSETS).forEach(([alias, src]) => {
                PIXI.Loader.shared.add(alias, src, (resource) => {
                    if (resource.textures) {
                        Object.entries(resource.textures).forEach(([alias, texture]) => {
                            ASSETS[alias] = texture;
                        });
                    }
                });
            });

            Object.entries(FONTS_ASSETS).forEach(([alias, src]) => {
                PIXI.Loader.shared.add(alias, src, (resource) => {
                    console.log(resource);
                });
            });

            PIXI.Loader.shared.load(resolve);
        });
    }
}
