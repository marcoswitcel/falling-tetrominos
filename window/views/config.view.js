import { rgba } from '../../colors.js';
import { percentage } from '../window.js';
import { NodeElement } from '../node-element.js';

export const configIDs = {
    /** @type {NodeElement} */
    button: null,
};

export const viewConfig = new NodeElement({
    type: 'view',
    style: {
        display: 'none',
    },
    children: [
        configIDs.button = new NodeElement({ type: 'button', style: { width: percentage(50), height: 'auto', margin: [ 10, 0, 0 ], padding: [ 15 ], color: rgba(0, 0, 255) }, children: [
            new NodeElement({
                type: 'text',
                style: { size: 16, height: 'auto' },
                data: {
                    value: 'menu'
                }
            }),
        ]}),
    ]
});
