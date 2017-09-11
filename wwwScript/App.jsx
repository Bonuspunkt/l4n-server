import React from 'react';
import route from './lib/Route';

import Home from './view/Home';
import Register from './view/Register';
import Registered from './view/Registered';
import Login from './view/Login';
import CreateCustomLobby from './view/CreateCustomLobby';
import CreateLobby from './view/CreateLobby';
import Lobby from './view/Lobby';
import User from './view/User';

import NotMapped from './view/NotMapped';

export const routes = [
    {
        pattern: '/',
        Component: Home,
    },
    {
        pattern: '/login',
        Component: Login,
    },
    {
        pattern: '/register',
        Component: Register,
    },
    {
        pattern: '/registered',
        Component: Registered,
    },
    {
        pattern: '/lobby/custom',
        Component: CreateCustomLobby,
    },
    {
        pattern: '/provider/:provider/game/:game',
        Component: CreateLobby,
    },
    {
        pattern: '/lobby/:lobbyId!number',
        Component: Lobby,
    },
    {
        pattern: '/user/:userId!number',
        Component: User,
    },
].map(({ pattern, Component }) => ({
    test: route(pattern),
    Component,
}));

const App = props => {
    const { url } = props;

    for (let { test, Component } of routes) {
        const urlParams = test(url);
        if (urlParams) {
            return <Component {...props} {...urlParams} />;
        }
    }
    return <NotMapped {...props} />;
};

export default App;
