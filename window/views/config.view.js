import { rgba } from '../../colors.js';
import { percentage } from '../window.js';
import { NodeElement } from '../node-element.js';
import StorageUtility from '../../storage-utility.js';
import { Button } from '../components/button.component.js';


const storage = new StorageUtility('tetris-config');
const config = storage.getItem('config');

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
                Button('Seta velocidade para 250ms', (event) => {
                    const config = storage.getItem('config');
                    config.initialSpeed = 250;
                    storage.setItem('config', config);
                }),
                Button('Seta velocidade para 500ms', (event) => {
                    const config = storage.getItem('config');
                    config.initialSpeed = 500;
                    storage.setItem('config', config);
                }),
                Button('Seta velocidade para 1000ms', (event) => {
                    const config = storage.getItem('config');
                    config.initialSpeed = 1000;
                    storage.setItem('config', config);
                }),
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
