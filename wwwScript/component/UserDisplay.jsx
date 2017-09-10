import React from 'react'

const UserDisplay = ({ user }) => {
    const { id, name, online } = user;

    return (
        <a href={ `/user/${ id }` }>
            { name }
        </a>
    );
};

export default UserDisplay;
