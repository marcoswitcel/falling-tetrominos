//@ts-check

import { Element, Node, NodeElement, nodeSet, percentage } from './window.js';
import { rgba } from '../colors.js';
import { drawRect, drawFilled, drawMonospaceText } from '../draw.js';
import { Event, EventTarget } from './event-target.js';
// import { ArenaConfig } from '../config.js';
import { createCanvas } from '../util.js';
import viewMenu, { menuIDs }  from './views/menu.view.js';
import viewConfig, { configIDs }  from './views/config.view.js';
import { StorageUtility } from '../storage.js';

function runTest() {
    
    const width = 800;
    const height  = 500;

    const canvas = createCanvas(width, height, document.body);
    canvas.style.margin = 'auto';
    canvas.style.display = 'block';
    const context = canvas.getContext('2d');
    const  { button, text } = menuIDs;
    const root = new NodeElement({
        type: 'window',
        style: {
            padding: [ 15 ],
            width: width,
            height: height,
            margin: [ 0 ],
            color: rgba(0,0,0,0.1)
        },
        children: [
            viewMenu,
            viewConfig
        ],
    });

    const storage = new StorageUtility('window');
    menuIDs.addButtonText.data.value.count =  storage.getItemWithInialization('count', 0);


    requestAnimationFrame(function update(timestamp) {
        // console.time('all');
        drawRect(context, 0, 0, width, height, rgba(255, 255, 255));
        drawElement(context, root);
        requestAnimationFrame(update);
        // console.timeEnd('all');
    })

    test: {
        break test;
        root.addListener('click', (event) => {
            console.log(event.currentTarget.type, event.target.type, 'root');
        });
        root.addListener('click', (event) => {
            console.log(event.currentTarget.type, event.target.type, 'root2');
        });
    
        button.addListener('click', (event) => {
            console.log(event.currentTarget.type, event.target.type, 'button');
            // event.defaultPrevented = true;
        });

        root.dispatchEvent('click', { x: 0, y: 0});
        button.dispatchEvent('click', { x: 1, y: 1});

        root.addListener('click', ({ target }) => {
            root.appendChild(target);
        });
    }

    
    menuIDs.button.addListener('click', (event) => {
        viewMenu.style.display = 'none';
        viewConfig.style.display = 'block';
        console.log('menuIDs');
    });

    menuIDs.addButton.addListener('click', (event) => {
        let count = storage.getItem('count');
        count++;

        storage.setItem('count', count);
        menuIDs.addButtonText.data.value.count =  count;
        menuIDs.addButtonText.data.preprocessedText = null;
    });

    configIDs.button.addListener('click', (event) => {
        viewConfig.style.display = 'none';
        viewMenu.style.display = 'block';
        console.log('configIDs');
    });


    canvas.addEventListener('click', (event) => {
        const { offsetX : x, offsetY : y  } = event;
        text.data.value = `x: ${x}\n y: ${y}`;
        text.data.preprocessedText = null;

        const clickedElement = checkClickHit(root, x, y);

        if (clickedElement) {
            clickedElement.dispatchEvent('click', { x: 1, y: 1});
        }
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
        if (child.style.display === 'none') continue;
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

/**
 * 
 * @param {NodeElement} rootNode
 * @param {number} x 
 * @param {number} y 
 * @param {number[]} [offset]
 * 
 * @returns {NodeElement}
 */
function checkClickHit(rootNode, x, y, offset = [0, 0]) {
    let [ offsetX, offsetY ] = offset;

    // Offset com a margin do próprio elemento
    offsetX += rootNode.style.margin.left;
    offsetY += rootNode.style.margin.top;

    if (x >= offsetX && x <= offsetX + rootNode.width && y >= offsetY && y <= offsetY + rootNode.height) {
        
        // Novo offset com o padding
        offsetX += rootNode.style.padding.left;
        offsetY += rootNode.style.padding.top;


        for (const child of rootNode.children) {
            if (child.style.display === 'none') continue;

            let collidedElement = checkClickHit(child, x, y, [ offsetX, offsetY ]);

            if (collidedElement) {
                return collidedElement;
            }
           
            offsetY += child.height + child.style.margin.top + child.style.margin.bottom;
        }

        return rootNode;
    }

    return null;
}


runTest();