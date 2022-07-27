import { assert } from '../test/assert-utils.js';
import { TestCase } from '../test/test-case.js';
import { Event } from './event-target.js';


export class EventTest extends TestCase {

    ['teste construtor e atribuição sem a propriedade data']() {
        const typeName = 'teste';
        const event = new Event(typeName);

        assert(
            event.type === typeName,
            'Tipo passado foi usado na atribuição do nome'
        );

        assert(
            event.data === null,
            'Quando o parâmetro data não é passado ao construtor o atributo data será null'
        );
    }

    ['teste construtor e atribuição com a propriedade data']() {
        const typeName = 'teste';
        const data = { x: 22 };
        const event = new Event(typeName, data);

        assert(
            event.type === typeName,
            'Tipo passado foi usado na atribuição do nome'
        );

        assert(
            event.data === data,
            'Quando o parâmetro data é passado ao construtor o atributo data retorna o valor passado'
        );
    }

    ['tentar escrever para nas propriedades causa exceção']() {
        const typeName = 'teste';
        const data = { x: 22 };
        const event = new Event(typeName, data);

        try {
            // @ts-expect-error escrevendo para field read-only
            event.type = 'alterado';
            assert(false, 'escrever para a propriedade type causa exceção');
        } catch (ex) {
            assert(true, 'escrever para a propriedade type causa exceção');
        }

        try {
            // @ts-expect-error escrevendo para field read-only
            event.data = 2;
            assert(false, 'escrever para a propriedade data causa exceção');
        } catch (ex) {
            assert(true, 'escrever para a propriedade data causa exceção');
        }
        
    }
}