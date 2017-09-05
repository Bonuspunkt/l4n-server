import React from 'react';

import GameDisplay from './GameDisplay';

const AvailableServers = (props) => {
    const { providers, user } = props;
    const servers = providers
        .map(provider => provider.games.map(game => ({ provider: provider.name, game })))
        .reduce((prev, curr) => prev.concat(curr), []);

    return (
        <article>
            <h2>Available Servers</h2>
            <table>
                <tbody>
                    { servers.map(server => <AvailableServer { ...server } showOpenLobby={ user } />) }
                </tbody>
            </table>
        </article>
    );
};

const AvailableServer = ({ provider, game, showOpenLobby }) => {
    const openLobby = showOpenLobby
        ? <a className="button" href={ `/provider/${ provider }/game/${ game.id }` }>open lobby</a>
        : null;

    return (
        <tr>
            <td>{ provider }</td>
            <td className="noPad"><GameDisplay { ...game } /></td>
            <td>{ game.name }</td>
            <td>{ openLobby }</td>
        </tr>
    );
};

export default AvailableServers;
