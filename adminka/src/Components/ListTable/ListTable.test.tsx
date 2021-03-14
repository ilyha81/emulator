import {cleanup, render, screen} from '@testing-library/react';
import * as React from 'react';
import {ListTable} from "./ListTable";

beforeEach(() => {
    cleanup();
});

describe('Testing ListTable component', () => {

    test('No drawing if there are no items', () => {
        const {container} = render(<ListTable/>);

        expect(container.querySelector('table')).toBeNull();
    });

    describe('Draw a table if items passed, both text and JSX', () => {
        interface IListTableItem {
            name: string | JSX.Element,
            value: string | JSX.Element
        }

        const myTextMap: IListTableItem[] = [{name: 'firstKey', value: 'firstValue'}, {
            name: 'secondKey',
            value: 'secondValue'
        }];
        const MyComp: React.FunctionComponent<{ str: string }> = ({str}) => {
            return <div>{str}</div>
        };
        const myJSXMap: IListTableItem[] = [{name: <MyComp str={'firstKey'}/>, value: <MyComp str={'firstValue'}/>}, {
            name: <MyComp str={'secondKey'}/>, value: <MyComp str={'secondValue'}/>
        }];

    const checkIt = (container: HTMLElement) => {
        expect(container.querySelector('table')).not.toBeNull();
        expect(screen.getByText('firstKey'));
        expect(screen.getByText('firstValue'));
        expect(screen.getByText('secondKey'));
        expect(screen.getByText('secondValue'));

    };

    test('Render Table of TEXTS', () => {
        const {container} = render(<ListTable items={myTextMap}/>);
        checkIt(container);
    });

    test('Render Table of JSX', () => {
        const {container} = render(<ListTable items={myJSXMap}/>);
        checkIt(container);
    });
})
})
;