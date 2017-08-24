import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken'

const Login = (props) => {
    const { csrfToken } = props;
    return (
        <DefaultLayout { ...props }>
            <h3>sign in</h3>
            <div>
                <a href="/auth/steam"><img src="/static/steam/signin.png" /></a>
            </div>
            <div>
                <a href="/auth/bnet">Sign in through battle.net</a>
            </div>
            <form action="/auth/local" method="POST">
                <CsrfToken { ...props } />
                <label>
                    <span>Username</span>
                    <input type="text" name="username"/>
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" name="password"/>
                </label>
                <button type="submit">Login</button>
            </form>

            <h3>register</h3>
            <form action="/register" method="POST">
                <CsrfToken { ...props } />
                <label>
                    <span>Username</span>
                    <input type="text" name="username"/>
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" name="password1"/>
                </label>
                <label>
                    <span>Verify Password</span>
                    <input type="password" name="password2"/>
                </label>
                <button type="submit">Register</button>
            </form>
        </DefaultLayout>
    );
}

export default Login;
