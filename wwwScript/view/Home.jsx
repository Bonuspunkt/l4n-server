import React from 'react';

import DefaultLayout from './layout/Default';

import OpenLobbies from '../component/OpenLobbies';
import AvailableServers from '../component/AvailableServers';

const Home = (props) => {
    return (
        <DefaultLayout { ... props }>
            <OpenLobbies { ...props } />
            <AvailableServers { ...props } />
        </DefaultLayout>
    );
};

export default Home;
