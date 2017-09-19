import React from 'react';
import { Parser, HtmlRenderer } from 'commonmark';

if (process.env.BROWSER) {
    require('./CommonMark.styl');
}

const reader = new Parser({ safe: true });
const writer = new HtmlRenderer({ safe: true });

const CommonMark = ({ text = '' }) => {
    const ast = reader.parse(text);

    const innerHTML = { __html: writer.render(ast) };

    return <div className="commonMark" dangerouslySetInnerHTML={innerHTML} />;
};

export default CommonMark;
