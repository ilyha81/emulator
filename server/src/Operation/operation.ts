import {CloudDocument, IDocumentView} from "../Document/cloudDocument";
import {Timer} from '../Timer/interval';

const getOperationPresetTemplate = require('../SETUP').API.getOperationPresetTemplate;

export enum EOperationStatus {
    POSTED_SUCCESS = "POSTED_SUCCESS",
    ANSWER_REFUSED = "ANSWER_REFUSED",
    PROCESSED_SUCCESS = "PROCESSED_SUCCESS",
    CONFIRMED = "CONFIRMED",
    PROCESSED_FAILED = "PROCESSED_FAILED",
    ANSWER_FAILED = "ANSWER_FAILED",
    SENDING = "SENDING",
    POSTED_FAILED = "POSTED_FAILED",
    SENDING_FAILED = "SENDING_FAILED",
}

/**
 * Заданные значения для статусов операций - статус + таймер.
 */
const OperationScheme: Record<EOperationStatus, { status: EOperationStatus, timer: number }> = {
    [EOperationStatus.POSTED_SUCCESS]: {status: EOperationStatus.POSTED_SUCCESS, timer: 300},
    [EOperationStatus.ANSWER_REFUSED]: {status: EOperationStatus.ANSWER_REFUSED, timer: 0},
    [EOperationStatus.PROCESSED_SUCCESS]: {status: EOperationStatus.PROCESSED_SUCCESS, timer: 120},
    [EOperationStatus.CONFIRMED]: {status: EOperationStatus.CONFIRMED, timer: 120},
    [EOperationStatus.PROCESSED_FAILED]: {status: EOperationStatus.PROCESSED_FAILED, timer: 120},
    [EOperationStatus.ANSWER_FAILED]: {status: EOperationStatus.ANSWER_FAILED, timer: 120},
    [EOperationStatus.SENDING]: {status: EOperationStatus.SENDING, timer: 300},
    [EOperationStatus.POSTED_FAILED]: {status: EOperationStatus.POSTED_FAILED, timer: 120},
    [EOperationStatus.SENDING_FAILED]: {status: EOperationStatus.SENDING_FAILED, timer: 120},
};
//exports.EOperationScheme = EOperationScheme;

const getOperationState = (status: EOperationStatus) => OperationScheme[status];

/**
 * Массив конечных статусов операции.
 * @type {(string)[]}
 */
const finalStatuses = [EOperationStatus.ANSWER_FAILED, EOperationStatus.ANSWER_REFUSED, EOperationStatus.PROCESSED_FAILED, EOperationStatus.PROCESSED_SUCCESS];

/**
 * Интерфейс операции.
 * @param {string} id Идентификатор операции.
 * @param {string} cryptoprofileId Криптопрофиль.
 * @param {{onDelete: (id) => void, onStatusChange: (OperationView) => void}} callbacks Колбэки вызываемые при
 */
interface IOperation {
    id: string;
    cryptoprofileId: string;
}

/**
 * Колбэки вызываемые при работе Операции.
 */
interface IOperationCallbacks {
    onDelete: (id: string) => void;
    onStatusChange: (OperationView: any) => void;
}

/**
 * Модель значений операции, возвращаемая для рассылки.
 */
export interface IOperationView extends IOperation{
    documents: IDocumentView[],
    status: EOperationStatus,
    timer: number,
    createDate: string,
    dataSourceMode: string
}

/**
 * Операция ОЭП.
 */
export class Operation {
    /**
     * Идентификатор операции.
     */
    id: string;
    /**
     * Дата создания операции.
     */
    createDate: string;
    /**
     * Криптопрофиль.
     */
    cryptoprofileId: string;
    /**
     * Режим, константное значение.
     */
    dataSourceMode: string = "MAIN"; // ДЕФОЛТНОЕ ЗНАЧЕНИЕ
    /**
     * Время жизни операции.
     */
    timer: number = 0;
    /**
     * Статус операции.
     */
    status: EOperationStatus ;

    /**
     * Массив документов.
     */
    documents: CloudDocument[];
    /**
     * Подписка на таймер.
     */
    TimerSubscribe: any;
    /**
     * Колбэки;
     */
    callbacks: IOperationCallbacks;

    /**
     * Конструктор
     * @param {string} id Идентификатор операции.
     * @param {CloudDocument[]} documents Массив документов.
     * @param {string} cryptoprofileId Криптопрофиль.
     * @param {IOperationCallbacks} callbacks Колбэки вызываемые при
     * уничтожении операции после её окончания и при изменении статуса.
     */
    constructor ({id, cryptoprofileId}: IOperation, documents: CloudDocument[], callbacks: IOperationCallbacks) {
        console.log("СОЗДАНИЕ ОПЕРАЦИИ С ID = " + id);
        console.log(documents);
        this.id = id;

        this.createDate = new Date().toLocaleString();
        this.documents = documents;
        this.cryptoprofileId = cryptoprofileId;
        this.status = getOperationState(EOperationStatus.POSTED_SUCCESS).status;
        this.timer = getOperationState(EOperationStatus.POSTED_SUCCESS).timer;

        this.TimerSubscribe = Timer.subscribe(() => this.updateOperationTimer(this.timer - 1, callbacks.onDelete));
        // ДОБАВИТЬ КОЛБЭК ОН СТАТУС ЧЕНДЖ! СЛАТЬ В НЕГО ВЬЮШКУ!
        this.callbacks = callbacks;
    }

    /**
     * Метод установки статуса операции.
     * @param {EOperationStatus} status Статус операции.
     */
    setStatus = (status: EOperationStatus): Operation => {
        const operationPresetTemplate = getOperationPresetTemplate();
        // Проверка на шаблон - если таймер 0 - сразу идем на следующий шаг
        const templateTimeout = operationPresetTemplate && operationPresetTemplate[status]?.timeout;

        //Перегоняем документы.
        //operationPresetTemplate && operationPresetTemplate[status]?. this.documents =

        if (typeof templateTimeout === "number" && templateTimeout === 0) {
            // Переходим на следующий шаг шаблона.
            this.setStatus(operationPresetTemplate[status].status)
        } else {
            this.status = status;
            this.setTimer(getOperationState(status).timer);

            // дергаем колбэк.
            this.callbacks.onStatusChange(this.getView());
            //return this
        }

        return this
    };

    /**
     * Выставляем новый таймер принудительно (ЛЮБОЙ ВКЛЮЧАЯ НОЛЬ ИЛИ ОТРИЦАТЕЛЬНЫЙ) - для проверок.
     * @param {number} timer Таймаут.
     */
    setTimer = (timer: number) => {
        this.timer = timer
    };

    /**
     * Метод получения данных по операции.
     * @return {{documents: array, id, timer: number, createDate: string, status: string, cryptoprofileId: string, dataSourceMode: string}}
     */
    getView = (): IOperationView => {
        return ({
            id: this.id,
            documents: this.documents.map(doc => doc.getView()),
            status: this.status,
            timer: this.timer,
            createDate: this.createDate,
            cryptoprofileId: this.cryptoprofileId,
            dataSourceMode: this.dataSourceMode
        })
    };

    /**
     * Метод прекращения работы операции.
     */
    destroy = () => {
        // Прекращаем подписку на таймер.
        this.TimerSubscribe.unsubscribe();
    };

    /**
     * Метод ЖЦ операции, обновляем таймер и смотрим чо-каво. Если чо - меняем статус. Если каво - дергаем колбэк на удаление.
     * @param {number} timer Новый таймер.
     * @param {Function} onDelete Колбэк при уничтожении операции.
     * @private
     */
    updateOperationTimer = (timer: number, onDelete: Function) => {
        const operationPresetTemplate = getOperationPresetTemplate();
        // Проверяем на шаблон (должен быть задан в шаблоне таймер):
        const templateTimeout = operationPresetTemplate && operationPresetTemplate[this.status] && operationPresetTemplate[this.status].timeout;
        // И время прошедшее с начала действия текущего статуса должно стать равно или меньше шаблонного
        if (templateTimeout && (getOperationState(this.status).timer - timer >= templateTimeout)) {
            this.setStatus(operationPresetTemplate[this.status].status);
            return
        }

        // Если таймер истёк:
        if (timer <= 0) {
            // Проверяем на конечный статус. Если конечный - удаляем операцию.
            if (finalStatuses.includes(this.status)) {
                this.destroy();
                if (typeof onDelete == 'function') {
                    onDelete(this.id);
                }
                // Иначе - переводим в ошибку истечения таймера.
            } else {
                this.setStatus(EOperationStatus.ANSWER_REFUSED);
            }
            // Если не истёк - ставим новое значение.
        } else {
            this.setTimer(timer)
        }
    };
}

//exports.Operation = Operation;