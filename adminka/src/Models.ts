
import {EDocumentStatus, EOperationStatus} from "./Enums";

/**
 * Интерфейс документа отправляемого при создании операции.
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
export interface IDocumentServer extends IDocument{
    status: EDocumentStatus;
    errorCode?: string;
    errorMsg?: string;
}

/**
 * Model of Operation on server
 */
export interface IOperationServer {
    id: string;
    status: EOperationStatus,
    timer: number,
    cryptoprofileId: string;
    documents: IDocumentServer[],
    createDate: string,
    dataSourceMode: string
}