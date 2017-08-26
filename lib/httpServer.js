const path = require('path');
const debug = require('debug')('l4n:server:httpServer');

const wwwRoot = path.resolve(__dirname, '../wwwRoot');
const viewDir = path.resolve(__dirname, '../wwwScript');

module.exports = (resolve) => {
    const settings = resolve('settings').httpServer;

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
    passport.deserializeUser((userId, callback) => {
        const userRepo = resolve('userRepo');
        const user = userRepo.byId(userId);
        callback(null, user);
    });

    // Setup Local Passport
    const LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(
        (username, password, callback) => {
            const userRepo = resolve('userRepo');
            userRepo.verify(username, password)
                .then(user => callback(null, user))
                .catch(error => callback(error));
        })
    );
    app.post('/auth/local',
        passport.authenticate('local', { failureRedirect: '/loginFailed' }),
        (req, res) => res.redirect('/')
    );

/*
    app.get('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/users/' + user.username);
            });
        })(req, res, next);
    });
*/

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
                debug('steam login', identifier);
                const userRepo = resolve('userRepo');
                userRepo.register({ name: profile.displayName, steamId: profile.id })
                    .then(user => done(null, user))
                    .catch(error => done(error));
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
    app.use(require('csurf')({ cookie: false }));
    app.use((err, req, res, next) => {
        if (err.code !== 'EBADCSRFTOKEN') return next(err);

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

    const store = resolve('publicStore');
    const getProps = (req, ...additional) => Object.assign(
        {},
        store.getState(),
        { user: req.user, csrfToken: req.csrfToken(), params: req.params },
        ...additional
    );

    app.get('/', (req, res) => res.render('view/Home', getProps(req)));
    app.get('/register', (req, res) => res.render('view/Register', getProps(req)));
    app.post('/register', (req, res) => {
        let { username, password1, password2 } = req.body;
        username = username.trim();
        if (!username) {
            return res.render('view/Register', getProps(req, { error: 'username is required' }));
        }
        if (!password1) {
            return res.render('view/Register', getProps(req, { error: 'password is required' }));
        }
        if (password1 !== password2) {
            return res.render('view/Register', getProps(req, { error: 'Password does not match' }));
        }

        const userRepo = resolve('userRepo');
        userRepo.register({ name: username, password: password1 })
            .then(() => res.redirect('/registered'))
            .catch(error => {
                debug(error);
                res.render('view/Register', getProps(req, { error: error.message }));
            });

    })
    app.get('/registered', (req, res) => res.render('view/Registered', getProps(req)));
    app.get('/login', (req, res) => res.render('view/Login', getProps(req)));
    app.get('/lobby/create/custom', (req, res) => res.render('view/CreateCustomLobby', getProps(req)));
    app.get('/provider/:provider/game/:game', (req, res) => {
        const provider = store.getState().providers.find(provider => provider.name === req.params.provider);
        const game = provider.games.find(game => game.id === req.params.game);
        const { lobbyDefinition } = game;

        res.render('view/CreateLobby', getProps(req, { provider, game, lobbyDefinition }))
    });
    app.post('/provider/:provider/game/:game', (req, res) => {
        const { provider, game } = req.params;
        const { name } = req.body;
        const lobbyRepo = resolve('lobbyRepo');
        const lobby = lobbyRepo.create(
            { ...req.body, provider, game },
            req.user
        ).then(result => {
            res.redirect(`/lobby/1`);
        })
    });
    app.get('/lobby/:lobbyId', (req, res) => {

    });

    //app.post('/lobby/:id/join');
    //app.post('/lobby/:id/part');
    //app.post('/lobby/:id/abandon');

    app.use(express.static(wwwRoot));


    //
    // setup WebSockets
    //
    require('express-ws')(app);
    app.ws('/', (ws, req) => {
        ws.on('message', (msg) => console.log(msg));
        console.log('socket', req.testing);
    });

    return app;
};
