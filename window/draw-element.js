import { rgba } from '../colors.js';
import { drawRect, drawMonospaceText } from '../draw.js';
import { Percentage } from './window.js';

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

    drawRect(ctx, offsetX, offsetY, computeWidth(rootNode), computeHeight(rootNode), rootNode.style.color);

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
        offsetY += computeHeight(child) + child.style.margin.top + child.style.margin.bottom;
    }
}

/**
 * @param {NodeElement} nodeElement
 * @returns {number} Valor computado para a propriedade `width`
 */
export function computeWidth(nodeElement) {
    const width = nodeElement.style.width;
    if (typeof width === 'number') {
        return width;
    }

    if (width instanceof Percentage) {
        return (+width / 100) * computeWidth(nodeElement.parent) - nodeElement.parent.style.padding.left - nodeElement.parent.style.padding.right;
    }

    return 0;
}

/**
 * @param {NodeElement} nodeElement
 * @returns {number} Valor computado para a propriedade `height`
 */
export function computeHeight(nodeElement) {
    const height = nodeElement.style.height;
    if (typeof height === 'number') {
        return height;
    }

    if (height instanceof Percentage) {
        return (+height / 100) * computeHeight(nodeElement.parent) - nodeElement.parent.style.padding.left - nodeElement.parent.style.padding.right;
    }

    if (height === 'auto') {
        if (nodeElement.type === 'text') {
            let innerHeight = nodeElement.style.padding.top + nodeElement.style.padding.bottom;
            /** @type {{ value: string, preprocessedText: string[] }} */
            const data = nodeElement.data;
            if (!data.preprocessedText) {
                data.preprocessedText = (`${data.value}`).split('\n');
            }
            const letterPerLine = computeWidth(nodeElement.parent) / nodeElement.style.size | 0;
            let lines = 0;
            for (const line of data.preprocessedText) {
                lines += Math.ceil(line.length / letterPerLine);
            }
            return innerHeight + lines * nodeElement.style.size;
        } else {
            let innerHeight = nodeElement.style.padding.top + nodeElement.style.padding.bottom;
            for (const child of nodeElement.children) {
                innerHeight += child.style.margin.top + child.style.margin.bottom + computeHeight(child);
            }
            return innerHeight;
        }
    }

    return 0;
}
