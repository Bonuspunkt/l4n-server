import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';
import CommonMarkInput from '../component/CommonMarkInput';

const publicInfoDefaultValue = `- buy the game
- install it
- be ready`;

const CreateLobby = props => {
    const { user } = props;
    if (!user) {
        return (
            <DefaultLayout {...props} title={'Create Lobby'}>
                <h1>need to login</h1>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout {...props} title={'Create Lobby'}>
            <h1>create lobby</h1>
            <form method="POST" action="/lobby/custom">
                <CsrfToken {...props} />
                <input type="hidden" name="userId" value={user.id} />
                <label className="formField">
                    <span className="formField-label">game</span>
                    <input
                        className="formField-input"
                        type="text"
                        name="game"
                        required
                        autoFocus
                        placeholder="ex. CS:GO"
                    />
                </label>
                <label className="formField">
                    <span className="formField-label">mode</span>
                    <input
                        className="formField-input"
                        type="text"
                        name="mode"
                        placeholder="ex. Arms Race"
                    />
                </label>
                <label className="formField">
                    <span className="formField-label">lobby name</span>
                    <input
                        className="formField-input"
                        type="text"
                        name="name"
                        required
                        placeholder="ex. real life simulator 2020"
                    />
                </label>
                <h3>spawn conditions</h3>
                <label className="formField">
                    <span className="formField-label">min players</span>
                    <input
                        className="formField-input"
                        type="number"
                        name="minPlayers"
                        required
                        min="1"
                    />
                </label>
                <h3>infos</h3>
                <label className="formField">
                    <span className="formField-label">max players</span>
                    <input
                        className="formField-input"
                        type="number"
                        name="maxPlayers"
                        required
                        min="2"
                    />
                </label>
                <label className="formField">
                    <span className="formField-label">info</span>
                    <CommonMarkInput
                        className="formField-input"
                        name="publicInfo"
                        defaultValue={publicInfoDefaultValue}
                    />
                </label>
                <label className="formField">
                    <span className="formField-label" />
                    <button type="submit">create lobby</button>
                </label>
            </form>
        </DefaultLayout>
    );
};

export default CreateLobby;
