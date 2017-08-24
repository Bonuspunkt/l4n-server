import React from 'react';

const CsrfToken = ({ csrfToken }) => <input type="hidden" name="_csrf" value={ csrfToken } />

export default CsrfToken;
