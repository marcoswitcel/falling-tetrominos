
/**
 * @param {number} width 
 * @param {number} height 
 * @param {HTMLElement} appendTo 
 * @returns {HTMLCanvasElement}
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

export function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}
