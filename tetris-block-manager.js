
/**
 * @typedef {Readonly<{ code: number, matrix: number[][]}>} Tetromino
 */

export class TetrisBlockManager {

    /**
     * @returns {Tetromino}
     */
    static getRandomBlockMatrix() {
        const blocks = ['T', 'L', 'I', 'B', 'J', 'Z', 'ZI'];
        return JSON.parse(
            JSON.stringify(
                this[blocks[blocks.length * Math.random() | 0]]
            )
        );
    }

    /**
     * @private
     * @readonly
     * @type {Tetromino}
     */
    static T = {
        code: 1,
        matrix: [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ],
    };

    /**
     * @private
     * @readonly
     * @type {Tetromino}
     */
    static L = {
        code: 2,
        matrix: [
            [0, 0, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 2, 0],
        ],
    };


    /**
     * @private
     * @readonly
     * @type {Tetromino}
     */
    static I = {
        code: 3,
        matrix: [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 0],
        ],
    };

    /**
     * @private
     * @readonly
     * @type {Tetromino}
     */
    static B = {
        code: 4,
        matrix: [
            [4, 4],
            [4, 4],
        ],
    };

    /**
     * @private
     * @readonly
     * @type {Tetromino}
     */
    static J = {
        code: 5,
        matrix: [
            [0, 5],
            [0, 5],
            [5, 5],
        ],
    };

    /**
     * @private
     * @readonly
     * @type {Tetromino}
     */
    static Z = {
        code: 6,
        matrix: [
            [6, 6, 0],
            [0, 6, 6],
        ],
    };

    /**
     * @private
     * @readonly
     * @type {Tetromino}
     */
    static ZI = {
        code: 7,
        matrix: [
            [0, 7, 7],
            [7, 7, 0],
        ],
    };
}
