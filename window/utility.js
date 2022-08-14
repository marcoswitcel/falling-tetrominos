
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
