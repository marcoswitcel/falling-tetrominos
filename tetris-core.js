
import { rgba } from './colors.js';
import { createCanvas, createMatrix } from './util.js';
import { drawRect, drawFilledMatrix, drawMonospaceText } from './draw.js';
import { TetrisBlockManager } from './tetris-block-manager.js';

class ARENA_STATE {
    /** @readonly Jogo rodando */
    static RUNNING = 0;
    /** @readonly Jogo pausado */
    static PAUSED = 1;
    /** @readonly Tela de fim de jogo */
    static ENDSCREEN = 2;
}

class FallingBlock {
    /**
     * Monta um objeto que representa um dado tetromino em queda.
     * @param {number} x posição no eixo horizontal
     * @param {number} y posição no eixo vertical
     * @param {{ code: number, matrix: number[][]}} blockMatrix 
     */
    constructor(x, y, blockMatrix) {
        /**
         * @type {number}
         */
        this.x = x;
        /**
         * @type {number}
         */
        this.y = y;
        /**
         * @readonly
         * @type {number}
         */
        this.code = blockMatrix.code;
        /**
         * @type {number[][]}
         */
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

/**
 * Função que checa se o espaço aonde o bloco que está caindo vai ser inserido
 * está de fato livre para inserção.
 * @param {number[][]} arena matriz que represente a arena
 * @param {FallingBlock} block Bloco que está sendo testado
 * @param {number} width largura da arena
 * @param {number} height altura da arena
 * @returns {boolean}
 */
function isFallingBlockInFreeSpace(arena, block, width, height) {
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

    /**
     * Método que reinicia a arena para uma nova partida
     * @return {void}
     */
    reset() {
        this.state = ARENA_STATE.RUNNING;
        this.filledMatrix = createMatrix(this.width, this.height); 
        this.arenaMatrix = createMatrix(this.width, this.height);
        this.newBlock(); // Inicializa primeiro bloco
        this.score = 0;
    }

    tryRotate(dir) {
        const oldMatrix = this.fallingBlock.matrix;
        this.fallingBlock.matrix = rotateMatrix(oldMatrix, dir);

        if (!isFallingBlockInFreeSpace(this.filledMatrix, this.fallingBlock, this.width, this.height)) {
            this.fallingBlock.matrix = oldMatrix;
        }
    }

    tryMove(dir) {
        const oldX = this.fallingBlock.x;
        this.fallingBlock.x += dir;

        if (!isFallingBlockInFreeSpace(this.filledMatrix, this.fallingBlock, this.width, this.height)) {
            this.fallingBlock.x = oldX;
        }
    }

    blockFall() {
        this.cumulatedTime = 0;
        this.fallingBlock.y++;
                
        if (isFallingBlockInFreeSpace(this.filledMatrix, this.fallingBlock, this.width, this.height)) {
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
        if (!isFallingBlockInFreeSpace(this.filledMatrix, this.fallingBlock, this.width, this.height)) {
            this.state = ARENA_STATE.ENDSCREEN;
        }
    }

    get colorMap() {
        return [
            rgba(0, 0, 0), // Não é usado geralmente
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
            drawFilledMatrix(context, arena.arenaMatrix, offsetLeft + 0, 0, blockSize, arena.colorMap);
            drawMonospaceText(context, 18, 5, 20, `score: ${arena.score}`, 'white');
            if (this.debugInfoOn) {
                drawMonospaceText(context, 18, 5, 40, `state: ${labels[arena.state]}`, 'white');
            }
            
            if (this.arena.state === ARENA_STATE.ENDSCREEN) {
                drawMonospaceText(context, 18, 5, 60, 'Fim de jogo', 'white');
            }

            // Desenhando instruções
            /**
             * @todo João, melhorar isso aqui
             */
            [ 
                'Movimento',
                '← → ↑ ↓',
                'Rotação',
                'q: ↻',
                'e: ↺',
                'r: reiniciar',
                'p: pausar/jogar',
            ].forEach((text, index) => {
                drawMonospaceText(context, 16, 7, height - 170 + index * 22, text, 'white');
            });
        }

        this.pipeline = [ arena.update, renderArena ];

        this.listen();
    }

    listen() {
        window.addEventListener('keydown', (event) => {

            if (event.key === 'p' && this.arena.state !== ARENA_STATE.ENDSCREEN) {
                this.arena.state = (this.arena.state === ARENA_STATE.RUNNING) ? ARENA_STATE.PAUSED : ARENA_STATE.RUNNING;
            }

            /**
             * @todo João, mover esse componente de prompt para dentro da UI da aplicação
             */
            if (event.key === 'r' &&
                window.confirm(
                    ARENA_STATE.ENDSCREEN === this.arena.state
                    ? 'Jogar mais uma partida?'
                    : 'Reiniciar partida?'
                )
            ) {
                this.arena.reset();
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
