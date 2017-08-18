import React from 'react';

import GameDisplay from './GameDisplay';

const AvailableServers = (props) => {
    const servers = [{
        provider: 'l4n.at',
        game: { id: 1, steamId: 440, name: 'TF2' }
    }, {
        provider: 'l4n.at',
        game: { id: 2, steamId: 730, name: 'CS:GO' }
    }, {
        provider: 'l4n.at',
        game: { id: 3, steamId: 550, name: 'L4D2' }
    }, {
        provider: 'l4n.at',
        game: { id: 4, steamId: 328070, name: 'Reflex Arena' }
    }, {
        provider: 'l4n.at',
        game: { id: 4, steamId: 2310, name: 'Quake' }
    }];

    return (
        <article>
            <h2>Available</h2>
            <table>
                <tbody>
                    { servers.map(server => <AvailableServer { ...server } />) }
                </tbody>
            </table>
        </article>
    );
};

const AvailableServer = ({ provider, game }) => {
    return (
        <tr>
            <td>{ provider }</td>
            <td className="noPad"><GameDisplay { ...game } /></td>
            <td>{ game.name }</td>
            <td><a className="button" href={ `/lobby/create/${ game.id }` }>open lobby</a></td>
        </tr>
    );
};

export default AvailableServers;
