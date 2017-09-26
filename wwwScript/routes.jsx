import viewRegistry from './lib/viewRegistry';
import OpenLobbies from './component/OpenLobbies';
// build view?
viewRegistry.register('home', OpenLobbies);

import Home from './view/Home';
import Register from './view/Register';
import Registered from './view/Registered';
import Login from './view/Login';
import LoginFailed from './view/LoginFailed';
import CreateLobby from './view/CreateLobby';
import Lobby from './view/Lobby';
import User from './view/User';

const routes = [
    {
        pattern: '/',
        Component: Home,
    },
    {
        pattern: '/login',
        Component: Login,
    },
    {
        pattern: '/loginFailed',
        Component: LoginFailed,
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
];

export default routes;