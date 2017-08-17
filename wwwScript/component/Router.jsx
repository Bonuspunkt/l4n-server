import React, { PureComponent } from 'react'

import MyLobbies from './MyLobbies';
import OpenLobbies from './OpenLobbies';
import AvailableServers from './AvailableServers';
import CustomLobby from './CustomLobby';

class Router extends PureComponent {
    render() {
        const { props } = this;
        const { url } = props;

        switch (url) {
            case '/':
            /*
                return (
                    <div>
                        <MyLobbies { ...props } />
                        <OpenLobbies { ...props } />
                        <AvailableServers { ...props } />
                        <a href="/customLobby">create custom lobby</a>
                    </div>
                );
*/
            case '/customLobby':
                return (
                    <div>
                        <CustomLobby { ...props } />
                    </div>
                );

        }

    }
}

export default Router
