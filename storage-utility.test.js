import StorageUtility from './storage-utility.js';
import { TestCase } from './test-case.js';

const assert = (condition, description) => {
    console.log(`${condition ? '✅' : '❌'}: ${description}`);
}

export class StorageUtilityTest extends TestCase {

    prefix;
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
}
