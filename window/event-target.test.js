import { assert } from '../test/assert-utils.js';
import { TestCase } from '../test/test-case.js';
import { Event, EventTarget } from './event-target.js';

/**
 * @todo João, acredito que talvez o método add ou remove poderia retornar booleanos, e o método dispatch poderia
 * reportar se ouve erros de execução.
 */
export class EventTargetTest extends TestCase {

    ['adiciona um listener']() {
        const eventTarget = new EventTarget;
        const type = 'click';
        const event = new Event(type, {});
        let called = 0;
        /** @type {(event: Event) => void} */
        const handler = (event) => {
            called++;
        };

        eventTarget.addListener('click', handler);
        assert(called === 0, 'Não deveria ter invocado o callback ao adicionar o listner');
    }

    ['listener é executado quando chamado']() {
        const eventTarget = new EventTarget;
        const type = 'click';
        const event = new Event(type, {});
        let called = 0;
        /** @type {(event: Event) => void} */
        const handler = (event) => {
            called++;
        };

        eventTarget.addListener('click', handler);

        eventTarget.dispatchEvent(event);
        assert(called === 1, 'Deveria ter chamado o callback uma vez após disparar um evento');

        eventTarget.dispatchEvent(event);
        assert(called === 2, 'Deveria ter chamado o callback uma segunda vez após disparar novamente');
    }

    ['remover funciona']() {
        const eventTarget = new EventTarget;
        const type = 'click';
        const event = new Event(type, {});
        let called = 0;
        /** @type {(event: Event) => void} */
        const handler = (event) => {
            called++;
        };

        eventTarget.addListener('click', handler);

        eventTarget.removeListener('click', handler);

        eventTarget.dispatchEvent(event);
        assert(called === 0, 'Não deveria ter disparado o callback');
    }

    ['adiciona o callback apenas uma vez']() {
        const eventTarget = new EventTarget;
        const type = 'click';
        const event = new Event(type, {});
        let called = 0;
        /** @type {(event: Event) => void} */
        const handler = (event) => {
            called++;
        };

        eventTarget.addListener('click', handler);
        eventTarget.addListener('click', handler);

        eventTarget.dispatchEvent(event);
        assert(called === 1, 'Deveria ter chamado o callback uma vez após disparar um evento');
    }
}
