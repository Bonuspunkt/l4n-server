import React from 'react';
import UserDisplay from './UserDisplay';
import CsrfToken from './CsrfToken';
if (process.env.BROWSER) {
    require('./Header.styl');
}

const User = props => {
    const { user} = props;
    if (user) {
        return (
            <div style={{ float: 'right' }}>
                <UserDisplay { ...props } />
                { ' ' }
                <form className="inline" method="POST" action="/logout">
                    <CsrfToken { ...props } />
                    <button type="submit">logout</button>
                </form>
            </div>
        );
    }
    return (
        <div style={{ float: 'right' }}>
            <a href="/login">login</a>
            { ' ' }
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
