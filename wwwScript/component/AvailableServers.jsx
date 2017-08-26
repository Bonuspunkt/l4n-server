import React from 'react';

import GameDisplay from './GameDisplay';

const AvailableServers = (props) => {
    const { providers } = props;
    const servers = providers
        .map(provider => provider.games.map(game => ({ provider: provider.name, game })))
        .reduce((prev, curr) => prev.concat(curr));

    return (
        <article>
            <h2>Available Servers</h2>
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
            <td><a className="button" href={ `/provider/${ provider }/game/${ game.id }` }>open lobby</a></td>
        </tr>
    );
};

export default AvailableServers;
