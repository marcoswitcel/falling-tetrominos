import { rgba } from '../../colors.js';
import { percentage } from '../window.js';
import { NodeElement } from '../node-element.js';


/**
 * @typedef {import('../element-event.js').ElementEvent} ElementEvent
 */

/**
 * @param {{ value: any }} data Objeto com o título do botão no campo value
 * @param {(event: ElementEvent) => void} [onClick]
 * @returns {NodeElement}
 */
export function Button(data, onClick = null) {
    const node = new NodeElement({
        type: 'button',
        style: {
            width: percentage(50),
            height: 'auto',
            margin: [ 0, 0, 10 ],
            padding: [ 10 ],
            color: rgba(0, 0, 255)
        },
        children: [
            new NodeElement({
                type: 'text',
                style: { size: 16, height: 'auto' },
                data: data
            }),
        ]
    });

    if (onClick) {
        node.addListener('click', onClick);
    }

    return node;
}
