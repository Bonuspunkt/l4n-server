import React from 'react';
import Popup from './Popup';

const SteamGame = ({ host, port, password, timeRemaining }) => {
    const href =
        'steam://connect/' + host + (port ? `:${port}` : '') + (password ? `/${password}` : '');

    return <a href={href}>JOIN NOW</a>;
};

const CustomGame = ({ instructions }) => {
    // [instructions] = markdown
    return (
        <div>
            Instructions:
            {instructions}
        </div>
    );
};

const numberFormat = new Intl.NumberFormat('en', { minimumIntegerDigits: 2 });

const GameReady = props => {
    const { timeRemaining } = props;
    const minRemaining = (timeRemaining / 60) | 0;
    const secRemaining = (timeRemaining % 60) | 0;

    const infoDisplay = props.steamSupport ? <SteamGame {...props} /> : <CustomGame {...props} />;

    return (
        <Popup title="Game Ready">
            {infoDisplay}
            <div>
                Countdown {minRemaining}:{numberFormat.format(secRemaining)}
            </div>
        </Popup>
    );
};

export default GameReady;
