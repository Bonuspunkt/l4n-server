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
                <label className="formField">
                    <span className="formField-label">Username</span>
                    <input
                        className="formField-input"
                        type="text"
                        name="username"
                        required
                        autoFocus
                    />
                </label>
                <label className="formField">
                    <span className="formField-label">Password</span>
                    <input className="formField-input" type="password" name="password" required />
                </label>
                <label className="fieldName">
                    <span className="formField-label" />
                    <button type="submit">Login</button>
                </label>
            </form>
        </DefaultLayout>
    );
};

export default Login;
