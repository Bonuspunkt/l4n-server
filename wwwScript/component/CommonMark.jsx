import React from 'react';
import PropTypes from 'proptypes';
import { Parser, HtmlRenderer } from 'commonmark';

if (process.env.BROWSER) {
    require('./CommonMark.styl');
}

const reader = new Parser({ safe: true });
const writer = new HtmlRenderer({ safe: true });

const CommonMark = ({ className = '', text }) => {
    const ast = reader.parse(text);

    const innerHTML = { __html: writer.render(ast) };

    return <div className={`commonMark ${className}`} dangerouslySetInnerHTML={innerHTML} />;
};

CommonMark.propTypes = {
    text: PropTypes.string.isRequired,
};

export default CommonMark;
