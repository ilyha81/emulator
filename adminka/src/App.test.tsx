import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import App from './App';
import {SocketAPI} from "./Socket/socket";

beforeEach(cleanup);

describe('Testing <App />', () => {

    test('App render', async () => {
        const {container} = render(<App/>);
        expect(container).toMatchSnapshot();
    });

    test('message connection and disconnection', async () => {
        // Надо замокать вызов SocketApi.connection и проверить вызовы на отрисовку и на анмаунт.
        const cbMock = jest.fn((a: string)=> {} );
        const unsubscribeMock = jest.fn();
        const subscribeMock = jest.fn(()=> unsubscribeMock);
        const mockedSocketApi = {SocketAPI: {subscribeOnMessages: subscribeMock}};
        jest.spyOn(SocketAPI, "subscribeOnMessages").mockImplementation(subscribeMock);
        const {unmount} = render(<App/>);
        expect(subscribeMock).toHaveBeenCalledTimes(1);
        expect(unsubscribeMock).toHaveBeenCalledTimes(0);

        unmount();
        expect(subscribeMock).toHaveBeenCalledTimes(1);
        expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });

    test('Subscribe on Socket Messages', () => {

    })
});



