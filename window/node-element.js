import { ElementEvent } from './element-event.js';
import { EventTarget } from './event-target.js';
import { Style, Percentage } from './window.js';

/**
 * @typedef {'click'|'mousein'|'mouseout'} EventTypeList Lista de nomes dos
 * eventos registrados até então
 */

export class NodeElement {
    
    /**
     * Constrói uma instância `NodeElement` com os parâmetros providos.
     * @param {Object} param0
     * @param {string} param0.type
     * @param {NodeElement} [param0.parent]
     * @param {Set<NodeElement>|NodeElement[]} [param0.children]
     * @param {object} [param0.style]
     * @param {object} [param0.data]
     */
    constructor({ type, parent = null, children = [], style = {}, data = null }) {
        /**
         * Elemento "pai", considerando a hierarquia, deste elemento
         * @public
         * @type {NodeElement|null}
         */
        this.parent = parent;
        /**
         * Conjunto com os filhos deste elemento
         * @public
         * @readonly
         * @type {Set<NodeElement>}
         */
        this.children = (children instanceof Set) ? children : new Set(children);
        /**
         * @public
         * @readonly
         * @type {string}
         */
        this.type = type;
        /**
         * @public
         * @type {Style}
         */
        this.style = new Style(style);
        /**
         * @public
         * @type {object|null}
         */
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
     * @public
     * @param {NodeElement} element Elemento a ser adicionado a lista de filhos
     * @returns {void}
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
     * @public
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
     * @public
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
     * @public
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
     * @returns {void}
     */
    setParentOfChildren() {
        for (const children of this.children) {
            children.parent = this;
        }
    }
}
