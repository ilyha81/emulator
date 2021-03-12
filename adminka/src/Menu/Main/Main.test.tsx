import * as React from 'react';
import {cleanup, render, screen} from '@testing-library/react';

import {Main} from './Main';

beforeEach(()=> {
    cleanup();
});

describe('Testing Main Component', () => {

    test('Main is rendered successfully', () => {
        const { container } = render(<Main/>);
        expect(container).toMatchSnapshot();
    });

    test('Main renders children', () => {
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