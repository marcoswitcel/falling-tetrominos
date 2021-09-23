//@ts-check

import { rgba } from './colors.js';

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
    constructor({ margin = [0], padding = [0], size = 16, wrap = true, width = percentage(100), height = 'auto', visibility = true, color = rgba(0, 0, 0, 0.1) } = {}) {
        this.margin =  new PositionalValues(margin),
        this.padding = new PositionalValues(padding),
        this.width = width;
        /** @type {string|Percentage|ViewWidth|ViewHeight} */
        this.height = height;
        this.visibility = visibility;
        this.color = color;
        this.size = size;
        this.wrap = wrap;
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

        this.setParentOfChildren();
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
                    data.preprocessedText = data.value.split('\n');
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