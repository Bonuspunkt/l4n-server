const path = require('path');
const debug = require('debug')('l4n:server:httpServer');

const wwwRoot = path.resolve(__dirname, '../wwwRoot');
const viewDir = path.resolve(__dirname, '../wwwScript');

module.exports = (settings) => {
    const express = require('express');
    const app = express();

    app.use(require('morgan')('dev'));

    const bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //
    // Setup Sessions
    //
    const session = require('express-session');
    const SQLiteStore = require('connect-sqlite3')(session);
    const sessionConfig = Object.assign({
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
        resave: true,
        saveUninitialized: false,
        store: new SQLiteStore(settings.sessionStore),
    }, settings.session);
    app.use(session(sessionConfig));

    //
    // Setup Passport
    //
    const passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, callback) => callback(null, user.id));
    passport.deserializeUser((userId, callback) => callback(null, { id: userId }));

    // Setup Local Passport
    const LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(
        (username, password, callback) => {
            if (username === 'bonus' && password === 'punkt') {
                return callback(null, { id: 1, user: 'bonus' });
            }
            return callback(null, false);
        })
    );
    app.post('/auth/local',
        passport.authenticate('local', { failureRedirect: '/loginFailed' }),
        (req, res) => res.redirect('/')
    );

    // Setup Steam Passport
    const { hostUrl, steam } = settings;
    if (steam) {
        const SteamStrategy = new require('passport-steam').Strategy;
        passport.use(
            new SteamStrategy({
                returnURL: hostUrl + 'auth/steam/callback',
                realm: hostUrl,
                apiKey: steam.apiKey
            },
            (identifier, profile, done) => {
                debug('steam login');
                debug(identifier);
                debug(profile.id, profile.displayName);
                done(null, profile);
            })
        );
        app.get('/auth/steam', passport.authenticate('steam'));
        app.get('/auth/steam/callback',
            passport.authenticate('steam', { failureRedirect: '/loginFailed' }),
            (req, res) => res.redirect('/')
        );
    }

    // Setup Battle.net Passport
    const { battleNet } = settings;
    if (battleNet) {
        const BnetStrategy = require('passport-bnet').Strategy;
        passport.use(new BnetStrategy({
                clientID: battleNet.clientID,
                clientSecret: battleNet.clientSecret,
                region: battleNet.region,
                callbackURL: hostUrl + 'auth/bnet/callback',
            },
            (accessToken, refreshToken, profile, done) => {
                debug('battle.net login');
                debug(accessToken);
                debug(refreshToken);
                debug(profile);
                done(null, profile);
            })
        );

        app.get('/auth/bnet', passport.authenticate('bnet'));
        app.get('/auth/bnet/callback',
            passport.authenticate('bnet', { failureRedirect: '/loginFailed' }),
            (req, res) => res.redirect('/')
        );
    }
    // logout
    app.post('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });


    //
    // Setup CSRF
    //
    app.use(require('csurf')());
    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)

        // handle CSRF token errors here
        res.status(403)
        res.send('session has expired or form tampered with');
    });

    //
    // Setup View
    //
    app.set('views', viewDir);
    app.set('view engine', 'jsx');
    app.engine('jsx', require('express-react-views').createEngine());

    const { store } = settings;
    const getProps = (req) => Object.assign(
        {},
        store.getState(),
        {
            user: req.user,
            csrfToken: req.csrfToken()
        });

    app.get('/', (req, res) => res.render('view/Home', getProps(req)));
    app.get('/login', (req, res) => res.render('view/Login', getProps(req)));
    app.get('/lobby/create/custom', (req, res) => res.render('view/CreateCustomLobby', getProps(req)));
    app.get('/lobby/create/:id', (req, res) => res.render('view/CreateLobby', getProps(req)));

    //app.post('/lobby/:id/join');
    //app.post('/lobby/:id/part');
    //app.post('/lobby/:id/abandon');


    app.use(express.static(wwwRoot));

    const WebSocketServer = require('uws').Server;
    const wss = new WebSocketServer({ server: app });
    wss.on('connection', function(ws) {
        ws.on('message', onMessage);
        ws.send('something');
    });

    return app;
};
