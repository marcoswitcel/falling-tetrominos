
/**
 * Cria um canvas com as dimensões especificadas e adiciona ele a algum elemnto
 * caso o parâmetro `appendTo` seja especificado
 * @param {number} width Largura inicial do canvas
 * @param {number} height Altura inicial do canvas
 * @param {HTMLElement} [appendTo] O elemento especificado através dessa propriedade
 * terá o canvas adicionado a sua lista de filhos
 * @return {HTMLCanvasElement} Canvas recém criado
 */
export function createCanvas(width, height, appendTo = null) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    if (appendTo) {
        appendTo.appendChild(canvas);
    }

    return canvas;
}

/**
 * Cria uma matrize bidimencional do tamanho especificado
 * @param {number} width largura da matriz
 * @param {number} height altura da matriz
 * @return {number[][]} a matriz recém criada preenchida com zeros
 */
export function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}
