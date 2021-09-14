//@ts-check

const Config = {
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

Config.width = Config.arena.x * Config.blockSize;
Config.height = Config.arena.y * Config.blockSize;


export default Config;