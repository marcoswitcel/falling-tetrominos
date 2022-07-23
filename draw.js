
/**
 * Desenha um retângulo em dado `CanvasRenderingContext2D`
 * @param {CanvasRenderingContext2D } ctx Contexto aonde o retângulo será
 * desenhado
 * @param {number} sx Posição no eixo `x` aonde o retângulo começa
 * @param {number} sy Posição no eixo `y` aonde o retângulo começa
 * @param {number} width Lagura do retângulo, define quandos pixels serão
 * coloridos no eixo `x`
 * @param {number} height Altura do retângulo, define quandos pixels serão
 * coloridos no eixo `y`
 * @param {import('./colors.js').RGBA | string} color Cor usada para colorir o
 * retângulo
 */
export function drawRect(ctx, sx, sy, width, height, color) {
    ctx.fillStyle = color.toString();
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
    ctx.fillStyle = color.toString();
    ctx.fillText(text, sx, sy);
}

/**
 * Desenha matrizes de duas dimensões preenchendo cada bloco com a cor provida
 * através do `colorMap`
 * @param {CanvasRenderingContext2D} ctx Contexto aonde será desenhada a matriz
 * @param {number[][]} matrix Matriz que será desenhada
 * @param {number} sx Posição inicial no eixo `x`
 * @param {number} sy Posição inicial no eixo `y`
 * @param {number} size Tamanhado de cada bloc, influenciará o tamanho final da
 * matriz desenhada
 * @param {import('./colors.js').RGBA[]} colorMap Mapa de cores para
 * cada número da matriz
 */
export function drawFilledMatrix(ctx, matrix, sx, sy, size, colorMap) {
    const darkenColorMap = colorMap.map(color => color.darken(0.2).toString());

    for (let row = matrix.length; row--;) {
        for (let col = matrix[row].length; col--;) {
            if (matrix[row][col]) {
                const color = colorMap[matrix[row][col]];
                const darkenColor = darkenColorMap[matrix[row][col]];
                // Área completa do quadrado, só as "bordas" não serão recoloridas
                ctx.fillStyle = darkenColor;
                ctx.fillRect(sx + col * size, sy + row * size, size, size);
                // Desenha o quadrado do centro, deixando só as bordas de fora
                ctx.fillStyle = color.toString();
                ctx.fillRect(sx + col * size + 1, sy + row * size + 1, size - 2, size -2);
            }
        }
    }
}
