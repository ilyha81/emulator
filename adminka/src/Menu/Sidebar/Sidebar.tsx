import * as React from 'react';
import "./Sidebar.css";
import {ESocketConnection, SocketAPI} from "../../Socket/socket";

/**
 * Sidebar props.
 * @prop {ESocketConnection} socketStatus Scoket Connection Status.
 * @prop {string} [name] The Name of the Sidebar pannel.
 */
interface ISidebar {
    socketStatus: ESocketConnection
    name?: string;
}

/**
 * Sidebar with controls
 * @constructor
 */
export const Sidebar: React.FunctionComponent<ISidebar> = ({children, name, socketStatus}) => {

    return <div className="Sidebar container pt-2">
        {name && <div className='badge badge-dark'>{name}</div>}
        <button className='btn btn-block btn-lg btn-primary' disabled={socketStatus !== ESocketConnection.CONNECTED}
                onClick={SocketAPI.createTestOperation}>Create Test Operation
        </button>
        {children}
    </div>
};