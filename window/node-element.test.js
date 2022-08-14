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

        assert(childNode1.parent === null, 'Quando criado o nó não possui `parent`');
        rootNode.appendChild(childNode1);
        assert(
            rootNode.children.has(childNode1),
            'Nós conseguem adicionar um outro nó como filho'
        );
        assert(
            childNode1.parent === rootNode,
            'O elemento filho tem seu pai setado ao ser adicionado a outro nó'
        );

        rootNode.appendChild(childNode1);
        assert(rootNode.children.size === 1, 'O mesmo nó não é adicionado duas vezes');

        childNode2.appendChild(childNode1);
        assert(
            childNode1.parent === childNode2,
            'O elemento filho tem sua propriedade `parent` atualizada ao ser adicionado a outro nó'
        );

        assert(rootNode.children.size === 0, 'Antigo elemento pai tem sua lista de filhos atualizada');

        /**
         * @todo João, continuar expandindo, refatorando e documentando
         * * Expor a propriedade children não é o ideal;
         * * O `Set` não parece atender todas as necessidades funcionais;
         */
    }
}
