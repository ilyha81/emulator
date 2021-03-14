import * as React from 'react';

/**
 * Interface for one item of ListTable
 */
export interface IListTableItem {
    name: string | JSX.Element,
    value: string | JSX.Element
}


/**
 * ListTable props
 */
export interface IListTable {
    items?: IListTableItem[]
}

/**
 * Draw map in table like:
 * Key1 : Value1
 * Key2 : Value2
 * @param {IListTable} items Map of items;
 */
export const ListTable:React.FunctionComponent<IListTable> = ({items}) => {
    if(!items || items.length === 0) return null;

    return <table className="table table-striped table-hover table-dark m-0">
        <tbody>
        {items.map((item, index) => {
            return <tr key={`trKey${index}`}>
                <td key='name'>{item.name}</td>
                <td key='value'>{item.value}</td>
            </tr>
        })}
        </tbody>
    </table>
};