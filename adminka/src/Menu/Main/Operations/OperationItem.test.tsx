import * as React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import {OperationItem} from "./OperationItem";
import {IOperationServer} from "../../../Models";
import {EDocumentStatus, EOperationStatus} from "../../../Enums";

/**
 * Test data.
 */
const testOperation: IOperationServer = {
    id: 'testId',
    createDate: '2021-03-01, 17:00:01',
    cryptoprofileId: 'testCryptoprofile',
    dataSourceMode: 'testDataSourceMode',
    documents: [{id: 'docId', docType: 'docType', status: EDocumentStatus.POSTED}],
    status: EOperationStatus.POSTED_SUCCESS,
    timer: 100
};

beforeEach(() => {
    cleanup();
});


describe('Testing <OperationItem />', () => {
    test('Testing render', () => {
        const {container} = render(<OperationItem operation={testOperation}/>);
        expect(container).toMatchSnapshot();
    });

    test('Testing left block of data render', () => {
        render(<OperationItem operation={testOperation}/>);
        expect(screen.getByText('ID:'));
        expect(screen.getByText(testOperation.id));
        expect(screen.getByText('Status:'));
        expect(screen.getByText(testOperation.status));
        expect(screen.getByText('TimeLeft:'));
        expect(screen.getByText(testOperation.timer));
    });

    test('Testing right block of data render', () => {
        render(<OperationItem operation={testOperation}/>);
        expect(screen.getByText('CreateDate:'));
        expect(screen.getByText(testOperation.createDate));
        expect(screen.getByText('Cryptoprofile:'));
        expect(screen.getByText(testOperation.cryptoprofileId));
        expect(screen.getByText('DocumentsCount:'));
        expect(screen.getByText(testOperation.documents.length));
    })

});