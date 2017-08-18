import React from 'react';
import Header from '../../component/Header';

const DefaultLayout = (props) => {
    let { title } = props;
    const usedTitle = 'l4n.at' + (title ? ` - ${title}` : '');

    return (
        <html>
            <head>
                <title>{ usedTitle }</title>
                <link rel="stylesheet" href="/stylesheet.css" type="text/css" />
            </head>
            <body>
                <Header { ...props } />
                { props.children }
                <script src="/script.js"></script>
            </body>
        </html>
    );
}

export default DefaultLayout;
