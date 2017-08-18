import React from 'react';
if (process.env.BROWSER) {
    require('./Header.styl');
}

const User = ({ user }) => {
    if (user) {
        return (
            <div style={{ float: 'right' }}>
                <a href="/profile">{ user.name }</a>
                <form method="POST" action="/logout">
                    <button type="submit">logout</button>
                </form>
            </div>
        );
    }
    return (
        <div style={{ float: 'right' }}>
            <a href="/login">login</a>
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
