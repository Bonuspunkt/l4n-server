import React from 'react';
import UserDisplay from './UserDisplay';

const Hoster = ({ lobby, providers, users }) => {
    const hostUser = users.find(u => u.id === lobby.userId);
    const provider = providers.find(p => p.name === lobby.provider);

    if (hostUser) {
        return (
            <em>
                <UserDisplay user={hostUser} />
            </em>
        );
    }
    return provider.name;
};

export default Hoster;
