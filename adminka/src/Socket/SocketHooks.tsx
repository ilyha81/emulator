import { useState, useEffect } from 'react';
import {ESocketConnection, SocketAPI} from './socket';

/**
 * Hook subscribes on Socket connection status.
 */
export const useSocketConnectionStatus = ():ESocketConnection  => {
    const [socketStatus, setSocketStatus] = useState<ESocketConnection>(ESocketConnection.INITIAL);

    useEffect(()=>{
        const connected = SocketAPI.subscribeOnConnectionStatus(setSocketStatus);

        return connected.unsubscribe
    },[]);

    return socketStatus
}