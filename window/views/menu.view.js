//@ts-check

import { rgba } from '../../colors.js';
import { NodeElement, percentage } from '../window.js';

export const menuIDs = {};

export default new NodeElement({
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
        menuIDs.addButton = new NodeElement({ type: 'button', style: { width: percentage(50), height: 'auto', margin: [ 10, 0, 0 ], padding: [ 15 ], color: rgba(0, 0, 255) }, children: [
            menuIDs.addButtonText = new NodeElement({
                type: 'text',
                style: { size: 16, height: 'auto' },
                data: {
                    value:  { count: 0, toString() { return `Add to counter (localStorage)\nActual value ${this.count}`  } }
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
})