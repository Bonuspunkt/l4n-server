import React from 'react';

import DefaultLayout from './layout/Default';

const Registered = props => {
    const { user } = props;
    if (user) {
        return (
            <DefaultLayout {...props} title="login">
                <h1>already logged in</h1>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout {...props} title="registered">
            <h3>Account successfully created</h3>
            <a href="/login">login</a>
        </DefaultLayout>
    );
};

export default Registered;
