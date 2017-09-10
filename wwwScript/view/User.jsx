import React from 'react';
import DefaultLayout from './layout/Default';

const EditUser = ({ user }) => (
    <input name="name" value={ user.name } />
);

const User = (props) => {
    const { userId, users } = props;
    const readOnly = props.user.id !== userId
    const user = users.find(u => u.id === userId);

    return (
        <DefaultLayout { ...props }>
            <h1>{ readOnly ? user.name : 'you' }</h1>
            <label>
                <span></span>
            </label>

        </DefaultLayout>
    );
};

export default User;
