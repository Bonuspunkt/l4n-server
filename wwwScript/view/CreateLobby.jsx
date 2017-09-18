import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';
import CommonMarkInput from '../component/CommonMarkInput';

const publicInfoPlaceHolder = `# GameName
- buy the game
- install it`;
const privateInfoPlaceholder = `# join the game
- launch game
- server browser
- find 'my game'
- password is 'abc'`;

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
        <DefaultLayout {...props} title={'Create Custom Lobby'}>
            <h1>create custom lobby</h1>
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
                        placeholder="ex. CS:GO"
                    />
                </label>
                <label className="formField">
                    <span className="formField-label">lobby name</span>
                    <input
                        className="formField-input"
                        type="text"
                        name="name"
                        required
                        placeholder="ex. casual real life simulator 2020"
                    />
                </label>
                <h4>spawn conditions</h4>
                <label className="formField">
                    <span className="formField-label">min players</span>
                    <input
                        className="formField-input"
                        type="number"
                        name="minPlayers"
                        required
                        min="2"
                    />
                </label>
                <h4>infos</h4>
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
                        placeholder={publicInfoPlaceHolder}
                    />
                </label>
                <label className="formField">
                    <span className="formField-label">connect</span>
                    <CommonMarkInput
                        className="formField-input"
                        name="privateInfo"
                        placeholder={privateInfoPlaceholder}
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
