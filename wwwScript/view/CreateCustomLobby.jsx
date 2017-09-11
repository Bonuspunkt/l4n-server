import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';
import CommonMarkInput from '../component/CommonMarkInput';

const CreateCustomLobby = props => {
    const { user } = props;

    return (
        <DefaultLayout {...props} title={'Create Custom Lobby'}>
            <h1>create custom lobby</h1>
            <form method="POST" action="/lobby/custom">
                <CsrfToken {...props} />
                <input type="hidden" name="userId" value={user.id} />
                <label>
                    <span>game</span>
                    <input name="game" placeholder="ex. CS:GO" />
                </label>
                <label>
                    <span>lobby name</span>
                    <input name="name" placeholder="ex. casual real life simulator 2020" />
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
                    <CommonMarkInput name="info" placeholder={'# game\n install'} />
                </label>
                <label>
                    <span>connect</span>
                    <CommonMarkInput
                        name="connect"
                        placeholder={'# git on sarvar\nlauch game connect'}
                    />
                </label>
                <button type="submit">create</button>
            </form>
        </DefaultLayout>
    );
};

export default CreateCustomLobby;
