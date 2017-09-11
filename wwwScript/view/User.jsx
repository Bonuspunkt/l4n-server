import React from 'react';
import DefaultLayout from './layout/Default';

const User = props => {
    const { userId, users } = props;
    const readOnly = props.user.id !== userId;
    const user = users.find(u => u.id === userId);

    return (
        <DefaultLayout {...props}>
            <h1>{readOnly ? user.name : 'you'}</h1>
            <label>
                <span />
            </label>
        </DefaultLayout>
    );
};

export default User;
