import React from 'react';

import './Header.styl'

const User = ({ user }) => {
    if (user) {
        return (<a href="/profile" style={{ float: 'right' }}>{ user }</a>);
    }
    return (<a href="/register">register</a>);
}

const Header = ({ lanName, user }) => {
    const href = `https://l4n.at/${ lanName }/`;
    const name = href.slice(8);

    const

    return (
        <header>
            <a href={ href }>{ name }</a>
        </header>
    );
}

export default Header;
