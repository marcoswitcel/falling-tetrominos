//@ts-check

import { Element, Node, NodeElement, nodeSet } from './window.js';
import { rgba } from '../colors.js';
import { drawRect, drawFilled, drawMonospaceText } from '../draw.js';
import { Event, EventTarget } from './event-target.js';
import { ArenaConfig } from '../config.js';
import { createCanvas } from '../util.js';

function runTest() {
    
    const { width, height } = ArenaConfig;

    const canvas = createCanvas(width + 300, height, document.body);
    canvas.style.margin = 'auto';
    canvas.style.display = 'block';
    const context = canvas.getContext('2d');
    let button = null;
    let text = null;
    const root = new NodeElement({
        type: 'window',
        style: {
            padding: [ 15 ],
            width: ArenaConfig.width + 300,
            height: ArenaConfig.height,
            margin: [ 0 ]
        },
        children: [
            new NodeElement({ type: 'button', style: { width: 350, height: 10 }, children: [] }),
            new NodeElement({ type: 'button', style: { width: 300, height: 'auto', color: rgba(255, 0, 0) }, children: [
                new NodeElement({
                    type: 'text',
                    style: { size: 16, height: 'auto' },
                    data: {
                        value: 'texto de teste\nteste nova linha\nlorem ipsum lorem ipsum lorem ipsum ipsum ipsum\nteste'
                    }
                }),
            ]}),
            new NodeElement({ type: 'button', style: { width: 25,  height: 10 }, children: [] }),
            new NodeElement({ type: 'button', style: { height: 10 }, children: [] }),
            button = new NodeElement({ type: 'button', style: { height: 'auto', margin: [ 10, 0, 0 ], padding: [ 5 ] }, children: [
                new NodeElement({
                    type: 'text',
                    style: { size: 16, height: 'auto' },
                    data: {
                        value: 'eu sou um botão'
                    }
                }),
            ]}),
            text = new NodeElement({
                type: 'text',
                style: { size: 16, height: 'auto' },
                data: {
                    value: '...'
                }
            }),
        ],
    });


    requestAnimationFrame(function update(timestamp) {
        // console.time('all');
        drawRect(context, 0, 0, ArenaConfig.width + 300, ArenaConfig.height, rgba(255, 255, 255));
        drawElement(context, root);
        requestAnimationFrame(update);
        // console.timeEnd('all');
    })


    root.addListener('click', (event) => {
        console.log(event, 'root');
    });

    button.addListener('click', (event) => {
        console.log(event, 'button');
        // event.defaultPrevented = true;
    });

    // root.dispatchEvent('click', { x: 0, y: 0});
    button.dispatchEvent('click', { x: 1, y: 1});

    canvas.addEventListener('click', (event) => {
        text.data.value = `x: ${event.offsetX}\n y: ${event.offsetY}`;
        text.data.preprocessedText = null;
    });
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {NodeElement} rootNode
 * @param {number[]} [offset]
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


runTest();