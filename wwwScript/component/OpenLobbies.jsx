import React from 'react';
import LobbyDisplay from './LobbyDisplay';

const OpenLobbies = (props) => {
    const openLobbies = [{
        id: 1,
        game: { steamId: 730, name: 'CS:GO' },
        name: 'rl simulator 2020',
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
        game: { steamId: 2310, name: 'Quake' },
        name: 'coop point & click adventure',
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
            <h2>Open Lobbies</h2>
            <table>
                <tbody>
                    { openLobbies.map(lobby => <LobbyDisplay key={ lobby.name } { ...lobby } />) }
                </tbody>
            </table>
        </article>
    );
}


export default OpenLobbies;
