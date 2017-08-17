import React from 'react';

import './Header.styl'

const User = ({ user }) => {
    if (user) {
        return (
            <div style={{ float: 'right' }}>
                <a href="/profile">{ user } </a>
                <form method="POST" action="/logout">
                    <button type="submit">logout</button>
                </form>
            </div>
        );
    }
    return (
        <div style={{ float: 'right' }}>
            <a href="/register">register</a>
        </div>
    );
}

const Header = (props) => {
    const { lanName } = props;
    const href = `https://l4n.at/${ lanName }/`;
    const name = href.slice(8);

    return (
        <header>
            <a href={ href }>{ name }</a>
            <User { ...props } />
        </header>
    );
}

export default Header;
