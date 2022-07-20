
export class TestCase {

    /**
     * beforeEach
     * @return {void}
     */
    beforeEach() { }

    /**
     * beforeAll
     * @return {void}
     */
    beforeAll() { }

    /**
     * afterEach
     * @return {void}
     */
    afterEach() { }

    /**
     * afterAll
     * @return {void}
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
