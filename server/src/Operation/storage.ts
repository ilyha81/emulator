import {BehaviorSubject} from "rxjs";

import {Operation, EOperationStatus, IOperationView} from './operation';
import {CloudDocument, IDocument} from '../Document/cloudDocument';
import {Archieve} from './operationArchieve';

/**
 * Хранилище для операций
 * @type {Map<string, Operation>}
 */
const operationStorage: Map<string, Operation> = new Map();

/**
 * Счетчик операций, добавляем к идентификатору для ориентирования.
 * @type {number}
 */
let counter = 0;

/**
 * Храним пуши по криптопрофилям. НЕЕЕЕ!!! Надо мапа - криптопрофиль - БихейвиорСабджект. Эмитить методы!
 * cryptoId : BehaviorSubject
 * BehaviorSubject.next( (shouldClean: boolean) => {
 *    shouldClean &&  BehaviorSubject.next( () => false );
 *    return: true
 * }  )
 *
 * А в Вью - BehaviorSubject.subscribe( (cb)=> {
 *      if( cb() ){
 *          emitPush();
 *          отмена операции!!!!
 *      } })
 * !!!!!!!!!!!!!!!!!!!! ВОТ ТАК ДОЛЖНО РАБОТАТЬ !!!!!!!!!!!!!!!!!!!!
 *
 * TODO Пока тут, при усложнении логики убрать в отдельный модуль.
 * @type {Map<{cryptoprofile: string, BehaviorSubject: Observer}>}
 */
const webPushesObserver: Map<string, BehaviorSubject<(shouldClean: boolean) => boolean>> = new Map();


export const storage = {

    /**
     * Метод проверки непустоты хранилища.
     * @return {boolean}
     */
    hasOperation: (): boolean => !!operationStorage.size,

    /**
     *  Добавление операции в хранилище.
     * @param data Данные для создания операции: documents = документы, cryptoprofileId = криптопрофиль пользака.
     * @returns {Operation} Созданную операцию.
     */
    create: (data: { cryptoprofileId: string, documents: IDocument[] }): Operation | null => {
        if (Array.isArray(data.documents)) {
            const id = 'operation_' + counter++;

            const operation = new Operation({
                    id,
                    cryptoprofileId: data.cryptoprofileId
                },
                data.documents.map((doc: IDocument) => new CloudDocument(doc)),
                {onDelete: storage.delete, onStatusChange: storage.onOperationStatusChange}
                // Тока сделать чтоб один летел а не много.
            );
            operationStorage.set(id, operation);

            storage.archieve(operation.getView());

            return operation
        } else {
            console.log("STORAGE: create operation ERROR - documents not an array");
            return null;
        }
    },

    /**
     * Удаление операции из хранилища.
     * @param {string} id Идентификатор операции.
     * @returns {boolean} успех если удалена, неуспех если не найдена.
     */
    delete: (id: string) => {
        if (operationStorage.has(id)) {
            operationStorage.get(id)?.destroy();
            operationStorage.delete(id);
            return true
        }
        return false
    },

    /**
     * Метод отмены операции.
     * @param {string} id Идентификатор операции, которую отменяем.
     * @return {null|{documents: Array, id, timer: number, createDate: string, status: string, cryptoprofileId: string, dataSourceMode: string}}
     */
    cancel: (id: string) => {
        const operation = operationStorage.get(id);
        if (operation) {
            operationStorage.set(id, operation.setStatus(EOperationStatus.ANSWER_REFUSED));
            return operationStorage.get(id)?.getView();
        }
        return null
    },

    /**
     * Обновляем данные по операции.
     * @param {Operation} operation Новые данные по операции.
     * @returns {boolean} Успех - если существует операция с таким id, неуспех, если не существует.
     */
    update: (operation: Operation) => {
        if (operationStorage.has(operation.id)) {
            operationStorage.delete(operation.id);
            operationStorage.set(operation.id, operation);
            return true
        }
        return false
    },

    /**
     * Чистим хранилище, если есть что чистить => true.
     * Если было пустое => false.
     * @return {boolean}
     */
    destroyStorage: () => {
        if (storage.hasOperation()) {
            operationStorage.forEach(operation => operation.destroy());
            operationStorage.clear();
            return true
        } else {
            return false
        }
    },

    // Получить всю мапу.
    getMap: () => {
        return operationStorage
    },

    /**
     * Считать операции.
     * @param {string} [cryptoProfile] Криптопрофиль для отбора.
     * @returns {Array} Массив операций.
     */
    getOperations: (cryptoProfile?: string): IOperationView[] => {
        const result: IOperationView[] = [];
        if (operationStorage.size > 0) {
            operationStorage.forEach(operation => {
                if (cryptoProfile) {
                    const operationView = operation.getView();
                    cryptoProfile === operationView.cryptoprofileId && result.push(operationView);
                } else {
                    result.push(operation.getView());
                }
            });
        }

        return result
    },

    /**
     * На изменение операции сохраняем криптопрофиль в пуши.
     * @param {IOperationView} operationView Данные операции.
     */
    onOperationStatusChange: (operationView: IOperationView) => {
        if (!webPushesObserver.has(operationView.cryptoprofileId)) {
            webPushesObserver.set(operationView.cryptoprofileId, new BehaviorSubject((val: boolean) => val));
        }

        // Юлядь забыл как работает....
        const BS = webPushesObserver.get(operationView.cryptoprofileId);
        BS?.next(
            (shouldClean: boolean) => {
                shouldClean && BS.next(() => false);
                return true
            }
        );


        // Можно попробовать и так: РАБОТАЕТ! Но логику подогнать надо.
        // const BS = new Rx.BehaviorSubject();
        // BS.next(()=>{BS.complete(); return 123});
        // Или попробовать switchMap (!!!)

        storage.archieve(operationView);
    },

    // НИХУЯ!!! НЕПРАВИЛЬНОЕ ПОВЕДЕНИЕ!!! Надо сделать так, что при подписке вызывался бы чистильщик!!!!
    /**
     * Проверить наличие пуша для криптопрофиля.
     * @param {string} cryptoprofileId Криптопрофиль
     * @param {boolean} shouldClear Надо ли очищать сторедж, дефолтно надо чтоб не повторялись пуши.
     */
    /*hasPushForCryptoprofile: (cryptoprofileId, shouldClear = true)=> {
        if(webPushes.has(cryptoprofileId)) {
            //чистим значение и возвращаем тру.
            shouldClear && webPushes.delete(cryptoprofileId);
            return true
        } else {
            return false
        }
    },*/

    /**
     * Отправляем операцию в архив.
     * @param {operationView} operationView Данные по операции.
     * @return {*|void}
     */
    archieve: (operationView: IOperationView) => Archieve.add(operationView)
};