import React from 'react';

import DefaultLayout from './layout/Default';

import OpenLobbies from '../component/OpenLobbies';
// import AvailableServers from '../component/AvailableServers';
// <AvailableServers {...props} />

const Home = props => {
    return (
        <DefaultLayout {...props}>
            <OpenLobbies {...props} />
        </DefaultLayout>
    );
};

export default Home;
