import React from 'react';
import PropTypes from 'prop-types';

import DefaultLayout from './layout/Default';
import CsrfToken from '../component/CsrfToken';
import CommonMarkInput from '../component/CommonMarkInput';
import CommonMark from '../component/CommonMark';

const UserEdit = ({ displayUser, csrfToken }) => (
    <form action={`/user/${displayUser.id}`} method="POST">
        <CsrfToken csrfToken={csrfToken} />
        <label className="formField">
            <span className="formField-label">Info</span>
            <CommonMarkInput
                className="formField-input"
                autoFocus
                name="bio"
                defaultValue={displayUser.bio}
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
    const { userId, user = {}, users } = props;
    const displayUser = users.find(u => u.id === userId);

    const body =
        user.id === userId ? (
            <UserEdit {...props} displayUser={displayUser} />
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
