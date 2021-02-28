import {TOperationTempateScheme} from "./Operation/operation_templates";


/**
 * Настройка включения таймера. (Не выключает таймер а прерывает обработку рассылки).
 * @type {boolean}
 */
let isTimerOn = true;
//exports.isTimerOn = isTimerOn;

/**
 * Заданная схема прохождения статусов операции.
 * @type {null | TOperationTempateScheme}
 */
let operationPresetTemplate: TOperationTempateScheme | null = null;

/**
 * АПИ управления найстройками.
 */
export const API = {
    /**
     * Включен ли таймер.
     */
    isTimerOn:() => isTimerOn,

    /**
     * Задать параметр isTimerOn
     * @param {boolean} val Значение.
     */
    setIsTimerOn: (val: boolean) => {
        isTimerOn = val
    },

    /**
     * Задаем шаблон.
     * @param {TOperationTempateScheme | null} template Шаблон для работы операции.
     */
    setOperationPresetTemplate: (template?: TOperationTempateScheme) => {
        operationPresetTemplate = template || null;
        console.log("===================== setOperationPresetTemplate =================");
        console.log(operationPresetTemplate);
    },

    /**
     * Получить шаблон.
     * @return {TOperationTempateScheme | null}
     */
    getOperationPresetTemplate: () => operationPresetTemplate
};
//exports.storage = storage;