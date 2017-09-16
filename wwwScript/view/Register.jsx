import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';

const Register = props => {
    const { user } = props;
    if (user) {
        return (
            <DefaultLayout {...props} title="login">
                <h1>already logged in</h1>
            </DefaultLayout>
        );
    }

    const error = props.error ? <h4 className="error">{props.error}</h4> : <h4>{'\u00a0'}</h4>; // bad hack to make sure the inputs dont "jump"

    return (
        <DefaultLayout {...props} title="register">
            <h3>register</h3>
            {error}
            <form action="/register" method="POST">
                <CsrfToken {...props} />
                <label className="formField">
                    <span className="formField-label">Username</span>
                    <input className="formField-input" type="text" name="username" />
                </label>
                <label className="formField">
                    <span className="formField-label">Password</span>
                    <input className="formField-input" type="password" name="password1" />
                </label>
                <label className="formField">
                    <span className="formField-label">Verify Password</span>
                    <input className="formField-input" type="password" name="password2" />
                </label>
                <label className="formField">
                    <span className="formField-label" />
                    <button type="submit">Register</button>
                </label>
            </form>
        </DefaultLayout>
    );
};

export default Register;
