
/**
 * Classe de persistência de chaves/valores que adiciona uma série de recursos
 * a funcionalidade de storage padrão disponibilizada através da
 * Web Storage Api manifestada pelos objetos `window.localStorage` e
 * `window.sessionStorage`.
 * 
 * ## Recursos adicionais
 * * Sistema de namespace para evitar conflito entre chaves de diversas partes
 * do sistema
 * * JSON encode e decode automático caso desejado
 * * Permite escolher entre estratégias de armazenamento `local` e de `sessão`
 * de forma mais organizada
 */
export default class StorageUtility {

    /**
     * @private
     * @readonly
     * @type {string}
     */
    prefix = '';

    /**
     * @private
     * @readonly
     * @type { 'local' | 'session' }
     */
    type = 'local';

    /**
     * @private
     * @readonly
     * @type {Storage}
     */
    storage = null;

    /**
     * @private
     * @readonly
     * @type {boolean} 
     */
    jsonEncode = false;

    /**
     * 
     * @param {string} [prefix] 
     * @param {'local' | 'session'} [type] 
     * @param {boolean} [jsonEncode] 
     */
    constructor(prefix = '', type = 'local', jsonEncode = true) {
        this.prefix = prefix;
        this.type = type;
        this.storage = (type === 'local') ? window.localStorage: window.sessionStorage;
        this.jsonEncode = jsonEncode;
    }

    /**
     * Retorna o número de pares de chave e valor
     * @readonly
     * @property {number} length
     */
    get length() {
        let keyCount = 0;
        const prefixPattern = this.prefixedKey('');

        for (const key in this.storage) {
            keyCount += +(key.startsWith(prefixPattern));
        }

        return keyCount;
    }

    /**
     * Retorna a chave prefixada
     * @private
     * @param {string} key chave que será prefixada
     * @return {string} a chave prefixada
     */
    prefixedKey(key) {
        /** @TODO analisar com calma as possibilidades de conflito de chave */
        return this.prefix ? `${this.prefix}:#:${key}` : key;
    }

    /**
     * 
     * @param {string} key 
     * @return {string|Object|null}
     */
    getItem(key) {
        key = this.prefixedKey(key);
        const value = this.storage.getItem(key);

        return this.jsonEncode ? JSON.parse(value) : value;
    }
    
    /**
     * @param {string} key
     * @return {void}
     */
    removeItem(key) {
        key = this.prefixedKey(key);
        this.storage.removeItem(key);
    }
    
    /**
     * Persiste um valor associado a uma chave no armazenamento escolhido
     * @param {string} key chave
     * @param {any} value valor
     * @return {void}
     */
    setItem(key, value) {
        key = this.prefixedKey(key);
        value = this.jsonEncode ? JSON.stringify(value) : value;
        this.storage.setItem(key, value);
    }

    /**
     * @return {void}
     */
    clear() {
        const prefixPattern = this.prefixedKey('');

        for (const key in this.storage) {
            if (key.startsWith(prefixPattern)) {
                this.storage.removeItem(key);
            }
        }
    }

    /**
     * @param {string} key
     * @param {any} defaultValue  
     * @return {string|Object|null}
     */
    getItemWithInialization(key, defaultValue) {
        const prefixedKey = this.prefixedKey(key);
        let value = this.storage.getItem(prefixedKey);

        if (value === null) {
            this.setItem(key, defaultValue);

            return defaultValue;
        }

        return this.jsonEncode ? JSON.parse(value) : value;
    }
}
