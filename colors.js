
/**
 * Função que facilita a criação de instância da classe color @see {@link RGBA}
 * @param {number} r Entre 0 e 255 (integer)
 * @param {number} g Entre 0 e 255 (integer)
 * @param {number} b Entre 0 e 255 (integer)
 * @param {number} [a] Entre 0 e 1 (flot)
 * @return {RGBA}
 */
export function rgba(r, g, b, a = 1) {
    return new RGBA(r, g, b, a);
}

export class RGBA {

    /**
     * Contrói uma instância de elemento usada para representar uma cor rgb com
     * canal alfa.
     * @param {number} r Entre 0 e 255 (integer)
     * @param {number} g Entre 0 e 255 (integer)
     * @param {number} b Entre 0 e 255 (integer)
     * @param {number} [a] Entre 0 e 1 (float)
     */
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
