//@ts-check

/**
 * 
 * @param {CanvasRenderingContext2D } ctx 
 * @param {number} sx 
 * @param {number} sy 
 * @param {number} width 
 * @param {number} height 
 * @param {import('./colors.js').RGBA | string} color 
 */
export function drawRect(ctx, sx, sy, width, height, color) {
    //@ts-expect-error
    ctx.fillStyle = color;
    ctx.fillRect(sx, sy, width, height);
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} size 
 * @param {number} sx 
 * @param {number} sy 
 * @param {string} text 
 * @param {import('./colors.js').RGBA | string} color 
 */
export function drawMonospaceText(ctx, size, sx, sy, text, color) {
    ctx.font = `${size}px monospace`;
    //@ts-expect-error
    ctx.fillStyle = color;
    ctx.fillText(text, sx, sy);
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number[][]} matrix 
 * @param {number} sx 
 * @param {number} sy 
 * @param {number} size 
 * @param {string[] | import('./colors.js').RGBA[]} colorMap 
 */
export function drawFilled(ctx, matrix, sx, sy, size, colorMap) {
    for (let row = matrix.length; row--;) {
        for (let col = matrix[row].length; col--;) {
            if (matrix[row][col]) {
                const color = colorMap[matrix[row][col]];
                //@ts-expect-error
                ctx.fillStyle = color;
                ctx.fillRect(sx + col * size, sy + row * size, size, size);
            }
        }
    }
}