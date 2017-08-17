import React from 'react'
import { Parser, HtmlRenderer } from 'commonmark';

let reader, writer;

const CommonMark = ({ text = '' }) => {
    if (!reader) { reader =  new Parser(); }
    if (!writer) { writer = new HtmlRenderer(); }

    const ast = reader.parse(text);
    const innerHTML = { __html: writer.render(ast) };

    return (
        <div className="commonMark" dangerouslySetInnerHTML={ innerHTML } />
    );
};

export default CommonMark;
