import React from 'react';
import lobbyActionRegistry from '../lib/lobbyActionRegistry';

const LobbyActionBar = props => (
    <div className="buttonLine">
        {lobbyActionRegistry.resolve(props)}
    </div>
);

export default LobbyActionBar;
