import React from 'react'

import CommonMark from './CommonMark';

const CustomLobby = (props) => {

    const { notes = '# h1\n## h2\n### h3', text = '- start game\n- multiplayer\n- lan\n- join `world domination 2017`' } = props;

    return (
        <form>
            <h3>Custom Lobby</h3>
            <label>
                <span>Game</span>
                <input type="text" name="game" />
            </label>
            <label>
                <span>Lobby Name</span>
                <input type="text" name="name" />
            </label>
            <label>
                <span>Max. Players</span>
                <input type="text" name="max" />
            </label>
            <label>
                <span>Voice Channels</span>
                <input type="number" name="lobbyName" />
            </label>

            <h4>Start Conditions</h4>
            <label>
                <span>Time</span>
                <input type="text" name="start" />
            </label>
            <label>
                <span>Min. Players</span>
                <input type="text" name="minPlayers" />
            </label>
            <label>
                <span>Notes</span>
                <textarea name="notes" value={ notes } />
            </label>

            <h4>Misc</h4>
            <label>
                <span>Notes Preview</span>
                <CommonMark text={ notes } />
            </label>
            <label>
                <span>Instructions</span>
                <textarea name="instructions" value={ text } />
            </label>
            <label>
                <span>Notes Preview</span>
                <CommonMark text={ text } />
            </label>
            <button type="submit">open lobby</button>
        </form>
    );
}

export default CustomLobby;
