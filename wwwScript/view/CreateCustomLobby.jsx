import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';
import CommonMark from '../component/CommonMark';

const CreateCustomLobby = (props) => {

    return (
        <DefaultLayout { ...props } title={ 'Create Custom Lobby' }>
            <h1>create custom lobby</h1>
            <form method="POST" action="/lobby/custom">
                <CsrfToken { ...props } />
                <label>
                    <span>game</span>
                    <input name="game" />
                </label>
                <label>
                    <span>lobby name</span>
                    <input name="name" />
                </label>
                <h4>spawn conditions</h4>
                <label>
                    <span>min players</span>
                    <input type="number" name="minPlayers" />
                </label>
                <h4>infos</h4>
                <label>
                    <span>max players</span>
                    <input type="number" name="maxPlayers" />
                </label>
                <label>
                    <span>info</span>
                    <textarea name="info" />
                    <CommonMark text={ '# game\n install' } />
                </label>
                <label>
                    <span>connect</span>
                    <textarea name="connect" />
                    <CommonMark text={ '# git on sarvar\nlauch game connect' } />
                </label>
                <button type="submit">create</button>
            </form>
        </DefaultLayout>
    );

};

export default CreateCustomLobby;
