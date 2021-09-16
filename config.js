//@ts-check

export const ArenaConfig = {
    /** @type {number} */
    width: null, // Computado abaixo (arena.x * blockSize)
    /** @type {number} */
    height: null, // Computado abaixo (arena.y * blockSize)
    arena: {
        x: 10,
        y: 20
    },
    blockSize: 30
}

ArenaConfig.width = ArenaConfig.arena.x * ArenaConfig.blockSize;
ArenaConfig.height = ArenaConfig.arena.y * ArenaConfig.blockSize;

export const AppConfig = {
    devMode: true,
}

export default {
    ArenaConfig,
    AppConfig
};