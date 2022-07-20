import { Ticker } from "./ticker.js";


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

/**
 * @todo João, terminar de analisar se os casos principais estão cobertos
 */
export class TickerTest extends TestCase {
    requestAnimationFrame;
    fns;

    runAFrame() {
        try {
            const fns = [...this.fns];
            this.fns.length = 0;
            for (const fn of fns) {
                fn(performance.now());
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    beforeAll() {
        this.requestAnimationFrame = window.requestAnimationFrame;
        this.fns = [];

        window.requestAnimationFrame = (fn) => {
            this.fns.push(fn);
            return this.fns.length;
        }
    }

    afterAll() {
        window.requestAnimationFrame = this.requestAnimationFrame;
    }

    ['testa se executou']() {
        let rodei = 0;
        const testFunction = (deltatime) => {
            rodei++;
        };

        const ticker = new Ticker([ testFunction ]);
        ticker.start();
        assert(rodei === 1, 'rodei a primeira fez no start');
        this.runAFrame();
        assert(rodei === 2, 'rodei a segunda vez no frame');

        assert(this.fns.length === 1, 'deixei uma requisição para rodar no próximo frame');
    }
}