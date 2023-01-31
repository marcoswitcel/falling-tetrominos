import { rgba } from '../../colors.js';
import { percentage } from '../window.js';
import { NodeElement } from '../node-element.js';

export const menuIDs = {
    /** @type {NodeElement} */
    button: null,
    /** @type {NodeElement} */
    tetrominosViewButton: null,
    /** @type {NodeElement} */
    addButton: null,
    /** @type {NodeElement} */
    addButtonText: null,
    /** @type {NodeElement} */
    mouseInOutdButton: null,
    /** @type {NodeElement} */
    mouseInOutText: null,
    /** @type {NodeElement} */
    text: null,
};

export const viewMenu = new NodeElement({
    type: 'view',
    children: [
        new NodeElement({ type: 'button', style: { display: 'none', width: 350, height: 10 }, children: [] }),
        new NodeElement({ type: 'button', style: { display: 'none', width: 300, height: 'auto', color: rgba(255, 0, 0) }, children: [
            new NodeElement({
                type: 'text',
                style: { size: 16, height: 'auto' },
                data: {
                    value: 'texto de teste\nteste nova linha\nlorem ipsum lorem ipsum lorem ipsum ipsum ipsum\nteste'
                }
            }),
        ]}),
        menuIDs.button = new NodeElement({ type: 'button', style: { width: percentage(50), height: 'auto', margin: [ 10, 0, 0 ], padding: [ 15 ], color: rgba(0, 0, 255) }, children: [
            new NodeElement({
                type: 'text',
                style: { size: 16, height: 'auto' },
                data: {
                    value: 'Configurações'
                }
            }),
        ]}),
        menuIDs.tetrominosViewButton = new NodeElement({ type: 'button', style: { width: percentage(50), height: 'auto', margin: [ 10, 0, 0 ], padding: [ 15 ], color: rgba(0, 0, 255) }, children: [
            new NodeElement({
                type: 'text',
                style: { size: 16, height: 'auto' },
                data: {
                    value: 'Tela teste Falling Tetrominos'
                }
            }),
        ]}),
        menuIDs.addButton = new NodeElement({ type: 'button', style: { width: percentage(50), height: 'auto', margin: [ 10, 0, 0 ], padding: [ 15 ], color: rgba(0, 0, 255) }, children: [
            menuIDs.addButtonText = new NodeElement({
                type: 'text',
                style: { size: 16, height: 'auto' },
                data: {
                    value:  { count: 0, toString() { return `Add to counter (localStorage)\nActual value ${this.count}`  } }
                }
            }),
        ]}),
        menuIDs.mouseInOutdButton = new NodeElement({ type: 'button', style: { width: percentage(50), height: 'auto', margin: [ 10, 0, 0 ], padding: [ 15 ], color: rgba(0, 0, 255) }, children: [
            menuIDs.mouseInOutText = new NodeElement({
                type: 'text',
                style: { size: 16, height: 'auto' },
                data: {
                    value:  {
                        mouseIn: false,
                        mouseOut: false,
                        toString() {
                            return (this.mouseIn) ? 'The mouse is inside of this box' :
                                (this.mouseOut) ? 'The mouse was inside of this box' : 'Waiting mouse hover';
                        }
                    }
                }
            }),
        ]}),
        menuIDs.text = new NodeElement({
            type: 'text',
            style: { size: 16, height: 'auto' },
            data: {
                value: '...'
            }
        }),
    ]
});
