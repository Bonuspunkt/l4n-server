import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';

const Login = props => {
    const { user } = props;
    if (user) {
        return (
            <DefaultLayout {...props} title="login">
                <h1>already logged in</h1>
            </DefaultLayout>
        );
    }
    return (
        <DefaultLayout {...props} title="login">
            <h3>sign in</h3>
            <form action="/login" method="POST">
                <CsrfToken {...props} />
                <label>
                    <span>Username</span>
                    <input type="text" name="username" required autoFocus />
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" name="password" required />
                </label>
                <label>
                    <span />
                    <button type="submit">Login</button>
                </label>
            </form>
        </DefaultLayout>
    );
};

export default Login;
