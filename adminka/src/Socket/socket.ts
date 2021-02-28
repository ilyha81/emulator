import io from "socket.io-client";
import {BehaviorSubject} from "rxjs";

/**
 * Типы сообщений.
 */
export enum ESocketMsg {
    MESSAGE = "MESSAGE",
    SHOW_DATA = "SHOW_DATA",
    TEST = "TEST",
}

export type TSocketMessageCB = (data: string) => void;

/**
 * Функция отрисовки данных в соответствующей секции
 * @param data Данные для отрисовки
 */
const drawData = (data: string) => {
    const section = document.getElementById('show-data');
    console.log(data);
    section && (section.innerText = JSON.stringify(data));
};

/**
 * Сам коннект Сокета.
 */
const socket = io.connect('http://localhost:8000', {transports: ['websocket', 'polling']});

/**
 * Создаем подписчикjd.
 */
const MessageSubscriber = new BehaviorSubject<string>("");
const OperationsSubscriber = new BehaviorSubject<string>("");

/**
 * Создаем рассылку.
 */
socket.on(ESocketMsg.MESSAGE, (data: string) => {
    console.warn("SCOKET: incomming message = " + ESocketMsg.MESSAGE);
    MessageSubscriber.next(data)
});
socket.on(ESocketMsg.SHOW_DATA, (data: string) => {
    console.warn("SCOKET: incomming message = " + ESocketMsg.SHOW_DATA);
    OperationsSubscriber.next(data)
});

export const SocketAPI = {
    /**
     * Создание тестовой операции.
     */
    emitTestOperation: () => {
        socket.emit(ESocketMsg.TEST, {
            documents: [{id: 'asd1', docType: 'RPP'}, {id: 'asd2', docType: 'RPP'}],
            cryptoprofileId: "TEST_PROFILE"
        })
    },

    /**
     * Подписка на Получение сообщения.
     * @param {string} cb Колбэк
     */
    subscribeOnHello: (cb: TSocketMessageCB) => MessageSubscriber.subscribe(cb),

    /**
     * Подписка на Получение операций.
     * @param {string} cb Колбэк.
     */
    subscribeOnOperations: (cb: TSocketMessageCB) => OperationsSubscriber.subscribe(cb),

};

