import { CELL_VALUE, TURN } from './Types';
import { config } from './config';
import * as PIXI from 'pixi.js';

export default class GameField extends PIXI.utils.EventEmitter {
    marks: CELL_VALUE[] = new Array(9).fill(null);
    startTurn: TURN = TURN.X;
    turn: TURN = TURN.X;
    winner: CELL_VALUE = null;
    winline: number[] = [];
    constructor() {
        super();
        this.setTurn(this.startTurn);
    }
    setTurn(turn: TURN): void {
        this.turn = turn;
    }
    aiTurn(): number {
        const emptyCells = this.marks.reduce((acc, mark, index) => {
            if (mark === null) {
                acc.push(index);
            }
            return acc;
        }, [] as number[]);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        this.setMarkCell(emptyCells[randomIndex]);
        return emptyCells[randomIndex];
    }
    toggleTurn(): void {
        this.turn = this.turn === TURN.X ? TURN.O : TURN.X;
        this.emit('update');
    }
    setMarkCell(index: number): boolean {
        if (index < 0 || index >= this.marks.length) {
            throw new Error('Invalid cell index');
        }
        if (this.marks[index] !== null) {
            return false;
        }
        this.marks[index] = this.turn;
        this.emit('update');
        return true;
    }
    checkWin(): CELL_VALUE {
        const winlines = config.winlines;

        for (let i = 0; i < winlines.length; i++) {
            const [a, b, c] = winlines[i];
            if (this.marks[a] !== null && this.marks[a] === this.marks[b] && this.marks[a] === this.marks[c]) {
                this.winner = this.marks[a];
                this.winline = [a, b, c];
                return this.marks[a];
            }
        }
        return null;
    }
    checkDraw(): boolean {
        return this.marks.every((mark) => mark !== null);
    }
    reset(): void {
        this.marks.fill(null);
        this.winner = null;
        this.winline = [];
        this.emit('update');
    }
}
