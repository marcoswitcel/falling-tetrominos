import { Event } from './event-target.js';

/**
 * @typedef {import('./window.js').NodeElement} NodeElement
 */

/**
 * Evento especializado para `NodeElement`
 */

export class ElementEvent extends Event {
    /**
     * @param {string} type
     * @param {Object} param1
     * @param {boolean} [param1.bubbles]
     * @param {NodeElement} param1.target
     * @param {NodeElement} param1.currentTarget
     * @param {boolean} [param1.defaultPrevented]
     * @param {boolean} [param1.cancelable]
     * @param {any} [param1.data]
     */
    constructor(type, { bubbles = true, target, currentTarget, defaultPrevented = false, cancelable = true, data = null }) {
        super(type, data);

        /** @type {boolean} */
        this.bubbles = bubbles;
        /** @type {NodeElement} */
        this.target = target;
        /** @type {NodeElement} */
        this.currentTarget = currentTarget;
        /** @type {Boolean} */
        this.defaultPrevented = defaultPrevented;
        /** @type {Boolean} */
        this.cancelable = cancelable;
    }
}
