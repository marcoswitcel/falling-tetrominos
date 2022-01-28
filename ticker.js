
export class Ticker {
    /**
     * @param {Iterable} pipeline 
     * @param { 'auto' | number} times 
     */
    constructor(pipeline, times = 'auto') {
        this.running = false;
        this.lastTime = 0;
        this._tickerID = null;
        this.pipeline = pipeline;
        this.times = (times === 'auto') ? 'auto' : 1000 / times;
        this.cumulatedTime = 0;

        this._update = (time  = 0) => {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;
            this.cumulatedTime += deltaTime;

            try {
                this._tickerID = requestAnimationFrame(this._update);

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

    clear() {
        cancelAnimationFrame(this._tickerID);
    }

    start() {
        if (!this.running) {
            this._update();
        }
    }
}
