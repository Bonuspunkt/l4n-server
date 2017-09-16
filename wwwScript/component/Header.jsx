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
    const { lanName, users } = props;

    return (
        <header>
            <div className="header">
                <a className="header-left" href="/">
                    {lanName}
                </a>
                <User {...props} />
                Online Users: {users.filter(u => u.online).length}
            </div>
        </header>
    );
};

export default Header;
