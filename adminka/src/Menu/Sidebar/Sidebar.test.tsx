import * as React from 'react';
import {cleanup, render, screen, fireEvent} from '@testing-library/react';

import {Sidebar} from './Sidebar';
import {ESocketConnection} from "../../Socket/socket";

beforeEach(()=> {
    cleanup();
});

describe('Testing Sidebar', () => {

    test('Testing Sidebar render', ()=> {
        const {container} = render(<Sidebar socketStatus={ESocketConnection.INITIAL}/>);

        expect(container).toMatchSnapshot();
    });

    test('Sidebar Name props', () => {
        const name='NAME';
        render(<Sidebar name={name} socketStatus={ESocketConnection.INITIAL}/>);

        expect(screen.getByText(name)).toHaveClass('badge', 'badge-dark');
    });

    test('Sidebar renders children', () => {
        const VASYA = 'VASYA';
        const PETYA = 'PETYA';
        const Child:React.FunctionComponent<{str: string}> = ({str}) => {
            return <div>{str}</div>
        };

        render(<Sidebar socketStatus={ESocketConnection.INITIAL}>
            <Child str={VASYA}/>
            <Child str={PETYA}/>
        </Sidebar>);

        screen.getByText(VASYA);
        screen.getByText(PETYA);
    });

    test('Sidebar has Test Operation button', () => {
        render(<Sidebar socketStatus={ESocketConnection.INITIAL}/>);

        expect(screen.getByText('Create Test Operation')).toHaveClass('btn', 'btn-lg', 'btn-block', 'btn-primary');
    });

    test('Sidebar Test Operation button disabled-enabled', () => {
        const { rerender } = render(<Sidebar socketStatus={ESocketConnection.INITIAL}/>);
        expect(screen.getByText('Create Test Operation')).toBeDisabled();

        rerender(<Sidebar socketStatus={ESocketConnection.CONNECTED}/>);
        expect(screen.getByText('Create Test Operation')).not.toBeDisabled();

        rerender(<Sidebar socketStatus={ESocketConnection.DISCONNECTED}/>);
        expect(screen.getByText('Create Test Operation')).toBeDisabled();

        rerender(<Sidebar socketStatus={ESocketConnection.FAILED}/>);
        expect(screen.getByText('Create Test Operation')).toBeDisabled();
    });

    test('Sidebar Test Operation button onClick', async () => {
        const mockCb = jest.fn();
        render(<Sidebar socketStatus={ESocketConnection.CONNECTED}/>);
        const operationButton = screen.getByText('Create Test Operation');
        expect(operationButton).not.toBeDisabled();

        operationButton.onclick = mockCb;
        fireEvent.click(operationButton);
        expect(mockCb).toHaveBeenCalledTimes(1);
        fireEvent.click(operationButton);
        expect(mockCb).toHaveBeenCalledTimes(2);
    })
});