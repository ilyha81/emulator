import io from "socket.io-client";
import {BehaviorSubject} from "rxjs";
import {IDocument, IOperationServer} from "../Models";
import {map} from "rxjs/operators";

/**
 * Socket message types.
 */
export enum ESocketMsg {
    MESSAGE = "MESSAGE",
    SHOW_DATA = "SHOW_DATA",
    TEST = "TEST",
}

export enum ESocketConnection {
    INITIAL = 'INITIAL',
    CONNECTED = "CONNECTED",
    FAILED = "FAILED",
    DISCONNECTED = "DISCONNECTED"
}

/**
 * Type of socket callbacks
 */
export type TSocketMessageCB<T> = (data: T) => void;

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
    reconnectionDelay: 3000,
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
const ConnectionSubscriber = new BehaviorSubject<ESocketConnection>(ESocketConnection.INITIAL);

/**
 * Initial connection;
 */
let socket: SocketIOClient.Socket = io.connect('http://localhost:8000', socketOptions);

/**
 * Connection status inform.
 */
socket.on('connect', () => {
    console.log('Socket connected to server.');
    ConnectionSubscriber.next(ESocketConnection.CONNECTED);
});
socket.on('disconnect', () => {
    console.warn('Socket disconnected!');
    ConnectionSubscriber.next(ESocketConnection.DISCONNECTED);
});
socket.on('connect_error', () => {
    console.error('SOCKET FAILED - ERROR!');
    ConnectionSubscriber.next(ESocketConnection.FAILED);
});
socket.on('connect_timeout', () => {
    console.error('SOCKET FAILED - TIMEOUT!');
    ConnectionSubscriber.next(ESocketConnection.FAILED);
});


/**
 * Generate Subscriber on socket messages.
 * Logging message receiving for easy contol and debug
 * @param {ESocketMsg} msgType Type of the socket message.
 * @param {BehaviorSubject<string>} observer Message emitter.
 */
const socketMsgGenerator = (msgType: ESocketMsg, observer: BehaviorSubject<string>) => {
    socket.on(msgType, (data: string) => {
        console.warn("SOCKET: incoming message = " + msgType);
        observer.next(data);
    })
};
/**
 * Messages emitters.
 */
socketMsgGenerator(ESocketMsg.MESSAGE, MessageSubscriber);
socketMsgGenerator(ESocketMsg.SHOW_DATA, OperationsSubscriber);

/**
 * SOCKET API for all socket manipulations.
 */
export const SocketAPI = {
    /**
     * Create test operation on Server.
     */
    createTestOperation: () => {
        const documents: IDocument[] = [{id: 'asd1', docType: 'RPP'}, {id: 'asd2', docType: 'RPP'}];
        checkSocketConnection() && socket.emit(ESocketMsg.TEST, {
            documents,
            cryptoprofileId: "TEST_PROFILE"
        })
    },

    /**
     * Subscribe on new messages.
     * @param {TSocketMessageCB} cb CallBack
     */
    subscribeOnMessages: (cb: TSocketMessageCB<string>) => MessageSubscriber.subscribe(cb),

    /**
     * Subscribe on operation changes.
     * @param {TSocketMessageCB} cb CallBack.
     */
    subscribeOnOperations: (cb: TSocketMessageCB<IOperationServer[]>) => {
        return OperationsSubscriber.pipe(map<string, IOperationServer[]>(stringData => {
            let operations: IOperationServer[] = [];
            if(stringData.length > 0) {
                try {
                    operations = JSON.parse(stringData) as IOperationServer[];
                } catch (e) {
                    console.error("Operations Response parse failed!!!");
                    console.log(e);
                }
            }
            return operations
        })).subscribe(cb);
    },

    /**
     * Subscribe on socket connection status
     * @param {(ESocketConnection)=> void} cb CallBack.
     */
    subscribeOnConnectionStatus: (cb: (msg: ESocketConnection) => void) => ConnectionSubscriber.subscribe(cb)

};

