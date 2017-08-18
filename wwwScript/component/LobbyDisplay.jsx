import React from 'react';
import GameDisplay from './GameDisplay';

const LobbyDisplay = (props) => {
    return (
        <tr key={ props.id }>
            <td className="noPad"><GameDisplay { ...props.game } /></td>
            <td>{ props.voice ? 'V' : 'S' }</td>
            <td>{ props.name }</td>
            <td>{ props.players.length } / { props.maxPlayers }</td>
            <td>
                <form action={ `/lobby/${ props.id }` } method="POST">
                    <input type="hidden" name="id" value={ props.id } />
                    <button type="submit">{ props.maxPlayers > props.players.length ? 'join' : 'queue' }</button>
                </form>
            </td>
        </tr>
    );
};

export default LobbyDisplay;
