//@ts-check

import { rgba } from '../colors.js';
import { Event, EventTarget } from './event-target.js';

export class Node {
    /**
     * @param {Object} param0
     * @param {Node} [param0.parent]
     * @param {Set<Node>|Node[]} param0.children
     * @param {any} [param0.value]
     */
    constructor({ parent = null, children, value = null }) {
        /** @type {Node} */
        this.parent = parent;
        /** @type {Set<Node>} */
        this.children = (children instanceof Set) ? children : new Set(children);
        /** @type {any} */
        this.value = value;

        this.setParentOfChildren();
    }

    /**
     * Atualiza a propriedade `parent` para referenciar o novo `parent`
     */
    setParentOfChildren() {
        for(const children of this.children) {
            children.parent = this;
        }
    }
}

class PositionalValues {
    /**
     * 
     * @param {number[]} values 
     */
    constructor(values) {
        if (values.length === 1)  {
            this.top = values[0];
            this.right = values[0];
            this.bottom = values[0];
            this.left = values[0];
        } else if (values.length === 2) {
            
            this.top = values[0];
            this.right = values[1];
            this.bottom = values[0];
            this.left = values[1];
        } else if (values.length === 3) {
            this.top = values[0];
            this.right = values[1];
            this.bottom = values[2];
            this.left = values[1];
        } else if (values.length === 4) {
            this.top = values[0];
            this.right = values[1];
            this.bottom = values[2];
            this.left = values[3];
        } else {
            const error = new TypeError(`Array com ${values.length} elementos`);
            //@ts-expect-error
            error.array = values;
            throw error;
        }
    }
}

/**
 * @param  {...any} args 
 * @returns {Set<Node>}
 */
export function nodeSet(...args) {
    return new Set(
        args.map(value => new Node({
            value,
            children: []
        }))
    );
}

class Percentage extends Number {};
class ViewWidth extends Number {};
class ViewHeight extends Number {};

export function percentage(number) {
    return new Percentage(number);
}

export function viewWidth(number) {
    return new ViewWidth(number);
}

export function viewHeight(number) {
    return new ViewHeight(number);
}

export class Style {
    constructor({ display = 'block', margin = [0], padding = [0], size = 16, wrap = true, width = percentage(100), height = 'auto', visibility = true, color = rgba(0, 0, 0, 0) } = {}) {
        /** @type {PositionalValues} */
        this.margin =  new PositionalValues(margin),
        /** @type {PositionalValues} */
        this.padding = new PositionalValues(padding),
        this.width = width;
        /** @type {string|Percentage|ViewWidth|ViewHeight} */
        this.height = height;
        this.visibility = visibility;
        this.color = color;
        this.size = size;
        this.wrap = wrap;
        /** @type {'block'|'none'} *///@ts-expect-error
        this.display = display;
    }
}

export class Element {
    constructor(type, style) {
        /** 
         * @readonly
         * @type {string}
         */
        this.type = type;
        /** @type {Style} */
        this.style = new Style(style);
    }

    /**
     * @readonly
     */
    get width() {
        return this.style.width;
    }

    /**
     * @readonly
     */
    get height() {
        return this.style.height;
    }
}

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
        /** @type {any} */
        this.data = data;
    }
}

export class NodeElement {
    /**
     * @param {Object} param0
     * @param {NodeElement} [param0.parent]
     * @param {Set<NodeElement>|NodeElement[]} [param0.children]
     * @param {string} param0.type
     * @param {object} [param0.style]
     * @param {object} [param0.data]
     */
    constructor({ parent = null, children = [], type, style = {}, data = null }) {
        /** @type {NodeElement} */
        this.parent = parent;
        /** @type {Set<NodeElement>} */
        this.children = (children instanceof Set) ? children : new Set(children);
        /** @readonly @type {string} */
        this.type = type;
        /** @type {Style} */
        this.style = new Style(style);
        /** @type {object} */
        this.data = data;
        /** @type {EventTarget} */
        this.eventTarget = new EventTarget;

        this.setParentOfChildren();
    }

    /**
     * 
     * @param {NodeElement} element 
     */
    appendChild(element) {
        // Um elemento não pode ter a si mesmo como filho
        if (element === this) return;

        // Se o elemento já era filho de alguém, remove o elemento
        // da antiga lista e o adiciona para a nova lista de filhos e o novo `parent`
        if (element.parent) {
            element.parent.children.delete(element);
        }
        element.parent = this;
        this.children.add(element);
    }

    /**
     * 
     * @param {string} type 
     * @param {(any) => void} handler
     * @returns {void}
     */
    addListener(type, handler) {
        this.eventTarget.addListener(type, handler);
    }

    /**
     * 
     * @param {string} type 
     * @param {(any) => void} handler
     * @returns {void}
     */
    removeListener(type, handler) {
        this.eventTarget.removeListener(type, handler);
    }

    /**
     * 
     * @param {'click'|'mousein'|'mouseout'} eventType 
     * @param {any} data 
     * @returns {void}
     */
    dispatchEvent(eventType, data = null) {
        const event = new ElementEvent(eventType, {
            currentTarget: this,
            target: this,
            data: data
        });

        // Executa todo os handlers do elemento
        this.eventTarget.dispatchEvent(event);

        this.defaultHandler(event);
    }

    /**
     * 
     * @param {ElementEvent} event 
     * @returns {void}
     */
    bubbleEvent(event) {
        // Atualiza o currentTarget
        event.currentTarget = this;

        // Executa todo os handlers do elemento
        this.eventTarget.dispatchEvent(event);

        this.defaultHandler(event);
    }

    /**
     * 
     * @param {ElementEvent} event 
     * @returns {void}
     */
    defaultHandler(event) {
        if (event.bubbles && this.parent && !event.defaultPrevented) {
            this.parent.bubbleEvent(event);
        }
    }

    /**
     * Atualiza a propriedade `parent` para referenciar o novo `parent`
     * @private
     */
    setParentOfChildren() {
        for(const children of this.children) {
            children.parent = this;
        }
    }

    /**
     * @readonly
     * @returns {number}
     */
    get width() {
        const width = this.style.width;
        if (typeof width === 'number') {
            return width;
        }

        if (width instanceof Percentage) {
            return (+width/100) * this.parent.width - this.parent.style.padding.left - this.parent.style.padding.right;
        }

        return 0;
    }

    /**
     * @readonly
     * @returns {number}
     */
    get height() {
        const height = this.style.height;
        if (typeof height === 'number') {
            return height;
        }

        if (height instanceof Percentage) {
            return (+height/100) * this.parent.height - this.parent.style.padding.left - this.parent.style.padding.right;
        }

        if (height === 'auto') {
            if (this.type === 'text') {
                let innerHeight = this.style.padding.top + this.style.padding.bottom;
                /** @type {{ value: string, preprocessedText: string[] }} */
                const data = this.data;
                if (!data.preprocessedText) {
                    data.preprocessedText = (`${data.value}`).split('\n');
                }
                const letterPerLine = this.parent.width / this.style.size | 0;
                let lines = 0;
                for (const line of data.preprocessedText) {
                    lines += Math.ceil(line.length / letterPerLine);
                }
                return innerHeight + lines * this.style.size;
            }  else {
                let innerHeight = this.style.padding.top + this.style.padding.bottom;
                for (const child of this.children) {
                    innerHeight += child.style.margin.top + child.style.margin.bottom + child.height;
                }
                return innerHeight;
            }
        }

        return 0;
    }
}