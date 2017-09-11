import React from 'react';

import GameDisplay from './GameDisplay';
import LobbyAction from './LobbyAction';

const LobbyDisplay = props => {
    const { lobby, game } = props;
    const { id, provider, name } = lobby;

    const providerDisplay = provider ? provider : <em>custom</em>;

    return (
        <tr>
            <td>{providerDisplay}</td>
            <td>
                <GameDisplay {...game} />
            </td>
            <td>
                <a href={`/lobby/${id}`}>{name}</a>
            </td>
            <td>
                <LobbyAction {...props} lobby={lobby} />
            </td>
        </tr>
    );
};

const OpenLobbies = props => {
    const { lobbies, providers, user } = props;

    const lobbyDisplays = lobbies.map(lobby => {
        const game = lobby.provider
            ? providers.find(p => p.name === lobby.provider)
            : { name: lobby.game };

        return <LobbyDisplay key={lobby.id} {...props} lobby={lobby} game={game} />;
    });

    const inLobby = user && lobbies.some(lobby => lobby.users.includes(user.id));
    const customLobby =
        user && !inLobby ? (
            <a className="button" href="/lobby/custom">
                Open Custom Lobby
            </a>
        ) : null;

    return (
        <article>
            <h2>Open Lobbies</h2>
            <table>
                <tbody>{lobbyDisplays}</tbody>
            </table>
            {customLobby}
        </article>
    );
};

export default OpenLobbies;
