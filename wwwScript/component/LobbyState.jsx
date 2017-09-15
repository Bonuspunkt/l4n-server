//import React from 'react';

const LobbyState = ({ lobby }) => {
    switch (lobby.state) {
        case 0:
            return 'waiting';
        case 1:
            return 'ready to launch';
        case 2:
            return 'launching';
        case 3:
            return 'open';
    }
};

export default LobbyState;
