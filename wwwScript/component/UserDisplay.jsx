import React from 'react';

const UserDisplay = ({ user }) => {
    const { id, name } = user;

    return (
        <a className="userDisplay" href={`/user/${id}`}>
            {name}
        </a>
    );
};

export default UserDisplay;
