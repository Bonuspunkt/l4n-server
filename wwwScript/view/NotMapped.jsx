import React from 'react';
import DefaultLayout from './layout/Default';

const NotMapped = props => (
    <DefaultLayout {...props}>
        <h1>404</h1>
    </DefaultLayout>
);

export default NotMapped;
