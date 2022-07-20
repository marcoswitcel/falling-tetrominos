import { Ticker } from './ticker.js';
import { TestCase } from './test-case.js';


const assert = (condition, description) => {
    console.log(`${condition ? '✅' : '❌'}: ${description}`);
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