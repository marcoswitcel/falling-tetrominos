import { makeFieldReadOnly } from './utility.js';

/**
 * ### Classe base dos eventos
 * 
 * Usada para definir terminologia e estrutura básica.
 * Eventos tem um campo para indicar o tipo e podem ter dados associados.
 * A partir daqui os eventos podem ser especializados para cada caso de uso
 */
export class Event {

    /**
     * Objeto que representa uma instância de um dado tipo de evento
     * @param {string} type nome do tipo de evento
     * @param {any} [data] dados do evento caso seja necessário
     */
    constructor(type, data = null) {
        /**
         * @readonly
         * @type {string} nome do tipo de evento
         */
        this.type = type;
        /**
         * @readonly
         * @type {any} dados do evento caso seja necessário
         */
        this.data = data;

        makeFieldReadOnly(this, 'type');
        makeFieldReadOnly(this, 'data');
    }
}

/**
 * ### Classe que gerenciar o fluxo de eventos e ação de resposta
 * 
 * Esta classe disponibiliza toda funcionalidade para gerenciar ações de
 * resposta e o fluxo de eventos.
 * 
 * @see {@link https://refactoring.guru/pt-br/design-patterns/observer} um
 * pouco de documentação no padrão, aqui é usada uma varieda aonde o escritos
 * para serem notificados podem especificar exatamente sobre que tipo de
 * ações querem receber notificações. Permitindo que cada instância dessa
 * classe possa gerenciar diversos tipos eventos.
 */
export class EventTarget {

    /**
     * Constrói uma instância de um `EventTarget`
     */
    constructor() {
        /**
         * @readonly Criado na construção do objeto
         * @type {Map<string, Set<(any) => void>>}
         */
        this.eventMap = new Map;
    }
    
    /**
     * Adiciona uma função ao conjunto caso ela ainda não faça, se fizer
     * ela será apenas ignorada.
     * @param {string} type Tipo do evento aonde a função deve ser associada
     * @param {(event: Event) => void} handler Função que deve ser adicionada a lista
     * @returns {void}
     */
    addListener(type, handler) {
        if (!this.eventMap.has(type)) {
            this.eventMap.set(type, new Set);
        }
        /**
         * @todo adicionar warnings em caso da mesma função ser passada mais
         * de um vez?
         */
        this.eventMap.get(type).add(handler);
    }

    /**
     * Caso a função passada exista no conjunto associado ao tipo ela será
     * removida, senão será apenas ignorada.
     * @param {string} type Tipo do evento aonde a função deve ser desassociada
     * @param {(event: Event) => void} handler Função que deve ser removida caso exista
     * @returns {void}
     */
    removeListener(type, handler) {
        if (this.eventMap.has(type)) {
            this.eventMap.get(type).delete(handler);
        }
    }

    /**
     * Despacha um evento pelo conjunto de todas as funções de resposta
     * associadas ao tipo do evento.
     * @param {Event} event Evento que será despechado
     * @returns {void}
     */
    dispatchEvent(event) {
        const handlers = this.eventMap.get(event.type) || new Set;
        for (const handler of handlers) {
            try {
                handler(event);
            } catch (ex) {
                console.error(ex);
            }
        }
    }
}

export default {
    Event,
    EventTarget
}
