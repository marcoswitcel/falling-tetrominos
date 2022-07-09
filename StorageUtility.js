
const singleton = Symbol();

/**
 * Classe utilitária criada para permitir a mais fácil manipulação das instâncias de `Storage`
 */
export default class StorageUtility {

    /**
     * @constant
     * @readonly
     * @type {StorageUtility}
     */
    static get singleton() {
        if (!this[singleton]) {
            this[singleton] = new StorageUtility;
        }
        return this[singleton];
    }

    /**
     * @type {string}
     */
    _prefix = '';

    /**
     * @constant
     * @type { 'local' | 'session' }
     */
    _type = 'local';

    /**
     * @constant
     * @type {Storage}
     */
    _storage = null;

    /**
     * @constant
     * @type {boolean} 
     */
    _jsonEncode = false;

    /**
     * 
     * @param {string} [prefix] 
     * @param {'local' | 'session'} [type] 
     * @param {boolean} [jsonEncode] 
     */
    constructor(prefix = '', type = 'local', jsonEncode = true) {
        this._prefix = prefix;
        this._type = type;
        this._storage = (type === 'local') ? window.localStorage: window.sessionStorage;
        this._jsonEncode = jsonEncode;
    }

    /**
     * @readonly
     * @property {number} length
     */
    get length() {
        /** @TODO terminar de implementar ou remover */
        return 0;
    }

    /**
     * Retorna a chave prefixada
     * 
     * @param {string} key 
     * @returns {string}
     */
    _prefixedKey(key) {
        /** @TODO analisar com calma as possibilidades de conflito de chave */
        return this._prefix ? `${this._prefix}:#:${key}` : key;
    }

    /**
     * 
     * @param {string} key 
     * @returns {string|Object|null}
     */
    getItem(key) {
        key = this._prefixedKey(key);
        const value = this._storage.getItem(key);

        return this._jsonEncode ? JSON.parse(value) : value;
    }
    
    /**
     * @param {string} key
     * @return {void}
     */
    removeItem(key) {
        key = this._prefixedKey(key);
        this._storage.removeItem(key);
    }
    
    /**
     * Persiste um valor associado a uma chave no armazenamento escolhido
     * @param {string} key chave
     * @param {any} value valor
     */
    setItem(key, value) {
        key = this._prefixedKey(key);
        value = this._jsonEncode ? JSON.stringify(value) : value;
        this._storage.setItem(key, value);
    }

    /**
     * @param {string} key
     * @param {any} defaultValue  
     * @returns {string|Object|null}
     */
    getItemWithInialization(key, defaultValue) {
        const prefixedKey = this._prefixedKey(key);
        let value = this._storage.getItem(prefixedKey);

        if (value === null) {
            this.setItem(key, defaultValue);

            return defaultValue;
        }

        return this._jsonEncode ? JSON.parse(value) : value;
    }
}
