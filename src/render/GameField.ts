import * as PIXI from 'pixi.js';
import { Scene } from './Scene';
import FieldCell from './FieldCell';
import { config } from '../config';
import GameField from '../GameField';
import { CELL_VALUE, TURN } from '../Types';
import { ASSETS } from '../assets';

export default class MainScene extends Scene {
    gameField: GameField;
    gridBg!: PIXI.Sprite;
    fieldCells: FieldCell[] = [];

    containerFiled!: PIXI.Container;
    textCrossWin!: PIXI.BitmapText;
    textZeroWin!: PIXI.BitmapText;

    inputEnabled = true;
    constructor(app: PIXI.Application) {
        super(app);
        this.gameField = new GameField();

        this.containerFiled = new PIXI.Container();
        this.addChild(this.containerFiled);
        this.containerFiled.position.set(630, 225);

        this.drawBg();
        this.drawCells();
        this.drawWinSprites();
        this.syncField();
        this.start();
    }

    async setHighlihtWinline(winline: number[]): Promise<void> {
        const promisesAnimEnd: Array<Promise<void>> = [];
        this.fieldCells.forEach((cell, index) => {
            if (winline.length === 0) {
                cell.setHighlighted(false);
                cell.stopAnims();
                return;
            }
            if (winline.includes(index)) {
                cell.setHighlighted(true);
                promisesAnimEnd.push(cell.playAnimWin());
            }
        });
        await Promise.all(promisesAnimEnd);
    }
    setWinTitle(player: CELL_VALUE): void {
        this.textCrossWin.visible = player === TURN.X;
        this.textZeroWin.visible = player === TURN.O;
    }

    syncField() {
        this.fieldCells.forEach((cell, index) => {
            cell.setMark(this.gameField.marks[index]);
        });
    }
    onMarkClick: (cellIndex: number) => void = () => {};
    start = async () => {
        this.gameField.setTurn(this.gameField.startTurn);
        while (true) {
            let cell: FieldCell;
            if (this.gameField.turn === this.gameField.startTurn) {
                const index = await new Promise<number>((resolve) => {
                    this.onMarkClick = resolve;
                });
                cell = this.fieldCells[index];
            } else {
                const index = this.gameField.aiTurn();
                cell = this.fieldCells[index];
            }
            this.syncField();
            this.gameField.toggleTurn();
            await cell.playAnimDraw();

            const win = this.gameField.checkWin();
            if (win || this.gameField.checkDraw()) {
                this.setWinTitle(win);
                await this.setHighlihtWinline(this.gameField.winline);
                this.reset();

                setTimeout(this.start, 100);
                break;
            }
        }
    };
    reset(): void {
        this.gameField.reset();
        this.syncField();
        this.setWinTitle(null);
        this.setHighlihtWinline([]);
    }
    drawBg(): void {
        this.gridBg = new PIXI.Sprite(ASSETS['playfield']);
        this.gridBg.position.set(0, 0);
        this.containerFiled.addChild(this.gridBg);
    }
    drawCells(): void {
        const width = config.game_field_width;
        const height = config.game_field_height;
        for (let i = 0; i < width * height; i++) {
            const cell = new FieldCell(i, (cellIndex: number) => {
                const result = this.gameField.setMarkCell(cellIndex);
                if (result) this.onMarkClick(cellIndex);
            });
            cell.position.set(
                (i % width) * (config.game_field_cell_size + config.game_field_cell_gap),
                Math.floor(i / width) * (config.game_field_cell_size + config.game_field_cell_gap)
            );
            this.fieldCells.push(cell);
            this.containerFiled.addChild(cell);
        }
    }
    drawWinSprites(): void {
        this.textCrossWin = new PIXI.BitmapText('Cross Wins', { fontName: 'darkFont', fontSize: 100 });
        this.textZeroWin = new PIXI.BitmapText('Circle Wins', { fontName: 'lightFont', fontSize: 100 });

        [this.textCrossWin, this.textZeroWin].forEach((text) => {
            text.position.set(config.game_width / 2, 105);
            text.visible = false;
            text.anchor.set(0.5, 0.5);
            this.addChild(text);
        });
    }
}
