import { assert } from '../test/assert-utils.js';
import { TestCase } from '../test/test-case.js';
import { NodeElement } from './node-element.js';


/**
 * @since 2022.08.11
 * @todo João, expandir os cenários de testes para contemplar
 * vários casos de uso da aplicação e possíveis outros, por prática
 */
export class NodeElementTest extends TestCase {
    
    ['testando construtor apenas com o parâmetro type']() {
        const type = 'text';
        const node = new NodeElement({ type });
        assert(true, 'contrutor simples funcionando');
        assert(node.type === type, 'o parâmetro type é mantido após a contrução');
    }
}
