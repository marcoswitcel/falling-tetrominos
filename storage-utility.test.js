import StorageUtility from './storage-utility.js';
import { assert } from './test/assert-utils.js';
import { TestCase } from './test/test-case.js';

export class StorageUtilityTest extends TestCase {

    /**
     * @type {string} Prefixo randômico usado nos testes
     */
    prefix;
    /**
     * @type {StorageUtility} instância usada para os testes, reinicializada
     * entre os testes
     */
    storage;
    
    beforeAll() {
        this.prefix = (Math.random() * 100000).toString(16);
    }

    beforeEach() {
        sessionStorage.clear();
        this.storage = new StorageUtility(this.prefix, 'session', true);
    }

    afterEach() {
        sessionStorage.clear();
    }

    'gravou e leu valor no mesmo formato'() {
        const key = 'meu-valor';
        const number = 22;

        this.storage.setItem(key, number);
        const result = this.storage.getItem(key);

        assert(
            result === number, 'gravou e leu valor no mesmo formato'
        );
    }

    'retornando o número correto de chaves'() {
        const number = 22;

        this.storage.setItem('meu-chave1', number);

        assert(
            this.storage.length === 1, 'retornando o número correto de chaves'
        );
    }

    'total de chaves zerado após um comando clear'() {
        this.storage.setItem('meu-chave1', 22);
        this.storage.setItem('meu-chave2', 23);
        this.storage.clear();
        assert(
            this.storage.length === 0,
            'total de chaves zerado após um comando clear'
        );
    }

    'recebeu null ao requisitar uma chave que não existe'() {
        // Garantindo não existência da chave
        sessionStorage.clear();
        const result = this.storage.getItem('chave que não existe');
        assert(
            result === null, 'recebeu null ao requisitar uma chave que não existe'
        );
    }

    'recebeu null ao tentar ler uma chave que apagou'() {
        const key = 'meu-valor';
        const number = '22';
        this.storage.setItem(key, number);
        const result = this.storage.getItem(key);
        console.group('recebeu null ao tentar ler uma chave que apagou');
        assert(
            result === number, 'consegui gravar'
        );
        this.storage.removeItem(key);
        assert(
            this.storage.getItem(key) === null, 'recebeu null ao tentar ler uma chave que apagou'
        );
        console.groupEnd();
    }

    'sobrescrever valores funcionando'() {
        const key = 'meu-valor';
        const number = '22';
        const newNumber = number + 1;
        this.storage.setItem(key, number);
        this.storage.setItem(key, newNumber);
        const result = this.storage.getItem(key);

        assert(
            result === newNumber, 'sobrescrever valores funcionando'
        );
    }
}
