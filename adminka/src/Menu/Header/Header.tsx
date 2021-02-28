import * as React from "react";
import "./Header.css";
import logo from '../../logo.svg';

/**
 * Хэдер админки. Переключение страниц.
 */
export const Header: React.FC = (props) => {

    return <div className="Header">
        Хедер
        <div className="float-right" style={{width: 150, height: 100, overflow: 'hidden'}}>
            <img src={logo} className="logo" alt="logo" />
        </div>
        {props.children}
    </div>
}