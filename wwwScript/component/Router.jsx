import React, { PureComponent } from 'react'

import Login from './Login';
import CustomLobby from './CustomLobby';

import MyLobbies from './MyLobbies';
import OpenLobbies from './OpenLobbies';
import AvailableServers from './AvailableServers';

class Router extends PureComponent {
    render() {
        const { props } = this;
        const { url } = props;

        switch (url) {

            case '/login':
                return (<Login { ...props } />)

            case '/newLobby/custom':
                return (<CustomLobby { ...props } />);

            case '/newLobby/:id':
                return ('oh oh')

            case '/':
                return (
                    <div>
                        <MyLobbies { ...props } />
                        <OpenLobbies { ...props } />
                        <AvailableServers { ...props } />
                        <a className="button" href="/newLobby/custom">create custom lobby</a>
                    </div>
                );

            default:
                return 'no route';
        }
    }
}

export default Router
