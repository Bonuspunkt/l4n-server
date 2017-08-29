import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';

const CreateCustomLobby = (props) => {

    return (
        <DefaultLayout { ...props } title={ 'Create Custom Lobby' }>
            <h1>create custom lobby</h1>
            <form method="POST" action="/lobby/custom/create">
                <CsrfToken { ...props } />
                <label>
                    <span>Game</span>
                    <input name="game" />
                </label>
                <label>
                    <span>Lobby Name</span>
                    <input name="name" />
                </label>
                <h4>spawn conditions</h4>
                <label>
                    <span>min players</span>
                    <input type="number" name="minPlayers" />
                </label>
                <button type="submit">create</button>
            </form>
        </DefaultLayout>
    );

};

export default CreateCustomLobby;
