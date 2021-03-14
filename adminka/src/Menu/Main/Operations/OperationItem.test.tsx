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
        screen.getByText('ID:');
        screen.getByText(testOperation.id);
        screen.getByText('Status:');
        screen.getByText(testOperation.status);
        screen.getByText('TimeLeft:');
        screen.getByText(testOperation.timer);
    });

    test('Testing right block of data render', () => {
        render(<OperationItem operation={testOperation}/>);
        screen.getByText('CreateDate:');
        screen.getByText(testOperation.createDate);
        screen.getByText('Cryptoprofile:');
        screen.getByText(testOperation.cryptoprofileId);
        screen.getByText('DocumentsCount:');
        screen.getByText(testOperation.documents.length);
    })

});