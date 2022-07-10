
const singleton = Symbol();

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
     * @TODO João, criar uma factory para esse tipo de funcionalidade
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
     * Retorna o número de pares de chave e valor
     * @readonly
     * @property {number} length
     */
    get length() {
        let keyCount = 0;
        const prefixPattern = this._prefixedKey('');

        for (const key in this._storage) {
            keyCount += +(key.startsWith(prefixPattern));
        }

        return keyCount;
    }

    /**
     * Retorna a chave prefixada
     * 
     * @param {string} key 
     * @return {string}
     */
    _prefixedKey(key) {
        /** @TODO analisar com calma as possibilidades de conflito de chave */
        return this._prefix ? `${this._prefix}:#:${key}` : key;
    }

    /**
     * 
     * @param {string} key 
     * @return {string|Object|null}
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
     * @return {void}
     */
    setItem(key, value) {
        key = this._prefixedKey(key);
        value = this._jsonEncode ? JSON.stringify(value) : value;
        this._storage.setItem(key, value);
    }

    /**
     * @return {void}
     */
    clear() {
        const prefixPattern = this._prefixedKey('');

        for (const key in this._storage) {
            if (key.startsWith(prefixPattern)) {
                this._storage.removeItem(key);
            }
        }
    }

    /**
     * @param {string} key
     * @param {any} defaultValue  
     * @return {string|Object|null}
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
