//@ts-check

/**
 * @param {number} r Entre 0 e 255
 * @param {number} g Entre 0 e 255
 * @param {number} b Entre 0 e 255
 * @param {number?} a Entre 0 e 255
 * 
 * @return {RGBA}
 */
export function rgba(r, g, b, a = 255) {
    return new RGBA(r, g, b, a);
}

export class RGBA {
    /**
     * @param {number} r Entre 0 e 255
     * @param {number} g Entre 0 e 255
     * @param {number} b Entre 0 e 255
     * @param {number?} a Entre 0 e 255
     */
    constructor(r, g, b, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}