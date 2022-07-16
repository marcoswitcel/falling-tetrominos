
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

const urlParams = new URLSearchParams(window.location.search);

export const AppConfig = {
    devMode: urlParams.get('devMode') === 'true',
    debugInfoOn: urlParams.get('debugInfoOn') === 'true',
}

export default {
    ArenaConfig,
    AppConfig
}
