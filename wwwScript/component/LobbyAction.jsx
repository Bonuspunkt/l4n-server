import React from 'react';

import CsrfToken from './CsrfToken';

const LobbyAction = (props) => {
    const { lobby, action } = props;

    return (
        <form method="POST" action={ `/lobby/${ lobby.id }/${ action }` }>
            <CsrfToken { ...props } />
            <button type="submit">{ action }</button>
        </form>
    );
}

export default LobbyAction;
