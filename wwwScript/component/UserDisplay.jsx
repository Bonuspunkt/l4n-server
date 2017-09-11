import React from 'react';
if (process.env.BROWSER) {
    require('./UserDisplay.styl');
}

const UserDisplay = ({ user, displayOnline }) => {
    const { id, name, online } = user;

    const onlineState = displayOnline ? (
        <span className={`userDisplay-${online ? 'online' : 'offline'}`} />
    ) : (
        undefined
    );

    return (
        <a className="userDisplay" href={`/user/${id}`}>
            {onlineState} {name}
        </a>
    );
};

export default UserDisplay;
