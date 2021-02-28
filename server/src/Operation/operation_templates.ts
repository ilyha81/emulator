import {EOperationStatus} from './operation';
import {CloudDocument} from "../Document/cloudDocument";

/**
 * Шаблоны поведения операций задаются последовательностью переходов из одного STATUS в другой спустя timeout время.
 * Т.е. мы задаем для текущего EOperationScheme.status переход в новый EOperationScheme.status через timeout секунд.
 * В шаблоне имеем последовательность переходов из начального статуса вплоть до конечного статуса.
 *
 * TODO Добавить функции переходов для состояний документов. Пока тока операции.
 * Итоговоый шаблон типа :
 *     current status: {
 *         status: nextStatus,           // Следующий статус
 *         timeout: number               // Таймаут после которого переходим к следующему статусу
 *         documentsStatusSwitcher: Function    //  Функция переходов в статусы документов.
 *     }
 */
type TTimeouts = Partial<Record<EOperationStatus, number>>

/**
 * Дефолтные таймауты для статусов.
 */
const defaultTimeouts: TTimeouts = {
    POSTED_SUCCESS: 20,
    CONFIRMED: 10,
};

/**
 * Шаблон перехода между статусами.
 * @prop {EOperationStatus} status Статус операции, в который надо перейти.
 * @prop {number} timeout Таймаут, через который произойдет переход.
 * @prop {Function} documentsStatusSwitcher Функция трансформации статусов документов, принимает на вход массив доков и выдает массив доков в новых статусах.
 */
export interface IOperationTemplate {
    status: EOperationStatus,
    timeout?: number,
    documentsStatusSwitcher?: (documents: CloudDocument[]) => CloudDocument[],
}

/**
 *
 * @param {EOperationStatus} newStatus Новый статус.
 * @param {EOperationStatus} currentStatus Текущий статус.
 * @param {TTimeouts} [params] Параметры для шаблона.
 * @return {IOperationTemplate} Шаблон перехода между статусами.
 */
const getTemplate = (newStatus: EOperationStatus, currentStatus: EOperationStatus, params?: TTimeouts): IOperationTemplate => {
    return {
        status: newStatus,
        timeout: (params && params[currentStatus]) || defaultTimeouts[currentStatus]
        // Тут будет docStatusChanger
    }
};

/**
 * Схема переходов по операции, состоящая из последовательных шаблонов.
 */
export type TOperationTempateScheme = Partial<Record<EOperationStatus, IOperationTemplate>>

/**
 * Генераторы шаблонов - функции, принимающие таймауты для статусов и возвращающие шаблон с таймаутами.
 */
export const OperationTemplate = {
    /**
     * Шаблон УСПЕШНОГО ПОДПИСАНИЯ.
     * @param {TTimeouts} [params] Параметры для базового успешного.
     */
    BASE_SUCCESS: (params?: TTimeouts): TOperationTempateScheme => {
        const template: TOperationTempateScheme = {};

        // Переход POSTED_SUCCESS => CONFIRMED
        template[EOperationStatus.POSTED_SUCCESS] = getTemplate(EOperationStatus.CONFIRMED, EOperationStatus.POSTED_SUCCESS, params);

        // Переход CONFIRMED => PROCESSED_SUCCESS
        // КОНЕЧНЫЙ СТАТУС.
        template[EOperationStatus.CONFIRMED] = getTemplate(EOperationStatus.PROCESSED_SUCCESS, EOperationStatus.CONFIRMED, params);

        return template
    },

    /**
     * ОТМЕНА В МОБИЛЬНОМ УСТРОЙСТВЕ.
     * @param {TTimeouts} [params] Параметры для базового отмена.
     */
    BASE_CANCELLED: (params?: TTimeouts): TOperationTempateScheme => {
        const template: TOperationTempateScheme = {};

        // Переход POSTED_SUCCESS => ANSWER_REFUSED
        // КОНЕЧНЫЙ СТАТУС.
        template[EOperationStatus.POSTED_SUCCESS] = getTemplate(EOperationStatus.ANSWER_REFUSED, EOperationStatus.POSTED_SUCCESS, params);

        return template
    },

    /**
     * ОПЕРАЦИЯ ОБРАБОТАНА С ОШИБКОЙ В АС СББОЛ
     * @param {TTimeouts} [params] Параметры для ошибки из CONFIRMED.
     */
    ERROR_PROCESSED_FROM_CONFIRMED: (params?: TTimeouts): TOperationTempateScheme => {
        const template: TOperationTempateScheme = {};

        // Переход POSTED_SUCCESS => CONFIRMED
        template[EOperationStatus.POSTED_SUCCESS] = getTemplate(EOperationStatus.CONFIRMED, EOperationStatus.POSTED_SUCCESS, params);

        // Переход CONFIRMED => PROCESSED_FAILED
        // КОНЕЧНЫЙ СТАТУС.
        template[EOperationStatus.CONFIRMED] = getTemplate(EOperationStatus.PROCESSED_FAILED, EOperationStatus.CONFIRMED, params)

        return template
    },

    /**
     * ОШИБКИ ЛИМИТОВ, В ДСС ДАЖЕ НЕ ОТПРАВЛЕНО.
     * @param {TTimeouts} [params] Параметры для ошибки из SENDING.
     */
    ERROR_PROCESSED_FROM_SENDING: (params?: TTimeouts): TOperationTempateScheme => {
        const timeouts = {...params} || {}; // ПО ДЕФОЛТУ СРАЗУ ИЗ СЕНДИНГА В ОШИБКУ.
        !timeouts[EOperationStatus.SENDING] && (timeouts[EOperationStatus.SENDING] = 0);

        const template: TOperationTempateScheme = {};

        // Переход SENDING => PROCESSED_FAILED
        // КОНЕЧНЫЙ СТАТУС.
        template[EOperationStatus.SENDING] = getTemplate(EOperationStatus.PROCESSED_FAILED, EOperationStatus.SENDING, timeouts);

        return template
    },

    /**
     * КОЛБЭК С ОШИБКОЙ ОПЕРАЦИИ
     * @param {TTimeouts} [params] Параметры для ошибки из CONFIRMED.
     */
    ERROR_ANSWER_FROM_CONFIRMED: (params?: TTimeouts): TOperationTempateScheme => {
        const template: TOperationTempateScheme = {};

        // Переход POSTED_SUCCESS => CONFIRMED
        template[EOperationStatus.POSTED_SUCCESS] = getTemplate(EOperationStatus.CONFIRMED, EOperationStatus.POSTED_SUCCESS, params);

        // Переход CONFIRMED => ANSWER_FAILED
        // КОНЕЧНЫЙ СТАТУС.
        template[EOperationStatus.CONFIRMED] = getTemplate(EOperationStatus.ANSWER_FAILED, EOperationStatus.CONFIRMED, params);

        return template
    },

    /**
     * КОЛБЭК С ОШИБКОЙ ОПЕРАЦИИ
     * @param {TTimeouts} [params] Параметры для ошибки из POSTED_SUCCESS.
     */
    ERROR_ANSWER_FROM_POSTED: (params?: TTimeouts): TOperationTempateScheme => {
        const template: TOperationTempateScheme = {};

        // Переход POSTED_SUCCESS => ANSWER_FAILED
        // КОНЕЧНЫЙ СТАТУС.
        template[EOperationStatus.POSTED_SUCCESS] = getTemplate(EOperationStatus.ANSWER_FAILED, EOperationStatus.POSTED_SUCCESS, params);

        return template
    },


    /**
     * ОШИБКА ОТПРАВКИ В ОКей.
     * @param {TTimeouts} [params] Параметры для ошибки из SENDING.
     */
    ERROR_POSTED_FROM_SENDING: (params?: TTimeouts): TOperationTempateScheme => {
        const timeouts = {...params} || {}; // ПО ДЕФОЛТУ СРАЗУ ИЗ СЕНДИНГА В ОШИБКУ.
        !timeouts[EOperationStatus.SENDING] && (timeouts[EOperationStatus.SENDING] = 0);
        const template: TOperationTempateScheme = {};

        // Переход SENDING => POSTED_FAILED
        // КОНЕЧНЫЙ СТАТУС.
        template[EOperationStatus.SENDING] = getTemplate(EOperationStatus.POSTED_FAILED, EOperationStatus.SENDING, timeouts);

        return template
    },

    /**
     * ОШИБКА ОТПРАВКИ В ОКей.
     * @param {TTimeouts} [params] Параметры для ошибки из SENDING.
     */
    ERROR_SENDING_FROM_SENDING: (params?: TTimeouts): TOperationTempateScheme => {
        const timeouts = {...params} || {}; // ПО ДЕФОЛТУ СРАЗУ ИЗ СЕНДИНГА В ОШИБКУ.
        !timeouts[EOperationStatus.SENDING] && (timeouts[EOperationStatus.SENDING] = 0);
        const template: TOperationTempateScheme = {};

        // Переход SENDING => SENDING_FAILED
        // КОНЕЧНЫЙ СТАТУС.
        template[EOperationStatus.SENDING] = getTemplate(EOperationStatus.SENDING_FAILED, EOperationStatus.SENDING, timeouts);
        return template
    },

};
//exports.OperationTemplate = OperationTemplate;