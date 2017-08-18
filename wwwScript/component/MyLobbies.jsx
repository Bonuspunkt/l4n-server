import React from 'react';
import LobbyDisplay from './LobbyDisplay';

const MyLobbies = (props) => {
    const myLobbies = [{
        id: 1,
        game: { steamId: 440, name: 'TF2' },
        name: 'red vs blu 2017',
        start: undefined,
        minPlayers: 2,
        maxPlayers: 24,
        players: [{
            id: 1,
            name: 'Bonus'
        }, {
            id: 2,
            name: 'Punkt'
        }],
        voice: 2,
        misc: {}
    }, {
        id: 2,
        game: { steamId: 550, name: 'L4D2' },
        name: 'ded zombies',
        start: '2017-09-01T00:00:00Z',
        minPlayers: 1,
        maxPlayers: 4,
        players: [{
            id: 1,
            name: 'Bonus'
        }, {
            id: 2,
            name: 'Punkt'
        }],
        voice: 1,
        misc: {}
    }];

    return (
        <article>
            <h2>My Lobbies</h2>
            <table>
                <tbody>
                    { myLobbies.map(lobby => <LobbyDisplay key={ lobby.name } { ...lobby } />) }
                </tbody>
            </table>
        </article>
    );
};

export default MyLobbies;
