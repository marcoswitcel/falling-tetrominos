import { rgba } from '../colors.js';
import { drawRect, drawMonospaceText } from '../draw.js';

/**
 * @typedef {import('./node-element.js').NodeElement} NodeElement
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {NodeElement} rootNode
 * @param {number[]} [offset]
 */
export function drawElement(ctx, rootNode, offset = [0, 0]) {
    let [offsetX, offsetY] = offset;

    // Offset com a margin do próprio elemento
    offsetX += rootNode.style.margin.left;
    offsetY += rootNode.style.margin.top;

    drawRect(ctx, offsetX, offsetY, rootNode.width, rootNode.height, rootNode.style.color);

    // Novo offset com o padding
    offsetX += rootNode.style.padding.left;
    offsetY += rootNode.style.padding.top;

    for (const child of rootNode.children) {
        if (child.style.display === 'none')
            continue;
        drawElement(ctx, child, [offsetX, offsetY]);
        if (child.type === 'text') {
            const data = child.data;
            let line = 1;
            for (const lines of data.preprocessedText) {
                drawMonospaceText(ctx, child.style.size, offsetX, offsetY + line * child.style.size - child.style.size * .3, lines, rgba(255, 255, 255));
                line++;
            }
        }
        offsetY += child.height + child.style.margin.top + child.style.margin.bottom;
    }
}
