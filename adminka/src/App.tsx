import React, {useEffect} from 'react';
import './App.css';
import {Header} from "./Menu/Header/Header";
import {Sidebar} from "./Menu/Sidebar/Sidebar";
import {Main} from "./Menu/Main/Main";
import {ESocketConnection, SocketAPI} from "./Socket/socket";
import {useSocketConnectionStatus} from "./Socket/SocketHooks";

function App () {

    /**
     * Socket Connection Status.
     */
    const connectionStatus:ESocketConnection = useSocketConnectionStatus();

    /**
     * Connecting to Server on start.
     * Subscribing on Messages and Connection Status.
     */
    useEffect(()=> {
        const subscription = SocketAPI.subscribeOnMessages((msg) => {
            if (msg.length > 0) {
                alert(msg)
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);


    return (
        <div className="App-Wrapper">
            <div className="App">
                <Header socketStatus={connectionStatus} />
                <Sidebar socketStatus={connectionStatus}/>
                <Main/>
            </div>
            {/*<div className="Popup">

          </div>*/}
        </div>
    );
}

export default App;
