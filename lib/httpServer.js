const path = require('path');
const debug = require('debug')('l4n:server:httpServer');

const wwwRoot = path.resolve(__dirname, '../wwwRoot');
const viewDir = path.resolve(__dirname, '../wwwScript');

module.exports = (resolve) => {
    const settings = resolve('settings').httpServer;

    const express = require('express');
    const app = express();

    /* use this for production
    app.use((req, res, next) => {
        res.setHeader('Content-Security-Policy', `default-src 'self'`);
        next();
    })
    */

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
        if (!user) {
            return callback(null, null);
        }
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

    app.get('/', (req, res) => {
        const lobbyRepo = resolve('lobbyRepo');
        const { id:userId } = req.user || {};

        const openLobbies = lobbyRepo.allOpen(userId).map(lobby => {
            if (!lobby.provider) {
                return { ...lobby, game: { name: lobby.game } };
            } else {
                const provider = store.getState().providers.find(p => p.name === lobby.provider) || { games: [] };
                const game = provider.games.find(g => g.id === lobby.game);

                return { ...lobby, game };
            }
        });

        res.render('view/Home', getProps(req, { openLobbies }))
    });
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
            return res.render('view/Register', getProps(req, { error: 'passwords do not match' }));
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

    app.get('/lobby/custom', (req, res) => res.render('view/CreateCustomLobby', getProps(req)));
    app.post('/lobby/custom', (req, res) => {
        const { body: lobby, user } = req;

        // TODO: validate lobby

        const lobbyRepo = resolve('lobbyRepo');
        const lobbyId = lobbyRepo.create({ lobby, user });

        res.redirect(`/lobby/${ lobbyId }`);
    });

    app.get('/provider/:provider/game/:game', (req, res) => {
        const lobbyRepo = resolve('lobbyRepo');
        lobbyRepo.checkAlreadyInLobby({ userId: req.user.id });

        const provider = store.getState().providers.find(provider => provider.name === req.params.provider);
        const game = provider.games.find(game => game.id === req.params.game);
        const { lobbyDefinition } = game;

        res.render('view/CreateLobby', getProps(req, { provider, game, lobbyDefinition }))
    });
    app.post('/provider/:provider/game/:game', (req, res) => {
        const { provider, game } = req.params;
        const lobbyRepo = resolve('lobbyRepo');
        const lobbyId = lobbyRepo.create({
            ...req.body,
            provider,
            game,
            user: req.user
        });
        res.redirect(`/lobby/${ lobbyId }`);
    });
    app.get('/lobby/:lobbyId', (req, res) => {
        const { lobbyId } = req.params;
        const lobbyRepo = resolve('lobbyRepo');

        const lobby = lobbyRepo.byId(lobbyId);
        let provider, game;
        if (lobby.provider) {
            provider = store.getState().providers.find(p => p.name === lobby.provider);
            game = provider.games.find(g => g.id === lobby.game);
        } else {
            game = { name: lobby.game };
        }



        // TODO: Something like
        // lobbyHost ? lobby : { ...lobby, privateInfo: undefined }

        res.render('view/Lobby', getProps(req, { provider, lobby, game }))
    });
    app.post('/lobby/:lobbyId/join', (req, res) => {
        const { lobbyId } = req.params;
        const { user } = req;

        const lobbyRepo = resolve('lobbyRepo');
        lobbyRepo.join({ lobbyId, userId: user.id });
        return res.redirect(`/lobby/${ lobbyId }`);
    });
    app.post('/lobby/:lobbyId/leave', (req, res) => {
        const { lobbyId } = req.params;
        const { user } = req;

        const lobbyRepo = resolve('lobbyRepo');

        lobbyRepo.leave({ userId: user.id });
        return res.redirect('/');
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
        console.log('socket', req.user);
    });

    return app;
};
