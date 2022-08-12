
/**
 * Função usada para reportar o resultado de cada cenário
 * @param {boolean} condition resultado da condição aplicada
 * @param {string} description Descrição apresentada ao usuário em caso de
 * sucesso ou falha.
 */
export const assert = (condition, description) => {
    console.log(`${condition ? '✅' : '❌'}: ${description}`);
};
