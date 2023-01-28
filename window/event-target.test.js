import { assert } from '../test/assert-utils.js';
import { TestCase } from '../test/test-case.js';
import { Event, EventTarget } from './event-target.js';

/**
 * @todo João, terminar a cobertura de testes
 */
export class EventTargetTest extends TestCase {

    ['testa que listener é executado quando chamado']() {
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

        eventTarget.dispatchEvent(event);
        assert(called === 1, 'Deveria ter chamado o callback uma vez após disparar um evento');
    }
}
