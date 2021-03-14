import * as React from 'react';
import {cleanup, render, screen} from '@testing-library/react';

import {Main} from './Main';

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
        expect(screen.getByRole('heading'));
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
        expect(screen.getByText(VASYA));
        expect(screen.getByText(PETYA));
    });

    test('If items passed - ', () => {

    })
});