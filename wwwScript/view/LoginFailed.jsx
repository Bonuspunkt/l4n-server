import React from 'react';

import DefaultLayout from './layout/Default';

const Login = props => {
    const { user } = props;
    if (user) {
        return (
            <DefaultLayout {...props} title="login failed">
                <h1>already logged in</h1>
            </DefaultLayout>
        );
    }
    return (
        <DefaultLayout {...props} title="login failed">
            <h1>login failed</h1>
            <h2>username / password missmatch</h2>
            <a href="/login">back to login</a>
        </DefaultLayout>
    );
};

export default Login;
