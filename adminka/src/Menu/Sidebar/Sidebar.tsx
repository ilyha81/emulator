import * as Reacr from 'react';
import "./Sidebar.css";

/**
 * Сайдбар с управлением.
 * @constructor
 */
export const Sidebar: Reacr.FC = (props) => {

    return <div className="Sidebar">
        Сайдбар
        {props.children}
    </div>
};