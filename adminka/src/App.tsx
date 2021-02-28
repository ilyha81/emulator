import React, {useEffect} from 'react';
import './App.css';
import {Header} from "./Menu/Header/Header";
import {Sidebar} from "./Menu/Sidebar/Sidebar";
import {Main} from "./Menu/Main/Main";
import {SocketAPI} from "./Socket/socket";

function App () {

    useEffect(()=> {
        const subscription = SocketAPI.subscribeOnHello((msg) => {
            if (msg.length > 0) {
                alert(msg)
            }
        });

        return subscription.unsubscribe
    }, []);

    return (
        <div className="App-Wrapper">
            <div className="App">
                <Header/>
                <Sidebar/>
                <Main/>
            </div>
            {/*<div className="Popup">

          </div>*/}
        </div>
    );
}

export default App;
