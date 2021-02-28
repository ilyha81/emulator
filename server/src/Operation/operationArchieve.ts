/**
 * АРХИВ ОПЕРАЦИЙ!
 * Сюда складируем операции, чисто VIEW.
 *
 * TODO добавить потом хранение в файле.
 */

/**
 * Архив операций
 * @type {Map<string, {operation: OperationView, lastUpdateTime: string}>}
 */
const operationsArchieve = new Map();

export const Archieve = {
    /**
     * Добавляем операцию в архив.
     * @param operation
     */
    add: (operation: any) => {
        operationsArchieve.set(operation.id, {operation, lastUpdateTime: new Date().toLocaleString()});
    },

    /**
     * Получить все операции из архива.
     * @return {OperationView[]} Массив с отображением операций.
     */
    getAll: () => Array.from(operationsArchieve.values())
};
//exports.storage = storage;