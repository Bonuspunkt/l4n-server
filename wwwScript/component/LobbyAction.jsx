import React from 'react';
import PropTypes from 'proptypes';

import CsrfToken from './CsrfToken';

const ActionButton = props => {
    const { lobby, action } = props;

    return (
        <form method="POST" action={`/lobby/${lobby.id}/${action}`}>
            <CsrfToken {...props} />
            <button type="submit">{action}</button>
        </form>
    );
};

const LobbyAction = props => {
    const { lobby, user } = props;

    if (!user) return null;

    let action;
    if (!lobby.users.length) {
        return <small>closed</small>;
    } else if (lobby.userId === user.id) {
        return <ActionButton {...props} lobby={lobby} action="destroy" />;
    } else if (lobby.users.some(userId => userId === user.id)) {
        return <ActionButton {...props} lobby={lobby} action="leave" />;
    } else {
        return <ActionButton {...props} lobby={lobby} action="join" />;
    }
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
