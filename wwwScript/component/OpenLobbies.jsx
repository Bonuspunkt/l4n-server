import React from 'react';

import GameDisplay from './GameDisplay';

const LobbyDisplay = (props) => {
    const { provider, game, name }= props;

    return (
        <div>
            { provider }
            <GameDisplay { ...game } />
            <a href={ `/lobby/${ props.id }` }>{ props.name }</a>
        </div>
    );
};

const OpenLobbies = (props) => {
    const { openLobbies } = props;

    return (
        <article>
            <h2>Open Lobbies</h2>
            <table>
                <tbody>
                    { openLobbies.map(lobby => <LobbyDisplay key={ lobby.id } { ...lobby } />) }
                </tbody>
            </table>
        </article>
    );
}


export default OpenLobbies;
