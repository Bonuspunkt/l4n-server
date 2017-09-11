import React from 'react';

import Popup from './Popup';

const LaunchServer = props => {
    return (
        <Popup title="conditions met">
            Game: {props.game}
            Lobby: {props.lobby}
            START CONDITIONS
        </Popup>
    );
};

export default LaunchServer;
