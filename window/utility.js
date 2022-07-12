
/**
 * Função que configura um campo preexisten em um objeto como `apenas leitura`.
 * @param {object} object objeto que terá o campo promovido a apenas leitura
 * @param {string} field campo que já existe no objeto e será configurado
 * como apenas leitura
 * @param {boolean} [configurable] Parêmtro que define se a configuração pode
 * ser ajustada no futuro, por padrão `false`, o que significa que o campo não
 * pode ser reajustado uma vez criado.
 */
export function makeFieldReadOnly(object, field, configurable = false) {
    Object.defineProperty(object, field, {
        value: object[field],
        writable: false,
        enumerable: true,
        configurable: configurable,
    });
}
