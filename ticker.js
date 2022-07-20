
export class Ticker {

    /**
     * @param {Iterable<(time: number) => void>} pipeline 
     * @param { 'auto' | number } times 
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

        /**
         * @private
         * @param {number} [time] valor de tempo em milissegundos
         */
        this.update = (time  = 0) => {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;
            this.cumulatedTime += deltaTime;

            try {
                this.tickerID = requestAnimationFrame(this.update);

                if (this.times === 'auto' || this.cumulatedTime > this.times) {
                    for (let system of pipeline) {
                        system(this.times === 'auto' ? deltaTime : this.cumulatedTime);
                    }
                    if (this.times !== 'auto') {
                        this.cumulatedTime = 0; 
                    }
                }
            } catch(ex) {
                console.error(ex);
                this.clear();
            }
        }
    }

    /**
     * Método que para a execução do ticker
     */
    clear() {
        cancelAnimationFrame(this.tickerID);
    }

    /**
     * Método que inicializa o ticker
     */
    start() {
        if (!this.running) {
            this.update();
        }
    }
}
