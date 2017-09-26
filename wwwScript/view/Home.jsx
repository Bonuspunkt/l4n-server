import React from 'react';

import DefaultLayout from './layout/Default';

import viewRegistry from '../lib/viewRegistry';

const Home = props => {
    const items = viewRegistry
        .resolve('home')
        .map(Component => <Component key={Component.name} {...props} />);

    return <DefaultLayout {...props}>{items}</DefaultLayout>;
};

export default Home;
