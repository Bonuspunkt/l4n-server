import React from 'react';
import PropTypes from 'prop-types';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';
import CommonMarkInput from '../component/CommonMarkInput';
import CommonMark from '../component/CommonMark';

const UserEdit = ({ user, csrfToken }) => (
    <form action={`/user/${user.id}`} method="POST">
        <CsrfToken csrfToken={csrfToken} />
        <label className="formField">
            <span className="formField-label">Info</span>
            <CommonMarkInput
                className="formField-input"
                autoFocus
                name="bio"
                defaultValue={user.bio}
            />
        </label>
        <label className="formField">
            <span className="formField-label" />
            <button type="submit">save</button>
        </label>
    </form>
);
UserEdit.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        bio: PropTypes.string,
    }).isRequired,
    csrfToken: PropTypes.string.isRequired,
};

const User = props => {
    const { userId, user = {}, users, csrfToken } = props;
    const displayUser = users.find(u => u.id === userId);

    const body =
        user.id === userId ? (
            <UserEdit user={displayUser} csrfToken={csrfToken} />
        ) : (
            <CommonMark text={displayUser.bio} />
        );

    return (
        <DefaultLayout {...props}>
            <h1>{displayUser.name}</h1>
            <hr />
            {body}
        </DefaultLayout>
    );
};

export default User;
