import React from 'react';
import PropTypes from 'proptypes';

const CsrfToken = ({ csrfToken }) => (
    <input type="hidden" name="_csrf" value={ csrfToken } />
);


CsrfToken.propTypes = {
    csrfToken: PropTypes.string.isRequired
};

export default CsrfToken;
