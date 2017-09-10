import React from 'react';
import Header from '../../component/Header';

const DefaultLayout = (props) => {
    let { title } = props;
    const usedTitle = 'l4n.at' + (title ? ` - ${title}` : '');

    if (typeof document !== 'undefined') {
        return (
            <div>
            <Header { ...props } />
            <div id="main">
                { props.children }
            </div>
            <footer>
                <a href="https://github.com/bonuspunkt/l4n-server">l4n-server</a>
            </footer>
            </div>
        );
    }

    return (
        <html>
            <head>
                <title>{ usedTitle }</title>
                <link rel="stylesheet" href="/stylesheet.css" type="text/css" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <Header { ...props } />
                <div id="main">
                    { props.children }
                </div>
                <footer>
                    <a href="https://github.com/bonuspunkt/l4n-server">l4n-server</a>
                </footer>
                <script src="/script.js"></script>
            </body>
        </html>
    );
}

export default DefaultLayout;
