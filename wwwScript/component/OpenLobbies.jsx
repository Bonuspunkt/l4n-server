import React from 'react';

const OpenLobbies = (props) => {
    const openLobbies = Array.from({ length: 10 })
        .map((lobby, i) => ({ name: i, players: i + 1, maxPlayers: 2 + 2 * i % 16 }));

    return (
        <article>
            <h2>Open Lobbies</h2>
            <table>
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Lobby name</th>
                        <th>Status</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    { openLobbies.map(lobby => <OpenLobby key={ lobby.name } { ...lobby } />) }
                </tbody>
            </table>
        </article>
    );
}

const OpenLobby = (props) => {
    return (
        <tr>
            <td className="noPad"><img src="." alt={ 'game name' } /></td>
            <td>Lobby { props.name }</td>
            <td>{ props.players } / { props.maxPlayers }</td>
            <td><button type="button">{ props.maxPlayers > props.players ? 'join' : 'queue' }</button></td>
        </tr>
    )
}

export default OpenLobbies;
