//@ts-check

const singleton = Symbol();

/**
 * Classe utilitária criada para permitir a mais fácil manipulação das instâncias de `Storage`
 */
export class StorageUtility {

    /**
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
    prefixedKey(key) {
        /** @TODO analisar com calma as possibilidades de conflito de chave */
        return this._prefix ? `${this._prefix}:#:${key}` : key;
    }

    /**
     * 
     * @param {string} key 
     * @returns {string|Object|null}
     */
    getItem(key) {
        key = this.prefixedKey(key);
        const value = this._storage.getItem(key);

        return this._jsonEncode ? JSON.parse(value) : value;
    }
    
    /**
     * @param {string} key 
     */
    removeItem(key) {
        key = this.prefixedKey(key);
        this._storage.removeItem(key);
    }
    
    /**
     * 
     * @param {string} key 
     * @param {any} value 
     */
    setItem(key, value) {
        key = this.prefixedKey(key);
        value = this._jsonEncode ? JSON.stringify(value) : value;
        this._storage.setItem(key, value);
    }

    /**
     * @param {string} key
     * @param {any} defaultValue  
     * @returns {string|Object|null}
     */
    getItemWithInialization(key, defaultValue) {
        const prefixedKey = this.prefixedKey(key);
        let value = this._storage.getItem(prefixedKey);

        if (value === null) {
            this.setItem(key, defaultValue);

            return defaultValue;
        }

        return this._jsonEncode ? JSON.parse(value) : value;
    }


}