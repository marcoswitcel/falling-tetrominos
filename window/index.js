import { NodeElement } from './node-element.js';
import { rgba } from '../colors.js';
import { drawRect } from '../draw.js';
import { createCanvas } from '../util.js';
import { menuIDs, viewMenu }  from './views/menu.view.js';
import { viewConfig, configIDs }  from './views/config.view.js';
import StorageUtility from '../storage-utility.js';
import { drawElement } from './draw-element.js';
import { checkClickHit } from './check-click-hit.js';
import { Ticker } from '../ticker.js';
import { setPageTitle } from './utility.js';

function runTest() {
    
    const width = 800;
    const height  = 500;

    const canvas = createCanvas(width, height, document.body);
    canvas.style.margin = 'auto';
    canvas.style.display = 'block';
    const context = canvas.getContext('2d');
    const  { button, text } = menuIDs;
    const root = new NodeElement({
        type: 'window',
        style: {
            padding: [ 15 ],
            width: width,
            height: height,
            margin: [ 0 ],
            color: rgba(0,0,0,0.1)
        },
        children: [
            viewMenu,
            viewConfig
        ],
    });

    const storage = new StorageUtility('window');
    menuIDs.addButtonText.data.value.count =  storage.getItemWithInialization('count', 0);

    new Ticker([
        () => {
            drawRect(context, 0, 0, width, height, rgba(255, 255, 255));
            drawElement(context, root);
        }
    ]).start();

    test: {
        break test;
        root.addListener('click', (event) => {
            console.log(event.currentTarget.type, event.target.type, 'root');
        });
        root.addListener('click', (event) => {
            console.log(event.currentTarget.type, event.target.type, 'root2');
        });
    
        button.addListener('click', (event) => {
            console.log(event.currentTarget.type, event.target.type, 'button');
            // event.defaultPrevented = true;
        });

        root.dispatchEvent('click', { x: 0, y: 0});
        button.dispatchEvent('click', { x: 1, y: 1});

        root.addListener('click', ({ target }) => {
            root.appendChild(target);
        });
    }

    setPageTitle('Menu - Window System');
    
    menuIDs.button.addListener('click', (event) => {
        viewMenu.style.display = 'none';
        viewConfig.style.display = 'block';
        setPageTitle('Configurações - Window System');
    });

    menuIDs.addButton.addListener('click', (event) => {
        let count = storage.getItem('count');
        count++;

        storage.setItem('count', count);
        menuIDs.addButtonText.data.value.count =  count;
        menuIDs.addButtonText.data.preprocessedText = null;
    });

    configIDs.button.addListener('click', (event) => {
        viewConfig.style.display = 'none';
        viewMenu.style.display = 'block';
        setPageTitle('Menu - Window System');
    });

    root.addListener('click', (event) => {
        const { x, y } = event.data;
        text.data.value = `\nmouse clicked at x: ${x} y: ${y}\n`;
        text.data.preprocessedText = null;
    });

    menuIDs.mouseInOutdButton.addListener('mousein', (event) => {
        menuIDs.mouseInOutText.data.value.mouseIn = true;
        menuIDs.mouseInOutText.data.preprocessedText = null;
        console.log(event);
    });

    menuIDs.mouseInOutdButton.addListener('mouseout', (event) => {
        menuIDs.mouseInOutText.data.value.mouseIn = false;
        menuIDs.mouseInOutText.data.value.mouseOut = true;
        menuIDs.mouseInOutText.data.preprocessedText = null;
        console.log(event);
    });


    /**
     * Esses são os eventos nativos que são usados para coletar input e dispara os eventos customizados
     */
    canvas.addEventListener('click', (event) => {
        const { offsetX : x, offsetY : y  } = event;

        const clickedElement = checkClickHit(root, x, y);

        if (clickedElement) {
            clickedElement.dispatchEvent('click', { x, y });
        }
    });

    /**
     * @todo Refatorar para um objeto que gerencie os estados dos listeners.
     * @todo Por hora ele considera mouseout mesmo quando o novo elemento em com mousein for filho do antigo. Pensando
     * em adicionar uma propriedade `path` ao `ElementEvent` que quando presente permitirá ao método `defaultHandler`
     * saber para onde propagar os eventos, já que com o `mousein` me parece o ideal o evento vir da `raiz` para o elemento
     * folha. Isso vai gerar a necessidade de criar um `path` de propagação dos eventos de `mousein` e `mouseout` antes de fazer
     * o dispatch, inicialmente me parece que apenas `mousein` e `mouseout` vão precisar deste recurso.
     * 
     */
    state: {
        let mouseInsideOf = null;
        canvas.addEventListener('mousemove', (event) => {
            const { offsetX : x, offsetY : y  } = event;
    
            const newMouseInside = checkClickHit(root, x, y);
    
            if (mouseInsideOf && mouseInsideOf !== newMouseInside) {
                mouseInsideOf.dispatchEvent('mouseout', { x, y });
            }

            if (newMouseInside !== mouseInsideOf) {
                mouseInsideOf = newMouseInside;
                newMouseInside.dispatchEvent('mousein', { x, y });
            }
        });
    }
}

runTest();
