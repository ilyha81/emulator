import * as React from "react";
import "./Main.css";
import {IOperationServer} from "../../Models";
import {useSocketGetOperations} from "../../Socket/SocketHooks";
import {OperationItem} from "./Operations/OperationItem";

/**
 * Props for Main Screen.
 * @prop {string} [name] The Name for the section of Main Screen. Showed in left top corner.
 */
interface IMain {
    name?: string
}

/**
 * Main screen
 */
export const Main: React.FunctionComponent<IMain> = ({children, name}) => {

    const operations: IOperationServer[] = useSocketGetOperations();

    return <section className="Main p-1" role='Main'>
        {name ? <div role={'heading'} className='badge badge-dark'>
            {name}
        </div> : null}
        <div>
            {operations.length > 0 && operations.map((operation, index) => <OperationItem key={`operation${index}`} operation={operation}/>)}
        </div>
        {children}
    </section>
};