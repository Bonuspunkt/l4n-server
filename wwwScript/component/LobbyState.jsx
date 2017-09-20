//import React from 'react';

const LobbyState = ({ lobby }) => {
    switch (lobby.state) {
        case 0:
            return 'waiting';
        case 1:
            return 'launching';
        case 2:
            return 'running';
    }
};

export default LobbyState;
