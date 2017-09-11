import React from 'react';
import UserDisplay from './UserDisplay';
import CsrfToken from './CsrfToken';
if (process.env.BROWSER) {
    require('./Header.styl');
}

const Logout = props => (
    <form className="inline" method="POST" action="/logout">
        <CsrfToken {...props} />
        <button type="submit">logout</button>
    </form>
);

const User = props => {
    const { user } = props;
    if (user) {
        return (
            <div className="header-right">
                <UserDisplay {...props} /> <Logout {...props} />
            </div>
        );
    }
    return (
        <div className="header-right">
            <a href="/login">login</a> <a href="/register">register</a>
        </div>
    );
};

const Header = props => {
    const { lanName } = props;
    const href = `https://${lanName}.l4n.at`;
    const name = href.slice(8);

    return (
        <header>
            <div className="header">
                <a className="header-left" href={href}>
                    {name}
                </a>
                <User {...props} />
            </div>
        </header>
    );
};

export default Header;
