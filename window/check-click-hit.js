
/**
 * @typedef {import('./node-element.js').NodeElement} NodeElement
 */

/**
 *
 * @param {NodeElement} rootNode
 * @param {number} x
 * @param {number} y
 * @param {number[]} [offset]
 * @return {NodeElement} Elemento que sofreu o click
 */
export function checkClickHit(rootNode, x, y, offset = [0, 0]) {
    let [offsetX, offsetY] = offset;

    // Offset com a margin do próprio elemento
    offsetX += rootNode.style.margin.left;
    offsetY += rootNode.style.margin.top;

    if (x >= offsetX && x <= offsetX + rootNode.width && y >= offsetY && y <= offsetY + rootNode.height) {

        // Novo offset com o padding
        offsetX += rootNode.style.padding.left;
        offsetY += rootNode.style.padding.top;


        for (const child of rootNode.children) {
            if (child.style.display === 'none')
                continue;

            let collidedElement = checkClickHit(child, x, y, [offsetX, offsetY]);

            if (collidedElement) {
                return collidedElement;
            }

            offsetY += child.height + child.style.margin.top + child.style.margin.bottom;
        }

        return rootNode;
    }

    return null;
}
