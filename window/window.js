import { rgba } from '../colors.js';

class PositionalValues {
    /**
     * 
     * @param {number[]} values 
     */
    constructor(values) {
        if (values.length === 1)  {
            this.top = values[0];
            this.right = values[0];
            this.bottom = values[0];
            this.left = values[0];
        } else if (values.length === 2) {
            
            this.top = values[0];
            this.right = values[1];
            this.bottom = values[0];
            this.left = values[1];
        } else if (values.length === 3) {
            this.top = values[0];
            this.right = values[1];
            this.bottom = values[2];
            this.left = values[1];
        } else if (values.length === 4) {
            this.top = values[0];
            this.right = values[1];
            this.bottom = values[2];
            this.left = values[3];
        } else {
            const error = new TypeError(`Array com ${values.length} elementos`);
            //@ts-expect-error
            error.array = values;
            throw error;
        }
    }
}

export class Percentage extends Number {};

export class ViewWidth extends Number {};

export class ViewHeight extends Number {};

export function percentage(number) {
    return new Percentage(number);
}

export function viewWidth(number) {
    return new ViewWidth(number);
}

export function viewHeight(number) {
    return new ViewHeight(number);
}

export class Style {
    constructor({ display = 'block', margin = [0], padding = [0], size = 16, wrap = true, width = percentage(100), height = 'auto', visibility = true, color = rgba(0, 0, 0, 0) } = {}) {
        /** @type {PositionalValues} */
        this.margin =  new PositionalValues(margin),
        /** @type {PositionalValues} */
        this.padding = new PositionalValues(padding),
        this.width = width;
        /** @type {string|Percentage|ViewWidth|ViewHeight} */
        this.height = height;
        this.visibility = visibility;
        this.color = color;
        this.size = size;
        this.wrap = wrap;
        /** @type {'block'|'none'} *///@ts-expect-error
        this.display = display;
    }
}


