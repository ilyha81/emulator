/**
 * Статусы состояния документа в операции подписания.
 * @prop SENDING Отправлен на подписание.
 * @prop POSTED ХЗ
 * @prop DAY_LIMIT_ERROR ХЗ
 *
 */
export enum EDocumentStatus {
    SENDING = "SENDING",
    POSTED = "POSTED",
    DAY_LIMIT_ERROR = "DAY_LIMIT_ERROR"
}

/**
 * Интерфейс документа получаемого при создании операции.
 */
export interface IDocument {
    id: string;
    docType: string;
}

/**
 * Интерфейс для Документа в операции подписания.
 * @prop {EDocumentStatus} status Статус документа.
 * @prop {string} errorCode Код ошибки если она произошла.
 * @prop {string} errorMsg Сообщение об ошибке, если она произошла.
 */
export interface IDocumentState {
    status: EDocumentStatus;
    errorCode?: string;
    errorMsg?: string;
}

/**
 * Создаем перечень состояний в которых может находиться документ.
 */
const statusMap: Record<EDocumentStatus, IDocumentState> = {
    [EDocumentStatus.SENDING] : {status: EDocumentStatus.SENDING},
    [EDocumentStatus.POSTED]: {status: EDocumentStatus.POSTED},
    [EDocumentStatus.DAY_LIMIT_ERROR]: {
        status: EDocumentStatus.DAY_LIMIT_ERROR,
        errorCode: 'asd',
        errorMsg: 'asd'
    }
};

/**
 * Получение состояния для документа.
 * @param state
 */
export const getDocumentState = (state: EDocumentStatus) => statusMap[state];

/**
 * Интерфейс для вьюшки документа.
 */
export interface IDocumentView extends IDocumentState, IDocument {}

/**
 * Документ ОЭП.
 */
export class CloudDocument {
    docId: string;
    docType: string;
    docStatus: EDocumentStatus;
    errorCode: string | undefined;
    errorMsg: string | undefined;

    /**
     * Конструктор
     * @param {id: string, docType: string} data Данные документа.
     */
    constructor (data: { id: string, docType: string }) {
        this.docId = data.id;
        this.docType = data.docType;

        // Задаем явно а не чз сетСтейт т.к. тайпскрипт требует явного задания docStatus/
        const state = getDocumentState(EDocumentStatus.SENDING);
        this.docStatus = state.status;
        this.errorCode = state.errorCode;
        this.errorMsg = state.errorMsg;
    }

    /**
     * Установить новый статус документу.
     * @param {IDocumentState} documentState Новое состояние документа.
     */
    setState = (documentState?: IDocumentState) => {
        if(!documentState) return false;
        const {status, errorMsg, errorCode} = documentState;
        this.docStatus = status;
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
    };

    /**
     * Получить данные по документу.
     * @return {IDocumentView} Данные по документу.
     */
    getView = (): IDocumentView =>
        ({
            id: this.docId,
            docType: this.docType,
            status: this.docStatus,
            errorCode: this.errorCode,
            errorMsg: this.errorMsg
        });
}
//exports.CloudDocument = CloudDocument;