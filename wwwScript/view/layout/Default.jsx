import React from 'react';
import Header from '../../component/Header';
import Title from '../../component/Title';

const DefaultLayout = props => {
    let { lanName, title, user } = props;
    const usedTitle = (title ? `${title} - ` : '') + lanName;

    if (process.env.BROWSER) {
        return (
            <div>
                <Title>{usedTitle}</Title>
                <Header {...props} />
                {props.children}
                <footer>
                    <a href="https://github.com/bonuspunkt/l4n-server">l4n-server</a>
                </footer>
            </div>
        );
    }

    const script = user ? <script src="/script.js" /> : undefined;

    return (
        <html>
            <head>
                <title>{usedTitle}</title>
                <link rel="stylesheet" href="/stylesheet.css" type="text/css" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <div id="main">
                    <div>
                        <Header {...props} />
                        {props.children}
                        <footer>
                            <a href="https://github.com/bonuspunkt/l4n-server">l4n-server</a>
                        </footer>
                    </div>
                </div>
                {script}
            </body>
        </html>
    );
};

export default DefaultLayout;
