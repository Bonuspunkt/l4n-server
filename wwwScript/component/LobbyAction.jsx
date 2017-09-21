import React from 'react';
import PropTypes from 'proptypes';

import CsrfToken from './CsrfToken';

const ActionButton = props => {
    const { lobby, action, className } = props;

    return (
        <form className="inline" method="POST" action={`/lobby/${lobby.id}`}>
            <CsrfToken {...props} />
            <input type="hidden" name="action" value={action} />
            <button className={className} type="submit">
                {action}
            </button>
        </form>
    );
};

const LobbyAction = props => {
    const { lobbies, lobby, user } = props;

    if (!user) return null;

    const participatingLobby = lobbies.find(l => l.users.includes(user.id));
    if (participatingLobby) {
        if (participatingLobby.id !== lobby.id) return null;

        if (lobby.userId === user.id) {
            return <ActionButton {...props} className="danger" lobby={lobby} action="destroy" />;
        } else if (lobby.users.some(userId => userId === user.id)) {
            return <ActionButton {...props} lobby={lobby} action="leave" />;
        }
    } else if (lobby.users.length < lobby.maxPlayers) {
        return <ActionButton {...props} lobby={lobby} action="join" />;
    }
    return null;
};

LobbyAction.propTypes = {
    lobby: PropTypes.shape({
        id: PropTypes.number.isRequired,
        userId: PropTypes.number,
    }).isRequired,
    user: PropTypes.shape({
        id: PropTypes.numnber,
    }),
};
export default LobbyAction;
