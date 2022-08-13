
export class TestCase {

    /**
     * Procedimento que será chamado antes de cada método de teste.
     * @returns {void}
     */
    beforeEach() { }

    /**
     * Procedimento que será chamado antes de todos os outros métodos. Ideal 
     * para realizar procedimentos de inicialização que precisam ser feitos
     * apenas uma vez durante todo o ciclo de teste da classe. Logo antes de
     * iniciar a execução dos testes.
     * @returns {void}
     */
    beforeAll() { }

    /**
     * Procedimento que será chamado após cada método de teste
     * @returns {void}
     */
    afterEach() { }

    /**
     * Procedimento que será chamado após todos os outros métodos. Ideal 
     * para realizar procedimentos de encerramento que precisam ser feitos
     * apenas uma vez durante todo o ciclo de teste da classe. Logo após o
     * término da execução de todos os testes.
     * @returns {void}
     */
    afterAll() { }

    static run() {
        const excluded = ['constructor', 'beforeEach', 'beforeAll', 'afterEach', 'afterAll',];
        const instance = new this;

        console.group(this.name);
        instance.beforeAll();
        for (const method of Object.getOwnPropertyNames(this.prototype)) {
            if (excluded.indexOf(method) !== -1)
                continue;
            const func = instance[method];
            if (typeof func !== 'function')
                continue;

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
