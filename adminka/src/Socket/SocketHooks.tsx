import {useState, useEffect} from 'react';
import {ESocketConnection, SocketAPI} from './socket';
import {IOperationServer} from "../Models";

/**
 * Hook subscribes on Socket connection status.
 * @prop {any[]} conditions Array of condition to hook work. Default - on component mount.
 */
export const useSocketGetConnectionStatus = (conditions: any[] = []): ESocketConnection => {
    const [socketStatus, setSocketStatus] = useState<ESocketConnection>(ESocketConnection.INITIAL);

    useEffect(() => {
        const connected = SocketAPI.subscribeOnConnectionStatus(setSocketStatus);
        return connected.unsubscribe
    }, conditions);

    return socketStatus
};


/**
 * Hook for getting operations.
 * @prop {any[]} conditions Array of condition to hook work. Default - on component mount.
 */
export const useSocketGetOperations = (conditions: any[] = []): IOperationServer[] => {
    const [operations, setOperations] = useState<IOperationServer[]>([]);

    useEffect(()=>{
        const connected = SocketAPI.subscribeOnOperations(setOperations);
        return connected.unsubscribe
    }, conditions);

    return operations
};