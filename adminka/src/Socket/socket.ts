import io from "socket.io-client";
import {BehaviorSubject} from "rxjs";

/**
 * Socket message types.
 */
export enum ESocketMsg {
    MESSAGE = "MESSAGE",
    SHOW_DATA = "SHOW_DATA",
    TEST = "TEST",
}

/**
 * Type of socket callbacks
 */
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
 * Options for socket connection
 */
const socketOptions: SocketIOClient.ConnectOpts = {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
};

/**
 * Set Socket connection
 */
const getSocketConnection = async () => {
    //if was connected - reconnecting;
    socket.connected && await socket.disconnect();
    socket = io.connect('http://localhost:8000', socketOptions)
};

/**
 * Check connection;
 */
const checkSocketConnection = () => socket.connected;

/**
 * Subscribers.
 * Behavior Subjects to get last message if it was missed.
 */
const MessageSubscriber = new BehaviorSubject<string>("");
const OperationsSubscriber = new BehaviorSubject<string>("");

/**
 * Initial connection;
 */
let socket: SocketIOClient.Socket = io.connect('http://localhost:8000', socketOptions);

/**
 * Connection status inform.
 */
socket.on('connect', () => console.log('Socket connected to server.'));
socket.on('disconnect', () => console.warn('Socket disconnected!!!'));

/**
 * Messages emit.
 * ( Logging message receiving for easy contol and debug )
 */
socket.on(ESocketMsg.MESSAGE, (data: string) => {
    console.warn("SOCKET: incoming message = " + ESocketMsg.MESSAGE);
    MessageSubscriber.next(data)
});
socket.on(ESocketMsg.SHOW_DATA, (data: string) => {
    console.warn("SOCKET: incoming message = " + ESocketMsg.SHOW_DATA);
    OperationsSubscriber.next(data)
});

/**
 * SOCKET API for all socket manipulations.
 */
export const SocketAPI = {
    /**
     * Create test operation on Server.
     */
    emitTestOperation: () => {
        checkSocketConnection() && socket.emit(ESocketMsg.TEST, {
            documents: [{id: 'asd1', docType: 'RPP'}, {id: 'asd2', docType: 'RPP'}],
            cryptoprofileId: "TEST_PROFILE"
        })
    },

    /**
     * Subscribe on new messages.
     * @param {string} cb CallBack
     */
    subscribeOnMessages: (cb: TSocketMessageCB) => MessageSubscriber.subscribe(cb),

    /**
     * Subscribe on operation changes.
     * @param {string} cb CallBack.
     */
    subscribeOnOperations: (cb: TSocketMessageCB) => OperationsSubscriber.subscribe(cb),

};

