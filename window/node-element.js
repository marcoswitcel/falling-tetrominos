import { ElementEvent } from './element-event.js';
import { EventTarget } from './event-target.js';
import { Style, Percentage } from './window.js';

/**
 * @typedef {'click'|'mousein'|'mouseout'} EventTypeList Lista de nomes dos
 * eventos registrados até então
 */

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
        if (element === this)
            return;

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
     * Adiciona uma função de resposta para responder quando algum tipo
     * específico de evento for despachado neste elemento.
     * @param {EventTypeList} type
     * @param {(event: ElementEvent) => void} handler
     * @returns {void}
     */
    addListener(type, handler) {
        this.eventTarget.addListener(type, handler);
    }

    /**
     * Remove uma função de resposta vinculada a algum tipo específico de
     * evento. Caso ela não existir, apenas ignora.
     * @param {EventTypeList} type
     * @param {(event: ElementEvent) => void} handler
     * @returns {void}
     */
    removeListener(type, handler) {
        this.eventTarget.removeListener(type, handler);
    }

    /**
     * Método público que despacha o evento no elemento, causando assim
     * o seu processamento pelas funções de resposta (handlers).
     * @param {EventTypeList} eventType Tipo do evento
     * @param {any} [data] Dados do evento
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
     * Método com a lógica padrão de encaminhamento de eventos entre instâncias
     * de `NodeElement`.
     * @private
     * @param {ElementEvent} event Evento que será encaminhado para esse
     * elemento
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
     * Método com a lógica padrão de processamento dos eventos, é chamado
     * sempre após o processamento de todos as funções de resposta associadas
     * ao evento sendo processado. Isso permite que as funções de resposta
     * requisitem a prevenção do comportamento padrão, assim parando o efeito
     * de propagação e outros tipos de comportamentos causados pelo evento.
     * @private
     * @param {ElementEvent} event Evento sendo processado
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
        for (const children of this.children) {
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
            return (+width / 100) * this.parent.width - this.parent.style.padding.left - this.parent.style.padding.right;
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
            return (+height / 100) * this.parent.height - this.parent.style.padding.left - this.parent.style.padding.right;
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
            } else {
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
