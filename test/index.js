import { StorageUtilityTest } from '../storage-utility.test.js';
import { TickerTest } from '../ticker.test.js';
import { EventTest } from '../window/event.test.js';
import { NodeElementTest } from '../window/node-element.test.js';


/**
 * @todo João, refatorar esse trecho para fazer uso de uma função executora
 * para agregar informações e garantir que os testes não sejam interrompidos
 * por falhas em testes anteriores.
 */
StorageUtilityTest.run();
TickerTest.run();
EventTest.run();
NodeElementTest.run();
