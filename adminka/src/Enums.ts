/**
 * Documents LifeCycle Statuses.
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
 * Operation LifeCycle Statuses.
 */
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