import { StorageUtilityTest } from '../storage-utility.test.js';
import { TickerTest } from '../ticker.test.js';
import { EventTest } from '../window/event.test.js';
import { NodeElementTest } from '../window/node-element.test.js';


/**
 * @todo João, refatorar esse trecho para fazer uso de uma função executora
 * para agregar informações e garantir que os testes não sejam interrompidos
 * por falhas em testes anteriores.
 * @todo João, talvez deveria trazer os resultados colapsado, apresentar de uma
 * forma mais compacta.
 * @todo João, considerar algum mecanismo de contagem de testes por
 * agrupamento. Talvez no nome do teste deveria aparecer uma contagem de
 * substestes. Será necessário incrementar a forma de controle dos testes
 * executados.
 */
StorageUtilityTest.run();
TickerTest.run();
EventTest.run();
NodeElementTest.run();
