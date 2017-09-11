import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';

const Login = props => {
    return (
        <DefaultLayout {...props} title="login">
            <h3>sign in</h3>
            <form action="/auth/local" method="POST">
                <CsrfToken {...props} />
                <label>
                    <span>Username</span>
                    <input type="text" name="username" />
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" name="password" />
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
