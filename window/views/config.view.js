import { rgba } from '../../colors.js';
import { percentage } from '../window.js';
import { NodeElement } from '../node-element.js';
import StorageUtility from '../../storage-utility.js';
import { Button } from '../components/button.component.js';

/**
 * @typedef {import('../element-event.js').ElementEvent} ElementEvent
 */

const storage = new StorageUtility('tetris-config');
const config = storage.getItem('config');

/**
 * @param {ElementEvent} event 
 * @returns {void}
 */
const handleSelectedOption = (event) => {
    const target = [...event.currentTarget.children][0];
    
    const config = storage.getItem('config');
    config.initialSpeed = target.data.value.speedValue;
    storage.setItem('config', config);

    target.data.preprocessedText = null;
    target.data.value.selected = true;
};

export const configIDs = {
    /** @type {NodeElement} */
    button: null,
    /** @type {NodeElement} */
    container: null,
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
        configIDs.container = new NodeElement({
            type: 'container',
            style: {
                margin: [ 10, 0, 0 ],
                padding: [ 10, 10, 0 ],
                color: rgba(0, 0, 0, 0.1),
                width: percentage(100),
            }, 
            children: (config) ? [
                Button({
                    value: {
                        speedValue: 250,
                        selected: config.initialSpeed === 250,
                        toString() { return `Seta velocidade para 250ms${this.selected ? ' (atual)' : ''}`; },
                    },
                }, handleSelectedOption),
                Button({
                    value: {
                        speedValue: 500,
                        selected: config.initialSpeed === 500,
                        toString() { return `Seta velocidade para 500ms${this.selected ? ' (atual)' : ''}`; },
                    },
                }, handleSelectedOption),
                Button({
                    value: {
                        speedValue: 1000,
                        selected: config.initialSpeed === 1000,
                        toString() { return `Seta velocidade para 1000ms${this.selected ? ' (atual)' : ''}`; },
                    },
                }, handleSelectedOption),
            ] : [
                new NodeElement({
                    type: 'text',
                    style: { size: 16, height: 'auto' },
                    data: {
                        value: 'Não há dados para editar ainda'
                    }
                }),
            ],
        })
    ]
});
