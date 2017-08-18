import React from 'react';

import DefaultLayout from './layout/Default';

import GameDisplay from '../component/GameDisplay';

const CreateLobby = (props) => {
    return (
        <DefaultLayout { ... props } title={ 'Create Lobby' }>
            <GameDisplay { ...props.game } />
        </DefaultLayout>
    );
};

export default CreateLobby;
