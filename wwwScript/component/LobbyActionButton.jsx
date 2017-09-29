import React from 'react';
import CsrfToken from './CsrfToken';

const LobbyActionButton = props => {
    const { lobby, action, className } = props;

    return (
        <form className="inline" method="POST" action={`/lobby/${lobby.id}`}>
            <CsrfToken {...props} />
            <input type="hidden" name="action" value={action} />
            <button className={className} data-action={action} type="submit">
                {action}
            </button>
        </form>
    );
};

export default LobbyActionButton;
