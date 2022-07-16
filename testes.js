import StorageUtility from './storage-utility.js';
import { StorageUtilityTest } from './storage-utility.test.js';

const assert = (condition, description) => {
    console.log(`${condition ? '✅' : '❌'}: ${description}`);
}

const prefix = (Math.random() * 100000).toString(16);

grava_e_le_objetos_valores: {
    const storage = new StorageUtility(prefix, 'session', true);

    const key = 'meu-valor';
    const number = 22;

    {
        storage.setItem(key, number);
        const result = storage.getItem(key);

        assert(
            result === number, 'gravou e leu valor no mesmo formato'
        );
    }

    {
        assert(
            storage.length === 1, 'retornando o número correto de chaves'
        );

    }

    {
        storage.clear();
        assert(
            storage.length === 0,
            'total de chaves zerado após um comando clear'
        );
    }

    {
        const result = storage.getItem(key);
        assert(
            result === null, 'recebeu null ao requisitar uma chave que não existe'
        );
    }

    {
        storage.setItem(key, number);
        const result = storage.getItem(key);
        assert(
            result === number, 'consegui gravar novamente'
        );
        storage.removeItem(key);
        assert(
            storage.getItem(key) === null, 'recebey null ao tentar ler uma chave que apagou'
        );
    }

    {
        const newNumber = number + 1;
        storage.setItem(key, number);
        storage.setItem(key, newNumber);
        const result = storage.getItem(key);

        assert(
            result === newNumber, 'sobrescrever valores funcionando'
        );
    }

}

sessionStorage.clear();

StorageUtilityTest.run();
