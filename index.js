//@ts-check
import { AppConfig, ArenaConfig } from './config.js';
import { Ticker } from './ticker.js';
import { TetrisShell } from './tetris-core.js';
import { StorageUtility } from './storage.js';

main: {
    const storage = new StorageUtility('tetris-config');
    let config = (AppConfig.devMode) ? ArenaConfig : storage.getItemWithInialization('config', ArenaConfig);
    const tetrisShell = new TetrisShell(config, AppConfig.debugInfoOn);
    
    tetrisShell.setup();
    
    new Ticker(tetrisShell).start();
}