import { StorageUtilityTest } from '../storage-utility.test.js';
import { TickerTest } from '../ticker.test.js';


/**
 * @todo João, refatorar esse trecho para fazer uso de uma função executora
 * para agregar informações e garantir que os testes não sejam interrompidos
 * por falhas em testes anteriores.
 */
StorageUtilityTest.run();
TickerTest.run();
