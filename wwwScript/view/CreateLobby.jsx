import React from 'react';

import DefaultLayout from './layout/Default';
import GameDisplay from '../component/GameDisplay';
import LobbyDefinition from '../component/LobbyDefinition';

const CreateLobby = (props) => {
    const { params, provider, game } = props;

    return (
        <DefaultLayout { ...props } title={ 'Create Lobby' }>
            <LobbyDefinition { ...props }>
                <label>
                    <span>Provider</span>
                    <input readOnly value={ provider.name } />
                </label>
                <label>
                    <span>Game</span>
                    <GameDisplay { ...game } />
                </label>
            </LobbyDefinition>
        </DefaultLayout>
    );
};

export default CreateLobby;
