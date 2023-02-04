import { assert } from '../test/assert-utils.js';
import { TestCase } from '../test/test-case.js';
import { NodeElement } from './node-element.js';

/**
 * @typedef {import('./element-event').ElementEvent} ElementEvent
 */

/**
 * @since 2022.08.11
 * @todo João, expandir os cenários de testes para contemplar
 * vários casos de uso da aplicação e possíveis outros, por prática
 * @todo João, continuar expandindo, refatorando e documentando
 * * Expor a propriedade children não é o ideal;
 * * O `Set` não parece atender todas as necessidades funcionais;
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
    }

    ['adiciona um listener']() {
        const rootNode = new NodeElement({ type: 'root' });
        const type = 'click';
        let called = 0;
        /** @type {(event: ElementEvent) => void} */
        const handler = (event) => {
            called++;
        };

        rootNode.addListener(type, handler);

        assert(called === 0, 'Não deveria ter invocado o callback ao adicionar o listner');
    }

    ['testando que o listener adicionado pode ser disparado']() {
        const rootNode = new NodeElement({ type: 'root' });
        const type = 'click';
        let called = 0;
        /** @type {(event: ElementEvent) => void} */
        const handler = (event) => {
            called++;
        };

        rootNode.addListener(type, handler);

        rootNode.dispatchEvent(type);
        assert(called === 1, 'Deveria ter chamado o callback uma vez após disparar um evento');

        rootNode.dispatchEvent(type);
        assert(called === 2, 'Deveria ter chamado o callback uma segunda vez após disparar novamente');
    }

    ['testando que o listener adicionado não dispara com o event errado']() {
        const rootNode = new NodeElement({ type: 'root' });
        const type = 'click';
        let called = 0;
        /** @type {(event: ElementEvent) => void} */
        const handler = (event) => {
            called++;
        };

        rootNode.addListener(type, handler);

        rootNode.dispatchEvent('mousein');
        assert(called === 0, 'Não deveria ter disparado o handler de `click` ao fazer o dispatch de um evento `mousein`');

        rootNode.dispatchEvent(type);
        assert(called === 1, 'Deveria ter chamado o callback uma vez após disparar o evento de `click`');
    }

    ['remover funciona']() {
        const rootNode = new NodeElement({ type: 'root' });
        const type = 'click';
        let called = 0;
        /** @type {(event: ElementEvent) => void} */
        const handler = (event) => {
            called++;
        };

        rootNode.addListener(type, handler);
        rootNode.removeListener(type, handler);

        rootNode.dispatchEvent(type);
        assert(called === 0, 'Não deveria ter disparado o callback');
    }

    ['adicionar o mesmo callback mais de uma vez não causa multipals adições e mútliplas execuções']() {
        const rootNode = new NodeElement({ type: 'root' });
        const type = 'click';
        let called = 0;
        /** @type {(event: ElementEvent) => void} */
        const handler = (event) => {
            called++;
        };

        rootNode.addListener(type, handler);
        rootNode.addListener(type, handler);

        rootNode.dispatchEvent(type);
        assert(called === 1, 'Deveria ter chamado o callback uma vez após disparar um evento');
    }

    ['testando `dispatchEvent` com dados']() {
        const rootNode = new NodeElement({ type: 'root' });
        let isCorrect = false;
        const data = { x: 2, y: 5 };
        /** @type {(event: ElementEvent) => void} */
        const handler = (event) => {
            isCorrect = event.data === data;
        };

        rootNode.addListener('click', handler);
        rootNode.dispatchEvent('click', data);

        assert(isCorrect, 'O objeto passado deveria ter chegado ao handler');
    }
}
