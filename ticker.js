
export class Ticker {

    /**
     * @param {Iterable<(time: number) => void>} pipeline Iterável com a
     * sequência de função/sistemas a serem executados em cada tick.
     * @param { 'auto' | number } times Configura se a `pipeline` será
     * executada a cada frame ou em um intervalo de tempo predeterminado.
     * o valor `'auto'` configura para rodar a cada frame e se for passado
     * um número, esse número indicara a quantidade de execuções por minuto
     * esperadas.
     */
    constructor(pipeline, times = 'auto') {
        /**
         * @private
         * @type {boolean}
         */
        this.running = false;
        /**
         * @private
         * @type {number}
         */
        this.lastTime = 0;
        /**
         * @private
         * @type {number}
         */
        this.tickerID = null;
        /**
         * @private
         * @type {Iterable<(time: number) => void>}
         */
        this.pipeline = pipeline;
        /**
         * @private
         * @type {'auto' | number}
         */
        this.times = (times === 'auto') ? 'auto' : 1000 / times;
        /**
         * @private
         * @type {number}
         */
        this.cumulatedTime = 0;
    }

    /**
     * @private
     * @param {number} [time] valor de tempo em milissegundos
     */
    update(time = 0) {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.cumulatedTime += deltaTime;

        try {
            this.tickerID = requestAnimationFrame((timestamp) => this.update(timestamp));

            if (this.times === 'auto' || this.cumulatedTime > this.times) {
                for (const system of this.pipeline) {
                    system(this.times === 'auto' ? deltaTime : this.cumulatedTime);
                }
                this.cumulatedTime = 0;
            }
        } catch (ex) {
            console.error(ex);
            this.clear();
        }
    }

    /**
     * Método que para a execução do ticker
     * @return {void}
     */
    clear() {
        cancelAnimationFrame(this.tickerID);
    }

    /**
     * Método que inicializa o ticker
     * @return {void}
     */
    start() {
        if (!this.running) {
            this.update();
        }
    }
}
