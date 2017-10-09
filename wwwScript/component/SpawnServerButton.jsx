import React from 'react';
import CsrfToken from './CsrfToken';

const STATE = {
    WAITING: 0,
    LAUNCHING: 1,
    OPEN: 2,
};

const SpawnServerButton = props => {
    const { lobby, user = {} } = props;
    const { state } = lobby;

    if (lobby.userId !== user.id) return null;

    return (
        <form className="inline" action={`/lobby/${lobby.id}`} method="POST">
            <CsrfToken {...props} />
            <input type="hidden" name="action" value="changeState" />
            <input type="hidden" name="newState" value="1" />
            <button data-action="spawnServer" disabled={state !== STATE.WAITING} type="submit">
                spawning server
            </button>
        </form>
    );
};

export default SpawnServerButton;
