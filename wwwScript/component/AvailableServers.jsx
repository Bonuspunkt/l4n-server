import React from 'react';

const AvailableServers = (props) => {
    const servers = [{
        name: 'l4n',
        games: [{}, {}]
    }]

    return (
        <article>
            <h2>Available Servers</h2>
            { servers.map(server => <AvailableServer { ...server } />) }
        </article>
    );
};

const AvailableServer = (props) => {
    return (
        <div>
            <h3>{ props.name }</h3>
            <table>
                <tbody>
                    { props.games.map(game => <AvailableGame { ...game } />) }
                </tbody>
            </table>
        </div>
    );
}

const AvailableGame = (props) => {
    return (
        <tr>
            <td>{ 'image' }</td>
            <td>{ 'name' }</td>
            <td><button type="button">open lobby</button></td>
        </tr>
    );
}

export default AvailableServers;