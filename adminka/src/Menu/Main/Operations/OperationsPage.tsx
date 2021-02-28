import * as React from "react";
import {useState} from "react";
import {SocketAPI} from "../../../Socket/socket";

/**
 * Вывод операций.
 * @constructor
 */
export const OperationPage = () => {
    const [operations, useOperations] = useState<string>("");
    SocketAPI.subscribeOnOperations(useOperations);

    return <>
        {operations}
    </>
};