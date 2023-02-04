
/**
 * @typedef {import('./node-element').NodeElement} NodeElement
 */

/**
 * Função que configura um campo preexistente em um objeto como
 * `apenas leitura`. A configuração pode ou não ser reversível, depende do
 * parâmetro `configurable`, por padrão definido como `false`.
 * @see {@link https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#configurable}
 * 
 * @param {object} object objeto que terá o campo promovido a apenas leitura
 * @param {string} field campo que já existe no objeto e será configurado
 * como apenas leitura
 * @param {boolean} [configurable] Paramêtro que define se a configuração pode
 * ser ajustada no futuro, por padrão `false`, o que significa que o campo não
 * pode ser reajustado uma vez criado.
 * @returns {void}
 */
export function makeFieldReadOnly(object, field, configurable = false) {
    Object.defineProperty(object, field, {
        value: object[field],
        writable: false,
        enumerable: true,
        configurable: configurable,
    });
}

/**
 * Função que seta o título da página/aba
 * @param {string} title Título da página/aba
 * @param {Document} doc página de referência
 */
export function setPageTitle(title, doc = window.document) {
    if (doc) {
        doc.title = title;
    }
}

/**
 * Função que busca todos os elementos com um determinado valor para `type` dentro
 * de um dado elemento raíz.
 * @param {NodeElement} root Elemento raíz aonde deve se buscar a lista
 * @param {string} type nome do tipo de elemento buscado. 'text', 'container', 'view'
 * @returns {NodeElement[]} Sempre retorna uma lista com todos os elementos encontrados,
 * podendo ser uma lista vazia, caso não haja nenhum.
 */
export function findAllByType(root, type) {
    /** @type {NodeElement[]} */
    const allFoundElements = [];

    for (const children of root.children) {
        if (children.type === type) {
            allFoundElements.push(children);
        }
        allFoundElements.push(...findAllByType(children, type));
    }

    return allFoundElements;
}
