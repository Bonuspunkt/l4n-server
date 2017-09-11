import React from 'react';

import DefaultLayout from './layout/Default';

const Registered = props => (
    <DefaultLayout {...props} title="registered">
        <h3>Account successfully created</h3>
        <a href="/login">login</a>
    </DefaultLayout>
);

export default Registered;
