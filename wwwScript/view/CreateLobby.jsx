import React from 'react';

import DefaultLayout from './layout/Default';
import GameHeader from '../component/GameHeader';
import LobbyDefinition from '../component/LobbyDefinition';

const CreateLobby = (props) => {
    const { params, provider, game } = props;

    return (
        <DefaultLayout { ...props } title={ 'Create Lobby' }>
            <LobbyDefinition { ...props }>
                <center>
                    <GameHeader { ...game } />
                    <div>hosted by { provider.name }</div>
                </center>
            </LobbyDefinition>
        </DefaultLayout>
    );
};

export default CreateLobby;
