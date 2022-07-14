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
 * @return {Set<Node>}
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
        /** @type {NodeElement} Elemento parente (pai) deste elemento */
        this.parent = parent;
        /** @type {Set<NodeElement>} Conjunto com os filhos deste elemento */
        this.children = (children instanceof Set) ? children : new Set(children);
        /** @readonly @type {string} */
        this.type = type;
        /** @type {Style} */
        this.style = new Style(style);
        /** @type {object} */
        this.data = data;
        /** 
         * @private
         * @readonly
         * @type {EventTarget}
         */
        this.eventTarget = new EventTarget;

        this.setParentOfChildren();
    }

    /**
     * Adiciona um elemento ao final do conjunto de filhos deste elemento.
     * Se o elemento já for filho de outro elemento, o vínculo será desfeito
     * e um novo será criado com este elemento.
     * @param {NodeElement} element 
     */
    appendChild(element) {
        // Um elemento não pode ter a si mesmo como filho
        if (element === this) return;

        // Se o elemento já era filho de alguém, remove-o da antiga lista
        if (element.parent) {
            element.parent.children.delete(element);
        }

        // Atualiza a propriedade `parent`
        // e adiciona o elemento novo à lista de filhos 
        element.parent = this;
        this.children.add(element);
    }

    /**
     * 
     * @param {string} type 
     * @param {(any) => void} handler
     * @return {void}
     */
    addListener(type, handler) {
        this.eventTarget.addListener(type, handler);
    }

    /**
     * 
     * @param {string} type 
     * @param {(any) => void} handler
     * @return {void}
     */
    removeListener(type, handler) {
        this.eventTarget.removeListener(type, handler);
    }

    /**
     * Método público que despacha o evento no elemento, causando assim
     * o seu processamento pelas funções de resposta (handlers).
     * @param {'click'|'mousein'|'mouseout'} eventType Tipo do evento
     * @param {any} [data] Dados do evento
     * @return {void}
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
     * Método com a lógica padrão de encaminhamento de eventos entre instâncias
     * de `NodeElement`.
     * @private
     * @param {ElementEvent} event Evento que será encaminhado para esse
     * elemento
     * @return {void}
     */
    bubbleEvent(event) {
        // Atualiza o currentTarget
        event.currentTarget = this;

        // Executa todo os handlers do elemento
        this.eventTarget.dispatchEvent(event);

        this.defaultHandler(event);
    }

    /**
     * Método com a lógica padrão de processamento dos eventos, é chamado 
     * sempre após o processamento de todos as funções de resposta associadas
     * ao evento sendo processado. Isso permite que as funções de resposta 
     * requisitem a prevenção do comportamento padrão, assim parando o efeito
     * de propagação e outros tipos de comportamentos causados pelo evento.
     * @private
     * @param {ElementEvent} event Evento sendo processado
     * @return {void}
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
     * @return {number}
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
     * @return {number}
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
