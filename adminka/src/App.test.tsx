import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';

describe('Testing', () => {

    test('App render', () => {
        const {container} = render(<App/>);
        expect(container).toMatchSnapshot();
    });

    test('message connection', () => {
        // Надо замокать вызов SocketApi.connection и проверить вызовы на отрисовку и на анмаунт.
        const {container, unmount} = render(<App/>);

        unmount();

    });
});



