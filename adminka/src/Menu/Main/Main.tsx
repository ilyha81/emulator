import * as React from "react";
import "./Main.css";

/**
 * Основное рабочее окно.
 */
export const Main: React.FC = (props) => {

    return <div className="Main">
        <div>
            Рабочий экран.
        </div>
        {props.children}
    </div>
};