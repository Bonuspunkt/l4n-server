module.exports = {
    // must be a https url for battle.net
    // NOTE: we only provide a HTTP server - use reverse proxy infront
    hostUrl: 'https://myDomain.com/',
    session: {
        // https://www.npmjs.com/package/express-session
        secret: 'the cat runs over the keyboard'
    },
    sessionStore: {
        // https://www.npmjs.com/package/connect-sqlite3
    },
    steam: {
        // get it from https://steamcommunity.com/dev/apikey
        apiKey: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },

    battleNet: {
        // get it from https://dev.battle.net/member/register
        clientID: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        clientSecret: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        region: 'eu',
    }
};
