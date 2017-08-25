import React from 'react'

const UserDisplay = ({ user }) => {
    return (
        <a href={ `/user/${user.id}` }>
            { user.name }
        </a>
    );
};

export default UserDisplay;
