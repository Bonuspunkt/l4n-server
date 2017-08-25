import React from 'react';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken'

const Register = (props) => {
    const { csrfToken } = props;
    const error = props.error
        ? <h4>{ props.error }</h4>
        : null;

    return (
        <DefaultLayout { ...props }>
            <h3>register</h3>
            { error }
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

export default Register;
