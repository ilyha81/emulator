import * as React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import * as Hooks from "../../Socket/SocketHooks";

import {Main} from './Main';
import {IOperationServer} from "../../Models";
import {EDocumentStatus, EOperationStatus} from "../../Enums";


/**
 * Test data.
 */
const mockTestOperation: IOperationServer = {
    id: 'testId',
    createDate: '2021-03-01, 17:00:01',
    cryptoprofileId: 'testCryptoprofile',
    dataSourceMode: 'testDataSourceMode',
    documents: [{id: 'docId', docType: 'docType', status: EDocumentStatus.POSTED}],
    status: EOperationStatus.POSTED_SUCCESS,
    timer: 100
};

beforeEach(()=> {
    cleanup();
});

describe('Testing Main Component', () => {

    test('Main is rendered successfully', async () => {
        const { container } = render(<Main/>);
        expect(container).toMatchSnapshot();
    });

    test(' Main renders its name', async () => {
        const { rerender } = render(<Main/>);
        expect(screen.queryByRole('heading')).toBeNull();

        const VASYA = 'VASYA';
        rerender(<Main name={VASYA}/>);
        screen.getByRole('heading');
        expect(screen.getByText(VASYA)).toHaveClass('badge','badge-dark');
    });

    test('Main renders children', async () => {
        const VASYA = 'VASYA';
        const PETYA = 'PETYA';
        const Child: React.FunctionComponent<{str: string}> = ({str}) => {
            return <div>{str}</div>
        };

        render(
            <Main>
                <Child key={VASYA} str={VASYA}/>
                <Child key={PETYA} str={PETYA}/>
            </Main>);
        screen.getByText(VASYA);
        screen.getByText(PETYA);
    });

    test('If items passed - render item', async () => {
        const mockFn = jest.fn(()=> [mockTestOperation]);
        //jest.mock("../../Socket/SocketHooks", ()=>({useSocketGetOperations: mockFn}));
        jest.spyOn(Hooks, 'useSocketGetOperations').mockImplementation(mockFn);
        render(<Main/>);
        await expect(screen.findByText(mockTestOperation.cryptoprofileId)).not.toBeNull();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toBeCalledWith();
    });
});