import React from './react'

const UserDisplay = ({userId, users}) => {
    const user = users.find(user => user.id === userId)

    return (
        <a href={ `/user/${userId}` }>
            { user.name }
        </a>
    );
};

export default UserDisplay;
