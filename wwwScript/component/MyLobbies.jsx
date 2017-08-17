import React from 'react';

const MyLobbies = (props) => {
    const myLobbies = Array.from({ length: 4 }).map((lobby, i) => ({ name: i, players: i + 1, maxPlayers: 2 + 2 * (i) }));

    return (
        <article>
            <h2>My Lobbies</h2>
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
                    { myLobbies.map(lobby => <ParticipatingLobby key={ lobby.name } { ...lobby } />) }
                </tbody>
            </table>
        </article>
    );
};

const ParticipatingLobby = (props) => {
    // http://cdn.edgecast.steamstatic.com/steam/apps/440/capsule_sm_120.jpg
    // http://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg

    return (
        <tr>
            <td className="noPad"><img src="/static/image/steam/440/capsule" alt={ 'game name' } /></td>
            <td>lobby { props.name }</td>
            <td>{ props.players } / { props.maxPlayers }</td>
            <td><button type="button">leave</button></td>
        </tr>
    )
};

export default MyLobbies;
