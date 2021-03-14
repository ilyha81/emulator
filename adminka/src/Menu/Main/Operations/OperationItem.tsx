import * as React from 'react';
import {IOperationServer} from "../../../Models";
import {IListTableItem, ListTable} from "../../../Components/ListTable/ListTable";

/**
 * OperationItem props.
 * @prop {IOperationServer} operation Model of server Operation.
 */
interface IOperationItem {
    operation: IOperationServer
}

/**
 * Drawing the element with Operation Data.
 */
export const OperationItem:React.FunctionComponent<IOperationItem> = ({operation}) => {

    const leftBlock: IListTableItem[] = [{name: 'ID:', value: operation.id},
        {name: 'Status:', value: operation.status},
        {name: 'TimeLeft:', value: operation.timer.toString()}];

    const rightBlock: IListTableItem[] = [{name: 'CreateDate:', value: operation.createDate},
        {name: 'Cryptoprofile:', value: operation.cryptoprofileId},
        {name: 'DocumentsCount:', value: operation.documents.length.toString()}];

    return <div className={'container-fluid border border-radius border-dark p-1 mb-1'} style={{backgroundColor: 'rgba(255,255,255,0.5)', overflow: 'hidden'}}>
        <div className={'row'}>
            <div className={'col-5'}>
                <ListTable items={leftBlock}/>
            </div>
            <div className={'col-7'}>
                <ListTable items={rightBlock}/>
            </div>
        </div>
    </div>
};