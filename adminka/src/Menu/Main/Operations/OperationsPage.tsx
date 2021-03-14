import * as React from "react";
import {IOperationServer} from "../../../Models";

interface IOperationsPage {
    operations: IOperationServer[]
}

/**
 * Вывод операций.
 * @constructor
 */
export const OperationsPage: React.FunctionComponent<IOperationsPage> = ({operations}) => {
    return <>
        {operations.map(operation => <div>{operation.id}</div>)}
    </>
};