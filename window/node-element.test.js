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

    ['testando método `appendChild`']() {
        const rootNode = new NodeElement({ type: 'root' });
        const childNode1 = new NodeElement({ type: 'child' });
        const childNode2 = new NodeElement({ type: 'child' });


        rootNode.appendChild(rootNode);
        assert(rootNode.children.size === 0, 'Nó não aceita a si mesmo como filho');

        rootNode.appendChild(childNode1);
        assert(rootNode.children.has(childNode1), 'Consegue adicionar um filho');

        rootNode.appendChild(childNode1);
        assert(rootNode.children.size === 1, 'O mesmo nó não é adicionado duas vezes');

        /**
         * @todo João, continuar expandindo, refatorando e documentando
         * * Expor a propriedade children não é o ideal;
         * * O `Set` não parece atender todas as necessidades funcionais;
         */
    }
}
