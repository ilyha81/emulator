import {Timer} from '../Timer/interval';
import * as socketio  from "socket.io";
import * as core from "express-serve-static-core";
import {IOperationView} from "../Operation/operation";
import {Server as Socket} from 'socket.io';

/**
 * Типы сообщений.
 */
export enum ESocketMsg {
    MESSAGE = "MESSAGE",
    SHOW_DATA = "SHOW_DATA",
    TEST = "TEST",
}

/**
 * Проверка занятых портов.
 */
const ports: Set<number> = new Set;

export class SocketMessenger {
    socket: socketio.Server;

    static isPortUsed = (port: number) => ports.has(port);

    constructor (socket: Socket, getOperations: () => IOperationView[]) {
        this.socket = socket;

        this.socket.on('connection', (client: socketio.Socket) => {
            console.log('Клиент подключился');

            client.emit(ESocketMsg.MESSAGE, "ПОДКЛЮЧЕНИЕ УСПЕШНО !");
        });
    }

    /**
     * Обработка приема сообщений.
     * @param type
     * @param cb
     */
    on = (type: string, cb: (client: any) => any) => {
        this.socket.on(type, cb)
    };

    emitMsg = (type: string, msg: object) => {
        if (typeof msg === "string") {
            this.socket.emit(type, msg);
        } else {
            this.socket.emit(type, JSON.stringify(msg))
        }
    }
}
