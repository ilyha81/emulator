import * as React from 'react';
import {cleanup, render, screen} from '@testing-library/react';

import {Header} from './Header';
import {ESocketConnection} from "../../Socket/socket";

beforeEach(()=> {
   cleanup();
});

describe('testing HEADER', () => {


    test('Header is rendered successfully', () => {
        const {container} = render(<Header socketStatus={ESocketConnection.INITIAL}/>);

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#HeaderLogo')).toBeInTheDocument();
    });

    test('Children are Drawing in Header!', () => {
        const VASYA = 'VASYA';
        const PETYA = 'PETYA';
        const Child: React.FunctionComponent<{str: string}> = ({str}) => {
            return <div>{str}</div>
        };

        render(
            <Header socketStatus={ESocketConnection.INITIAL}>
                <Child key={VASYA} str={VASYA}/>
                <Child key={PETYA} str={PETYA}/>
            </Header>);
        screen.getByText(VASYA);
        screen.getByText(PETYA);
    });

    test('test BASE rendering of right Logo and Badge', () => {
       render(<Header socketStatus={ESocketConnection.INITIAL}/>);

        screen.getByText('Socket:');
        expect(screen.queryByText('Socket:')).toHaveClass('badge', 'badge-dark');
        expect(screen.queryByPlaceholderText('HeaderLogo')).toHaveClass('logo');
    });

    describe('Header displays socket connection status', () => {

        test('Testing INITIAL status', () => {
            render(<Header socketStatus={ESocketConnection.INITIAL} />);

            screen.getByText(ESocketConnection.INITIAL);
            expect(screen.queryByText(ESocketConnection.INITIAL)).toHaveClass('badge', 'badge-warning');
        });

        test('Testing CONNECTED status', () => {
            render(<Header socketStatus={ESocketConnection.CONNECTED} />);

            screen.getByText(ESocketConnection.CONNECTED);
            expect(screen.queryByText(ESocketConnection.CONNECTED)).toHaveClass('badge', 'badge-success');
            expect(screen.queryByPlaceholderText('HeaderLogo')).toHaveClass('logo-rotation');

        });

        test('Testing FAILED status', () => {
            render(<Header socketStatus={ESocketConnection.FAILED} />);

            screen.getByText(ESocketConnection.FAILED);
            expect(screen.queryByText(ESocketConnection.FAILED)).toHaveClass('badge','badge-danger');
        });

        test('Testing DISCONNECTED status', () => {
            render(<Header socketStatus={ESocketConnection.DISCONNECTED} />);

            screen.getByText(ESocketConnection.DISCONNECTED);
            expect(screen.queryByText(ESocketConnection.DISCONNECTED)).toHaveClass('badge', 'badge-danger');
        })

    });

});