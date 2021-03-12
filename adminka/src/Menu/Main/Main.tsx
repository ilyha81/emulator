import * as React from "react";
import "./Main.css";
import {IOperationServer} from "../../Models";
import {useSocketGetOperations} from "../../Socket/SocketHooks";

/**
 * Основное рабочее окно.
 */
export const Main: React.FC = (props) => {

    const operations: IOperationServer[] = useSocketGetOperations();
    console.error("MAIN SCREEN RECEIVED OPERATIONS");
    console.log(operations);

    return <div className="Main">
        <div>
            Рабочий экран.
        </div>
        {props.children}
    </div>
};