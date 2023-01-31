import { rgba } from '../../colors.js';
import { NodeElement } from '../node-element.js';
import { percentage } from '../window.js';

/**
 * @todo João, dúvidas a resolver:
 * - como eu deixo o elemento filho com 100% da altura disponível dentro do pai -- ok
 * - tentar centralizar botões e ver a necessidade de margin auto
 */
export const viewPlayTetrominos = new NodeElement({
    type: 'view',
    style: {
        display: 'none',
        padding: [10],
        height: percentage(100),
        color: rgba(255, 0, 201),
    },
});
