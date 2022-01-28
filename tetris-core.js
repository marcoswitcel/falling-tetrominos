
import { rgba } from './colors.js';
import { createCanvas, createMatrix } from './util.js';
import { drawRect, drawFilled, drawMonospaceText } from './draw.js';

export class TetrisBlockManager {

    static getRandomBlockMatrix() {
        const blocks = [ 'T', 'L', 'I', 'B', 'J', 'Z', 'ZI' ];
        return JSON.parse(
            JSON.stringify(
                this[blocks[blocks.length * Math.random() | 0]]
            )
        );
    }

    static T = {
        code: 1,
        matrix: [
            [ 0, 0, 0 ],
            [ 1, 1, 1 ],
            [ 0, 1, 0 ],
        ],
    };

    static L = {
        code: 2,
        matrix: [
            [ 0, 0, 0, 0 ],
            [ 0, 2, 0, 0 ],
            [ 0, 2, 0, 0 ],
            [ 0, 2, 2, 0 ],
        ],
    };


    static I = {
        code: 3,
        matrix: [
            [ 0, 3, 0 ],
            [ 0, 3, 0 ],
            [ 0, 3, 0 ],
        ],
    };

    static B = {
        code: 4,
        matrix: [
            [ 4, 4 ],
            [ 4, 4 ],
        ],
    };

    static J = {
        code: 5,
        matrix: [
            [ 0, 5 ],
            [ 0, 5 ],
            [ 5, 5 ],
        ],
    };

    static Z = {
        code: 6,
        matrix: [
            [ 6, 6, 0 ],
            [ 0, 6, 6 ],
        ],
    };

    static ZI = {
        code: 7,
        matrix: [
            [ 0, 7, 7 ],
            [ 7, 7, 0 ],
        ],
    };
}

class ARENA_STATE {
    static RUNNING = 0;
    static PAUSED = 1;
    static ENDSCREEN = 2;
}

class FallingBlock {
    constructor(x, y, blockMatrix) {
        this.x = x;
        this.y = y;
        this.code = blockMatrix.code;
        this.matrix = blockMatrix.matrix;
    }
}

/**
 * 
 * @param {number[][]} arena 
 * @param {FallingBlock} block 
 */
function mergeArenaAndBlock(arena, block, width, height) {
    const mergedArena = createMatrix(width, height);
    // Copiando arena antiga
    for (let row = mergedArena.length; row--;) {
        for (let col = mergedArena[row].length; col--;) {
            mergedArena[row][col] =  arena[row][col];
        }
    }
    // Copiando falling block
    const blockMatrix = block.matrix;
    for (let row = blockMatrix.length; row--;) {
        for (let col = blockMatrix[row].length; col--;) {

            if (blockMatrix[row][col] !== 0) {
                const arenaRow = row + block.y;
                const arenaCol = col + block.x;
                if (arenaRow >= 0 && arenaRow < height &&
                    arenaCol >= 0 && arenaCol < width
                    ) {
                    mergedArena[arenaRow][arenaCol] =  blockMatrix[row][col];
                }

            }
        }
    }

    return mergedArena;
}

function IsFallingBlockInFreeSpace(arena, block, width, height) {
    const blockMatrix = block.matrix;
    for (let row = blockMatrix.length; row--;) {
        for (let col = blockMatrix[row].length; col--;) {
            if (blockMatrix[row][col] !== 0) {
                const arenaRow = row + block.y;
                const arenaCol = col + block.x;
                if (arenaRow >= height || arenaRow < 0 ||
                    arenaCol >= width || arenaCol < 0 ||
                    arena[arenaRow][arenaCol] !== 0)
                    {
                    return false;
                }
            }
        }
    }

    return true;
}

function rotateMatrix(matrix, dir) {
    const height = matrix.length;
    const width = matrix[0].length;

    const rotatedMatrix = createMatrix(height, width);

    for (let row = rotatedMatrix.length; row--;) {
        for (let col = rotatedMatrix[row].length; col--;) {
            rotatedMatrix[row][col] = matrix[(dir === -1) ? height - 1 - col : col][(dir === -1) ? row : width - 1 - row];
        }
    }

    return rotatedMatrix;
}

export class TetrisArena {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.state = ARENA_STATE.RUNNING;
        this.filledMatrix = createMatrix(width, height); 
        this.arenaMatrix = createMatrix(width, height);
        this.newBlock(); // Inicializa primeiro bloco
        this.score = 0;

        this.cumulatedTime = 0;
        this.update = (deltatime) => {
            this.cumulatedTime += deltatime;

            if (this.state !== ARENA_STATE.RUNNING) return;

            if (this.cumulatedTime > 1000) {
                this.blockFall();

            } else {
                this.arenaMatrix = mergeArenaAndBlock(this.filledMatrix, this.fallingBlock, this.width, this.height);
            }
        }
    }

    tryRotate(dir) {
        const oldMatrix = this.fallingBlock.matrix;
        this.fallingBlock.matrix = rotateMatrix(oldMatrix, dir);

        if (!IsFallingBlockInFreeSpace(this.filledMatrix, this.fallingBlock, this.width, this.height)) {
            this.fallingBlock.matrix = oldMatrix;
        }
    }

    tryMove(dir) {
        const oldX = this.fallingBlock.x;
        this.fallingBlock.x += dir;

        if (!IsFallingBlockInFreeSpace(this.filledMatrix, this.fallingBlock, this.width, this.height)) {
            this.fallingBlock.x = oldX;
        }
    }

    blockFall() {
        this.cumulatedTime = 0;
        this.fallingBlock.y++;
                
        if (IsFallingBlockInFreeSpace(this.filledMatrix, this.fallingBlock, this.width, this.height)) {
            this.arenaMatrix = mergeArenaAndBlock(this.filledMatrix, this.fallingBlock, this.width, this.height);
        } else {
            this.fallingBlock.y--;
            this.filledMatrix = mergeArenaAndBlock(this.filledMatrix, this.fallingBlock, this.width, this.height);
            this.clearAndComputeScore();
            this.newBlock();
            this.arenaMatrix = mergeArenaAndBlock(this.filledMatrix, this.fallingBlock, this.width, this.height);
        }
    }

    clearAndComputeScore() {
        let rowsCleared = 0 ;
        const newFilledMatrix = createMatrix(this.width, this.height);

        for (let row of this.filledMatrix) {
            if (!row.some(value => value === 0)) {
                rowsCleared++;
                row.fill(0);
            }
        }

        for (let row = this.filledMatrix.length,  rowNewFilled = this.filledMatrix.length - 1; row--;) {
            if (this.filledMatrix[row].some(value => value > 0)) {
                for (let col = this.filledMatrix[row].length; col--;) {
                    newFilledMatrix[rowNewFilled][col] =  this.filledMatrix[row][col];
                }
                rowNewFilled--;
            }
            
        }
        this.score += 15**rowsCleared;
        this.filledMatrix = newFilledMatrix;
    }

    newBlock() {
        const blockMatrix = TetrisBlockManager.getRandomBlockMatrix()
        const sx = (this.width /  2 | 0) - (blockMatrix.matrix[0].length / 2 | 0);
        const sy = 0;
        this.fallingBlock = new FallingBlock(sx, sy, blockMatrix);
        if (!IsFallingBlockInFreeSpace(this.filledMatrix, this.fallingBlock, this.width, this.height)) {
            this.state = ARENA_STATE.ENDSCREEN;
        }
    }

    get colorMap() {
        return [
            null,
            rgba(255, 0, 0),
            rgba(0, 255, 0),
            rgba(0, 0, 255),
            rgba(0, 255, 255),
            rgba(255, 0, 255),
            rgba(255, 255, 0),
            rgba(255, 255, 255),
        ];
    }
}

export class TetrisShell {

    constructor(config, debugInfoOn = false) {
        this.debugInfoOn = debugInfoOn;
        this.config = config;
        /** @type {HTMLCanvasElement} */
        this.canvas = null;
    }

    [Symbol.iterator] () {
        const length = this.pipeline.length;
        let i = 0;
        return {
            next: () => {
                return {
                    value: this.pipeline[i],
                    done: i++ === length,
                }
            }
        }
    }

    setup() {
        const { width, height, blockSize } = this.config;

        const canvas = createCanvas(width + 300, height, document.body);
        this.canvas = canvas;
        
        // Temporário
        // canvas.style.width = '60vw';
        canvas.style.margin = 'auto';
        canvas.style.display = 'block';
        const context = canvas.getContext('2d');
        const offsetLeft = 150;
        
        const arena = new TetrisArena(this.config.arena.x, this.config.arena.y);
        this.arena = arena;

        const labels = [];
        labels[ARENA_STATE.ENDSCREEN] = 'endscreen';
        labels[ARENA_STATE.PAUSED] = 'paused';
        labels[ARENA_STATE.RUNNING] = 'running';
        
        const renderArena = (deltaTime) => {
            drawRect(context, 0, 0, width + 300, height, rgba(255, 100, 200));
            drawRect(context, offsetLeft + 0, 0, width, height, rgba(0, 0, 0));
            drawFilled(context, arena.arenaMatrix, offsetLeft + 0, 0, blockSize, arena.colorMap);
            drawMonospaceText(context, 18, 5, 20, `score: ${arena.score}`, 'white');
            if (this.debugInfoOn) {
                drawMonospaceText(context, 18, 5, 40, `state: ${labels[arena.state]}`, 'white');
            }
        }

        this.pipeline = [ arena.update, renderArena ];

        this.listen();
    }

    listen() {
        window.addEventListener('keydown', (event) => {

            if (event.key === 'p') {
                this.arena.state = (this.arena.state === ARENA_STATE.RUNNING) ? ARENA_STATE.PAUSED : ARENA_STATE.RUNNING;
            }

            if (this.arena.state !== ARENA_STATE.RUNNING) return;

            if (event.key === 'q') {
                this.arena.tryRotate(-1);
            }

            if (event.key === 'e') {
                this.arena.tryRotate(1);
            }

            // <--
            if (event.keyCode === 37) {
                this.arena.tryMove(-1);
            }
            // -->
            if (event.keyCode === 39) {
                this.arena.tryMove(1);
            }
            // baixo
            if (event.keyCode === 40) {
                this.arena.blockFall();
            }
        })
    }
}
