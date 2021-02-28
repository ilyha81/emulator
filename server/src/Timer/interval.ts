import {interval} from 'rxjs';
import {filter} from 'rxjs/operators';
import {API} from '../SETUP';

/**
 * Создаем обзервер с таймером.
 * @type {Observable<number>}
 */
export const Timer = interval(1000).pipe(filter(() => API.isTimerOn()));
    // Пропускаем если таймер выключен в найстройках.