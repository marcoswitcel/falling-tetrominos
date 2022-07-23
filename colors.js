
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

    /**
     * 
     * @param {number} [value] Valor de escurecimento. Exemplo: 0.1 equivale
     * a dizer que a cor terá todos os canais de cor reduzidos em 10% do valor
     * atual.
     * @returns {RGBA}
     */
    darken(value = 0.1) {
        return new RGBA(
            Math.max(this.r * (1 - value), 0),
            Math.max(this.g * (1 - value), 0),
            Math.max(this.b * (1 - value), 0),
        );
    }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
