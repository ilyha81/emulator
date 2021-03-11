import * as React from "react";
import "./Header.css";
import logo from '../../logo.svg';
import {ESocketConnection} from "../../Socket/socket";

/**
 * Header props.
 * @prop {ESocketConnection} socketStatus Socket connection status.
 */
interface IHeader {
    socketStatus: ESocketConnection
}

/**
 * Хэдер админки. Переключение страниц.
 */
export const Header: React.FunctionComponent<IHeader> = ({children, socketStatus}) => {
    let badge = 'badge-warning';
    switch (socketStatus) {
        case ESocketConnection.CONNECTED:
            badge = 'badge-success';
            break;
        case ESocketConnection.FAILED:
        case ESocketConnection.DISCONNECTED:
            badge = 'badge-danger';
            break;
    }

    return <div className="Header">
        Хедер
        <div className="float-right" style={{width: 160, height: 100, overflow: 'hidden'}}>
            <img placeholder="HeaderLogo" id="HeaderLogo" src={logo}
                 className={`logo ${socketStatus === ESocketConnection.CONNECTED ? 'logo-rotation' : ''}`}
                 alt="HeaderLogo"/>
            <div><span className="badge badge-dark">Socket: </span><span
                className={`badge ${badge}`}>{socketStatus}</span></div>
        </div>
        {children}
    </div>
};