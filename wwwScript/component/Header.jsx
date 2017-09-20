import React from 'react';
import UserDisplay from './UserDisplay';
import CsrfToken from './CsrfToken';
if (process.env.BROWSER) {
    require('./Header.styl');
}

const Logout = props => (
    <form className="inline" method="POST" action="/logout">
        <CsrfToken {...props} />
        <button className="noPad" type="submit">
            logout
        </button>
    </form>
);

const User = props => {
    const { user, className } = props;
    if (user) {
        return (
            <div className={className}>
                <UserDisplay {...props} /> <Logout {...props} />
            </div>
        );
    }
    return (
        <div className={className}>
            <a href="/login">login</a> <a href="/register">register</a>
        </div>
    );
};

const Header = props => {
    const { lanName, users } = props;

    const online = users.filter(u => u.online).length;

    return (
        <header>
            <div className="header">
                <div className="header-left">
                    <a href="/">{lanName}</a>
                </div>
                <div className="header-center">Online Users: {online}</div>
                <User {...props} className="header-right" />
            </div>
        </header>
    );
};

export default Header;
