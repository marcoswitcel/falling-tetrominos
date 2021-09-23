//@ts-check

import { Element, Node, NodeElement, nodeSet } from './window.js';
import { rgba } from './colors.js';
import { drawRect, drawFilled, drawMonospaceText } from './draw.js';

/**
 * 
 * @param {import('./tetris-core').TetrisShell} tetrisShell 
 */
export function runTest(tetrisShell) {
    
    // Teste 
    const context = tetrisShell.canvas.getContext('2d');
    const root = new NodeElement({
        type: 'window',
        style: {
            padding: [ 15 ],
            width: tetrisShell.config.width + 300,
            height: tetrisShell.config.height,
            margin: [ 0 ]
        },
        children: [
            new NodeElement({ type: 'button', style: { width: 350, height: 10 }, children: [] }),
            new NodeElement({ type: 'button', style: { width: 300, height: 'auto', color: rgba(255, 0, 0) }, children: [
                new NodeElement({
                    type: 'text',
                    style: { size: 16, height: 'auto' },
                    data: {
                        value: 'texto de teste\nteste nova linha\nlorem ipsum lorem ipsum lorem ipsum\nteste'
                    }
                }),
            ]}),
            new NodeElement({ type: 'button', style: { width: 25,  height: 10 }, children: [] }),
            new NodeElement({ type: 'button', style: { height: 10 }, children: [] }),
        ],
    });

    drawElement(context, root);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {NodeElement} rootNode 
 */
function drawElement(ctx, rootNode, offset = [0, 0]) {
    let [ offsetX, offsetY ] = offset;

    // Offset com a margin do próprio elemento
    offsetX += rootNode.style.margin.left;
    offsetY += rootNode.style.margin.top;
    
    drawRect(ctx, offsetX, offsetY, rootNode.width, rootNode.height, rootNode.style.color);

    // Novo offset com o padding
    offsetX += rootNode.style.padding.left;
    offsetY += rootNode.style.padding.top;

    for (const child of rootNode.children) {
        drawElement(ctx, child, [ offsetX, offsetY ]);
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