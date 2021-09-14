//@ts-check
import Config from './config.js';
import { Ticker } from './ticker.js';
import { TetrisShell } from './tetris-core.js';

main: {
    const tetrisShell = new TetrisShell(Config);
    
    tetrisShell.setup();
    
    new Ticker(tetrisShell).start();
}