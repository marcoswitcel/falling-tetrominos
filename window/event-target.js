
export class Event {
    /**
     * @param {string} type 
     * @param {any} [data]
     */
    constructor(type, data = null) {
        this.type = type;
        this.data = data;
    }
}

export class EventTarget {
    constructor() {
        /** @type {Map<string, Set<(any) => void>>} */
        this.eventMap = new Map;
    }

    /**
     * 
     * @param {string} type 
     * @param {(any) => void} handler
     * @returns {void}
     */
    addListener(type, handler) {
        if (!this.eventMap.has(type)) {
            this.eventMap.set(type, new Set);
        }
        this.eventMap.get(type).add(handler);
    }

    /**
     * 
     * @param {string} type 
     * @param {(any) => void} handler
     * @returns {void}
     */
    removeListener(type, handler) {
        if (this.eventMap.has(type)) {
            this.eventMap.get(type).delete(handler);
        }
    }

    /**
     * 
     * @param {Event} event 
     * @returns {void}
     */
    dispatchEvent(event) {
        const handlers = this.eventMap.get(event.type) || new Set;
        for (const handler of handlers) {
            try {
                handler(event);
            } catch(ex) {
                console.error(ex);
            }
        }
    }
}

export default {
    Event,
    EventTarget
}
