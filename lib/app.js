const debug = require('debug')('l4n:server:app');
const path = require('path');

module.exports = resolve => {
    const settings = resolve('settings').httpServer;

    const express = require('express');
    const app = express();

    /* use this for production
    app.use((req, res, next) => {
        res.setHeader('Content-Security-Policy', `default-src 'self'`);
        next();
    })
    */

    //app.use(require('morgan')('dev'));

    const bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const { wwwRoot } = settings;
    app.use(express.static(wwwRoot));
    app.use(express.static(path.resolve(__dirname, '../wwwRoot')));

    //
    // Setup Sessions
    //
    const session = require('express-session');
    const SQLiteStore = require('connect-sqlite3')(session);
    const sessionConfig = Object.assign(
        {
            cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
            resave: true,
            saveUninitialized: false,
            store: new SQLiteStore(settings.sessionStore),
        },
        settings.session,
    );
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
    passport.use(
        new LocalStrategy((username, password, callback) => {
            const userRepo = resolve('userRepo');
            userRepo
                .verify(username, password)
                .then(user => callback(null, user))
                .catch(error => callback(error));
        }),
    );
    app.post(
        '/login',
        passport.authenticate('local', { failureRedirect: '/loginFailed' }),
        (req, res) => res.redirect('/'),
    );

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
        res.status(403);
        res.send('session has expired or form tampered with');
    });

    const renderView = resolve('renderView');
    app.post('/register', (req, res) => {
        let { username, password1, password2 } = req.body;
        username = username.trim();
        if (!username) {
            return renderView({ error: 'username is required' })(req, res);
        }
        if (!password1) {
            return renderView({ error: 'password is required' })(req, res);
        }
        if (password1 !== password2) {
            return renderView({ error: 'passwords do not match' })(req, res);
        }

        const userRepo = resolve('userRepo');
        userRepo
            .register({ name: username, password: password1 })
            .then(() => res.redirect('/registered'))
            .catch(error => {
                debug(error);
                renderView({ error: error.message })(req, res);
            });
    });

    app.post('/lobby', (req, res) => {
        const { body: lobby, user } = req;

        // TODO: validate lobby?

        const lobbyRepo = resolve('lobbyRepo');
        const { id: lobbyId } = lobbyRepo.create({ lobby, user });

        res.redirect(`/lobby/${lobbyId}`);
    });

    //
    app.post('/lobby/:lobbyId', (req, res) => {
        debug(req.params);
        const lobbyId = Number(req.params.lobbyId);
        const { user: { id: userId } } = req;
        const { action, popup, privateInfo } = req.body;
        const newState = Number(req.body.newState);

        const lobbyRepo = resolve('lobbyRepo');

        if (popup) {
            return renderView({ popup })(req, res);
        }

        switch (action) {
            case 'join':
                lobbyRepo.join({ lobbyId, userId });
                return res.redirect(`/lobby/${lobbyId}`);

            case 'leave':
                lobbyRepo.leave({ lobbyId, userId });
                return res.redirect('/');

            case 'destroy':
                lobbyRepo.destroy({ lobbyId, userId });
                return res.redirect('/');

            case 'changeState':
                lobbyRepo.changeState({ lobbyId, newState, userId, privateInfo });
                return res.redirect(`/lobby/${lobbyId}`);

            default:
                throw Error(`'${action}' not supported`);
        }
    });

    app.post('/lobby/:lobbyId/user/:userId', (req, res) => {
        if (req.body.action !== 'kick') throw Error('not supported');

        const lobbyId = Number(req.params.lobbyId);
        const userId = Number(req.params.userId);

        const lobbyRepo = resolve('lobbyRepo');
        lobbyRepo.kick({ lobbyId: lobbyId, byUserId: req.user.id, kickUserId: userId });

        return res.redirect(`/lobby/${lobbyId}`);
    });

    app.post('/user/:userId', (req, res) => {
        const userId = Number(req.params.userId);
        if (req.user.id !== userId) throw Error('forbidden');

        const userRepo = resolve('userRepo');
        userRepo.updateBio({ userId, bio: req.body.bio });
        return res.redirect(`/user/${userId}`);
    });

    return app;
};
