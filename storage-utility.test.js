import StorageUtility from './storage-utility.js';

const assert = (condition, description) => {
    console.log(`${condition ? '✅' : '❌'}: ${description}`);
}

class TestCase {

    /**
     * beforeEach
     * @return {void}
     */
     beforeEach() {}

    /**
     * beforeAll
     * @return {void}
     */
    beforeAll() {}

    /**
     * afterEach
     * @return {void}
     */
    afterEach() {}

    /**
     * afterAll
     * @return {void}
     */
    afterAll() {}

    static run() {
        const excluded = [ 'constructor', 'beforeEach',  'beforeAll',  'afterEach',  'afterAll',];
        const instance =  new this;

        console.group(this.name);
        instance.beforeAll();
        for (const method of Object.getOwnPropertyNames(this.prototype)) {
            if (excluded.indexOf(method) !== -1) continue;
            const func = instance[method];
            if (typeof func !== 'function') continue;

            instance.beforeEach();
            try {
                func.call(instance);
            } catch (error) {
                console.error(error);
            }
            instance.afterEach();
        }
        instance.afterAll();
        console.groupEnd();
    }
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
